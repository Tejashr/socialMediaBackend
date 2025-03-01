terraform {
  backend "s3" {
    bucket  = "chatty-app-terraform-state-pavan"
    key     = "develop/chatapp.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"


  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    ManagedBy   = "Terraform"
    Owner       = "Pavan Kumar"
  }
}
