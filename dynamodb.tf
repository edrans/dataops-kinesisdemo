resource "aws_dynamodb_table" "app-dynamodb-table" {
  name           = "${var.dynamo_table}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5

  hash_key = "dataType"

  range_key = "windowtime"

  #
  attribute {
    name = "dataType"
    type = "S"
  }

  attribute {
    name = "windowtime"
    type = "S"
  }

  tags = "${var.tags}"
}
