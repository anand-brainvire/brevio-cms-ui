terraform {
  backend "gcs" {
    bucket = "book-app-459606-production-terraform-state"
    prefix = "cmsui"
  }
}