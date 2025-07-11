terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "= 6.0.0"  # Exactly version 6.0.0, no upgrades automatically
    }
  }
  required_version = ">= 1.3.0"
}
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

#TO enable API's in Google cloud 
module "project_services" {
  source       = "../../modules/projects_services"
  project_id   = var.project_id
  service_list = var.service_list
}

module "cms_ui_bucket" {
  source = "../../modules/bucket"
  project_id                     = var.project_id
  region                         = var.region
  environment                    = var.environment
  make_public_bucket_accessible = var.make_public_bucket_accessible
  depends_on = [ module.project_services ]
}
