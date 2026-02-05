output "environment_id" {
  description = "ID of the Container Apps environment"
  value       = azurerm_container_app_environment.main.id
}

output "environment_default_domain" {
  description = "Default domain of the environment"
  value       = azurerm_container_app_environment.main.default_domain
}

output "app_id" {
  description = "ID of the Container App"
  value       = azurerm_container_app.main.id
}

output "app_fqdn" {
  description = "FQDN of the Container App"
  value       = azurerm_container_app.main.ingress[0].fqdn
}

output "app_url" {
  description = "URL of the Container App"
  value       = "https://${azurerm_container_app.main.ingress[0].fqdn}"
}

output "latest_revision_name" {
  description = "Name of the latest revision"
  value       = azurerm_container_app.main.latest_revision_name
}
