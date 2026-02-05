# ==============================================================================
# Resource Group
# ==============================================================================

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_id" {
  description = "ID of the resource group"
  value       = azurerm_resource_group.main.id
}

# ==============================================================================
# Container Registry
# ==============================================================================

output "acr_login_server" {
  description = "ACR login server URL"
  value       = module.acr.login_server
}

output "acr_admin_username" {
  description = "ACR admin username"
  value       = module.acr.admin_username
  sensitive   = true
}

output "acr_admin_password" {
  description = "ACR admin password"
  value       = module.acr.admin_password
  sensitive   = true
}

# ==============================================================================
# PostgreSQL
# ==============================================================================

output "postgres_fqdn" {
  description = "PostgreSQL fully qualified domain name"
  value       = module.postgresql.fqdn
}

output "postgres_connection_string" {
  description = "PostgreSQL connection string (without password)"
  value       = "postgresql://${var.postgres_admin_username}@${module.postgresql.fqdn}:5432/${var.project_name}?sslmode=require"
  sensitive   = true
}

# ==============================================================================
# Cosmos DB
# ==============================================================================

output "cosmos_endpoint" {
  description = "Cosmos DB endpoint URI"
  value       = module.cosmosdb.endpoint
}

output "cosmos_primary_key" {
  description = "Cosmos DB primary key"
  value       = module.cosmosdb.primary_key
  sensitive   = true
}

output "cosmos_connection_string" {
  description = "Cosmos DB connection string"
  value       = module.cosmosdb.connection_string
  sensitive   = true
}

# ==============================================================================
# Storage Account
# ==============================================================================

output "storage_account_name" {
  description = "Storage account name"
  value       = module.storage.account_name
}

output "storage_blob_endpoint" {
  description = "Storage blob endpoint URL"
  value       = module.storage.blob_endpoint
}

output "storage_connection_string" {
  description = "Storage account connection string"
  value       = module.storage.connection_string
  sensitive   = true
}

output "storage_primary_access_key" {
  description = "Storage account primary access key"
  value       = module.storage.primary_access_key
  sensitive   = true
}

# ==============================================================================
# Container Apps
# ==============================================================================

output "container_app_fqdn" {
  description = "Container App fully qualified domain name"
  value       = module.container_apps.app_fqdn
}

output "container_app_url" {
  description = "Container App URL"
  value       = "https://${module.container_apps.app_fqdn}"
}

# ==============================================================================
# Monitoring
# ==============================================================================

output "log_analytics_workspace_id" {
  description = "Log Analytics workspace ID"
  value       = module.monitoring.workspace_id
}
