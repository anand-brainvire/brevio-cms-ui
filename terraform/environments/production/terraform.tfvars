project_id  = "book-app-459606"
region      = "us-central1"
zone        = "us-central1-a"
environment = "production"

#for bucket
make_public_bucket_accessible = true


#for projects_services
service_list = [
    "serviceusage.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudtasks.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com",
    "cloudscheduler.googleapis.com",
    "iam.googleapis.com",
    "servicenetworking.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "pubsub.googleapis.com",
    "dns.googleapis.com",
    "networkservices.googleapis.com",
    "cloudkms.googleapis.com",
    "cloudtrace.googleapis.com",
    "cloudidentity.googleapis.com",
    "sourcerepo.googleapis.com"
  ]