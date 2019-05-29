/* Permissions for the lambda function_arn
 *
 * Access to the S3 bucket
 * Access to Elasticsearch
 *
 * Logging to cloudwatch
 */

resource "aws_iam_role" "iam_for_lambda" {
  name_prefix = "lambda_iam"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda_kinesis_policy" {
  role        = "${aws_iam_role.iam_for_lambda.id}"
  name_prefix = "lambda-kinesis-writer"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Resource": "${aws_dynamodb_table.app-dynamodb-table.arn}"
        },
        {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/kinesis_iot_writer:*"
            ]
        }
    ]
}
EOF
}

resource "aws_lambda_function" "kinesis_writer" {
  filename         = "${data.archive_file.lambda_zip.output_path}"
  source_code_hash = "${data.archive_file.lambda_zip.output_base64sha256}"
  function_name    = "${var.function_name}"
  role             = "${aws_iam_role.iam_for_lambda.arn}"
  handler          = "index.handler"
  description      = "Kinesis Writer"
  runtime          = "nodejs8.10"
  memory_size      = "${var.memory_size}"
  timeout          = "${var.timeout}"

  # environment {
  #   variables = "${var.environment}"
  # }

  tags = "${var.tags}"
}

data "archive_file" "lambda_zip" {
  type = "zip"

  # add all directory into the zip, including supporting files
  source_dir = "lambda"

  output_path = "lambda-output/${var.function_name}.zip"
}
