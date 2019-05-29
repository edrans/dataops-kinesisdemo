provider "aws" {
  region  = "us-east-1"
  version = "~> 2.3"
}

# If the running Terraform version doesn't meet these constraints,
# an error is shown
terraform {
  required_version = ">= 0.11.13"

  backend "s3" {
    bucket = "kinesisdemo-us-east1-tfstate"
    key    = "kinesisdemo.tfstate"
    region = "us-east-1"
  }
}
