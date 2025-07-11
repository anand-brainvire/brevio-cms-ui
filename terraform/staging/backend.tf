terraform {
  backend "gcs" {
    bucket = "booksummeries-staging-terraform-state"
    prefix = "cmsui"
  }
}