resource "aws_kinesis_stream" "iot_sensor_stream" {
  name        = "${var.stream_name}"
  shard_count = 1
}

resource "aws_kinesis_analytics_application" "iot_sensor_application" {
  name = "${var.stream_app}"

  code = "${file("kinesis.sql")}"

  inputs {
    name_prefix = "SOURCE_SQL_STREAM"

    kinesis_stream {
      resource_arn = "${aws_kinesis_stream.iot_sensor_stream.arn}"
      role_arn     = "${aws_iam_role.iam_for_kinesis.arn}"
    }

    parallelism {
      count = 1
    }

    schema {
      record_columns {
        mapping  = "$.recordTime"
        name     = "recordTime"
        sql_type = "DOUBLE"
      }

      record_columns {
        mapping  = "$.cognitoId"
        name     = "cognitoId"
        sql_type = "VARCHAR(64)"
      }

      record_columns {
        mapping  = "$.device"
        name     = "device"
        sql_type = "VARCHAR(8)"
      }

      record_columns {
        mapping  = "$.os"
        name     = "os"
        sql_type = "VARCHAR(8)"
      }

      record_columns {
        mapping  = "$.sensorname"
        name     = "sensorname"
        sql_type = "VARCHAR(32)"
      }

      record_columns {
        mapping  = "$.quadrant"
        name     = "quadrant"
        sql_type = "VARCHAR(2)"
      }

      record_encoding = "UTF-8"

      record_format {
        mapping_parameters {
          json {
            record_row_path = "$"
          }
        }
      }
    }
  }
}

resource "aws_iam_role" "iam_for_kinesis" {
  name_prefix = "kinesis_iam"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "kinesisanalytics.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "kinesis_policy" {
  role        = "${aws_iam_role.iam_for_kinesis.id}"
  name_prefix = "Kinesis_analytics"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ReadInputKinesis",
            "Effect": "Allow",
            "Action": [
                "kinesis:DescribeStream",
                "kinesis:GetShardIterator",
                "kinesis:GetRecords"
            ],
            "Resource": [
                "arn:aws:kinesis:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:stream/${var.stream_name}"
            ]
        },
        {
            "Sid": "ReadEncryptedInputKinesisStream",
            "Effect": "Allow",
            "Action": [
                "kms:Decrypt"
            ],
            "Resource": [
                "arn:aws:kms:region:account-id:key/%SOURCE_STREAM_ENCRYPTION_KEY_PLACEHOLDER%"
            ],
            "Condition": {
                "StringEquals": {
                    "kms:ViaService": "kinesis.us-east-1.amazonaws.com"
                },
                "StringLike": {
                    "kms:EncryptionContext:aws:kinesis:arn": "arn:aws:kinesis:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:stream/${var.stream_name}"
                }
            }
        },
        {
            "Sid": "UseLambdaFunction",
            "Effect": "Allow",
            "Action": [
                "lambda:InvokeFunction",
                "lambda:GetFunctionConfiguration"
            ],
            "Resource": [
                "${aws_lambda_function.kinesis_writer.invoke_arn}"
            ]
        }
    ]
}
EOF
}
