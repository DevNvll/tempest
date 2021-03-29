terraform {
  backend "s3" {
    bucket = "tempest-infra-state"
    key = "terraform.tfstate"
    region = "us-east-1"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

resource "aws_s3_bucket" "b" {
  bucket = "tempest-storage"
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  tags = {
    Name = "Files for Tempest"
  }
}

resource "aws_s3_bucket" "c" {
  bucket = "tempest-infra-state"
  acl    = "private"

  tags = {
    Name = "Infra for Tempest"
  }
}