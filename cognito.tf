resource "aws_cognito_user_pool" "pool" {
  name = "Tempest-Users"
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"

  user_pool_id = aws_cognito_user_pool.pool.id

  explicit_auth_flows = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "tempest-files"
  user_pool_id = aws_cognito_user_pool.pool.id
}
