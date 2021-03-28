terraform {
  backend "s3" {
    bucket = "tempest-infra"
    key = "terraform.tfstate"
    region = "us-west-2"
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
  region  = "us-west-2"
}

resource "aws_s3_bucket" "b" {
  bucket = "tempest-files"
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
  bucket = "tempest-infra"
  acl    = "private"

  tags = {
    Name = "Infra for Tempest"
  }
}