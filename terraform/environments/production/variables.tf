#default & common variables
variable "project_id" {
  type = string
}

variable "region" {
  type = string
  default = "us-central1"
}

variable "zone" {
  type = string
  default = "us-central1-a"
}
variable "environment" {
  type        = string
  description = "Environment name (e.g., staging, prod)"
}



#variables for bucket
variable "make_public_bucket_accessible" {
  type        = bool
  default     = true
  description = "Whether the bucket should be public"
}


#varibales for projects_services
variable "service_list" {
  type = list(string)
  default = [
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudtasks.googleapis.com",
    "secretmanager.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "iam.googleapis.com"
  ]
}