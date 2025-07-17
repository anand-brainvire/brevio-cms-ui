terraform {
  backend "gcs" {
    bucket = "book-app-459606-uat-terraform-state"
    prefix = "cmsui"
  }
}