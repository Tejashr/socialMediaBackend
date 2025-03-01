import { INotification, INotificationDocument } from '@notification/interfaces/notification.interface';
import { notificationService } from '@service/db/notification.service';
import mongoose, { model, Model, Schema } from 'mongoose';

//reason for not adding it in the cache is that we have to decide what kind of data we have to add it in the cache
//not every data is req to add it in the cache (based on frequency of usage and data can be easily fetched from db)(which user can wait for)

const notificationSchema: Schema = new Schema({
  userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  message: { type: String, default: '' },
  notificationType: String,
  entityId: mongoose.Types.ObjectId,
  createdItemId: mongoose.Types.ObjectId,
  comment: { type: String, default: '' },
  reaction: { type: String, default: '' },
  post: { type: String, default: '' },
  imgId: { type: String, default: '' },
  imgVersion: { type: String, default: '' },
  gifUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now() }
});

notificationSchema.methods.insertNotification = async function (body: INotification) {
  const { userTo, userFrom, message, notificationType, entityId, createdItemId, comment, reaction, post, imgId, imgVersion, gifUrl } = body;

  await NotificationModel.create({
    userTo,
    userFrom,
    message,
    notificationType,
    entityId,
    createdItemId,
    comment,
    reaction,
    post,
    imgId,
    imgVersion,
    gifUrl
  });
  try {
    const notifications: INotificationDocument[] = await notificationService.getNotifications(userTo);
    return notifications;
  } catch (error) {
    return error;
  }
};

const NotificationModel: Model<INotificationDocument> = model<INotificationDocument>('Notification', notificationSchema, 'Notification');

export { NotificationModel };
