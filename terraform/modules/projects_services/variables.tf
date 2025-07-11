variable "project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "service_list" {
  type        = list(string)
  description = "List of Google Cloud services (APIs) to enable"
}