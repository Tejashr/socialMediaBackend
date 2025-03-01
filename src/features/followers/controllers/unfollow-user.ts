import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { FollowerCache } from '@service/redis/follower.cache';
import { followerQueue } from '@service/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();

export class Remove {
  public async follower(req: Request, res: Response): Promise<void> {
    const { followeeId, followerId } = req.params; // follower id is an userif of ther follower
    // update count in cache
    const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(
      `following:${req.currentUser!.userId}`,
      followeeId
    );
    const removeFolloweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followeeId}`, followerId);

    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1);
    const followeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);

    await Promise.all([removeFollowerFromCache, removeFolloweeFromCache, followersCount, followeeCount]);

    //send data to queue
    followerQueue.addFollowerJob('removeFollowerFromDB', {
      keyOne: `${followeeId}`, ///this is reverse in video
      keyTwo: `${followerId}`
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Unfollowed user now' });
  }
}
