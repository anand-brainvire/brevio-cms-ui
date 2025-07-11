terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0" # Using the latest stable major version
    }
  }
}


resource "google_storage_bucket" "public_static_site" {
  project                     = var.project_id
  name                        = "${var.project_id}-${var.environment}-cms-ui"
  location                    = var.region
  uniform_bucket_level_access = true
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
  force_destroy = false
}
resource "google_storage_bucket_iam_member" "public_access" {
  count  = var.make_public_bucket_accessible ? 1 : 0
  bucket = google_storage_bucket.public_static_site.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}