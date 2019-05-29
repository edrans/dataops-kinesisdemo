resource "aws_cognito_identity_pool" "main" {
  identity_pool_name               = "${var.cognito_pool}"
  allow_unauthenticated_identities = true
}
