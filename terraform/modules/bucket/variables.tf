# variables.tf
variable "project_id" {
  description = "Your Google Cloud Project ID."
  type        = string
}

variable "region" {
  description = "The region where your Cloud Run services are deployed. Serverless NEGs are regional."
  type        = string
}
variable "make_public_bucket_accessible" {
  description = "Whether to make the public bucket publicly accessible"
  type        = bool
  default     = true
}
variable "environment" {
  type        = string
  description = "Environment name (e.g., staging, production)"
}