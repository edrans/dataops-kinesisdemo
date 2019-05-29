provider "aws" {
  region  = "us-east-1"
  version = "~> 2.3"
}

# If the running Terraform version doesn't meet these constraints,
# an error is shown
terraform {
  required_version = ">= 0.11.4"
}
