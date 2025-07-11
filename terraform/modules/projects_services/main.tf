resource "google_project_service" "required_services" {
  for_each = toset(var.service_list)

  project = var.project_id
  service = each.value

  disable_on_destroy = false
}