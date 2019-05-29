data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

variable "memory_size" {
  default = "128"
}

variable "timeout" {
  default = "90"
}

variable "function_name" {
  default = "kinesis_iot_writer"
}

variable "tags" {
  default = {}
}

variable "stream_name" {
  default = "IoTSensorDemo"
}

variable "stream_app" {
  default = "IoTSensorApp"
}

variable "dynamo_table" {
  default = "user-quadrant-data"
}

variable "cognito_pool" {
  default = "kinesisdemo"
}
