project_id  = "book-app-459606"
region      = "us-central1"
zone        = "us-central1-a"
environment = "staging"

#for bucket
make_public_bucket_accessible = true


#for projects_services
service_list = [
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
  "iam.googleapis.com",
  "storage.googleapis.com",
  "spanner.googleapis.com",
  "cloudidentity.googleapis.com",
  "cloudkms.googleapis.com",
  "cloudbuild.googleapis.com",
  "cloudscheduler.googleapis.com",
  "deploymentmanager.googleapis.com",
  "cloudtrace.googleapis.com",
  "networkservices.googleapis.com",
  "dns.googleapis.com",
  "servicenetworking.googleapis.com",
  "pubsub.googleapis.com",
  "artifactregistry.googleapis.com",
  "cloudresourcemanager.googleapis.com"
]