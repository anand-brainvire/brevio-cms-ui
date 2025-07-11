terraform {
  backend "gcs" {
    bucket = "booksummeries-prod-terraform-state"
    prefix = "cmsui"
  }
}