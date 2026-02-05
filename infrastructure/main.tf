# ==============================================================================
# TeAchei Infrastructure - Main Configuration
# ==============================================================================

locals {
  # Naming convention
  resource_group_name = "rg-${var.project_name}-${var.environment}"
  
  # Common tags
  common_tags = merge(var.tags, {
    Environment = var.environment
  })
}

# ==============================================================================
# Resource Group
# ==============================================================================

resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location
  tags     = local.common_tags

  lifecycle {
    prevent_destroy = true
  }
}

# ==============================================================================
# Monitoring (Log Analytics)
# ==============================================================================

module "monitoring" {
  source = "./modules/monitoring"

  # Use existing name for import compatibility
  name                = var.log_analytics_workspace_name != "" ? var.log_analytics_workspace_name : "log-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  tags                = local.common_tags
}

# ==============================================================================
# Container Registry
# ==============================================================================

module "acr" {
  source = "./modules/acr"

  name                = "acr${var.project_name}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  tags                = local.common_tags
}

# ==============================================================================
# PostgreSQL
# ==============================================================================

module "postgresql" {
  source = "./modules/postgresql"

  name                = "psql-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  
  admin_username = var.postgres_admin_username
  admin_password = var.postgres_admin_password
  
  sku_name    = var.postgres_sku_name
  storage_mb  = var.postgres_storage_mb
  version     = var.postgres_version
  
  database_name = var.project_name
  
  tags = local.common_tags
}

# ==============================================================================
# Cosmos DB
# ==============================================================================

module "cosmosdb" {
  source = "./modules/cosmosdb"

  account_name        = "cosmos-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  
  database_name = var.cosmos_database_name
  
  tags = local.common_tags
}

# ==============================================================================
# Storage Account
# ==============================================================================

module "storage" {
  source = "./modules/storage"

  # Use existing name for import compatibility
  name                = var.storage_account_name != "" ? var.storage_account_name : "st${var.project_name}${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  
  cors_allowed_origins = var.cors_allowed_origins
  
  # Blob containers for photos
  containers = [
    {
      name        = "profile-photos"
      access_type = "blob"
    },
    {
      name        = "vehicle-photos"
      access_type = "blob"
    }
  ]
  
  tags = local.common_tags
}

# ==============================================================================
# Container Apps
# ==============================================================================

module "container_apps" {
  source = "./modules/container-apps"

  # Note: Using existing names to avoid resource recreation
  # Original names from Azure Portal for import compatibility
  environment_name    = var.container_apps_environment_name != "" ? var.container_apps_environment_name : "env-${var.project_name}-${var.environment}"
  app_name            = "${var.project_name}-api"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  
  log_analytics_workspace_id = module.monitoring.workspace_id
  
  # Container configuration
  container_image = "${module.acr.login_server}/teachei-api:latest"
  cpu             = var.container_app_cpu
  memory          = var.container_app_memory
  min_replicas    = var.container_app_min_replicas
  max_replicas    = var.container_app_max_replicas
  
  # Registry configuration
  acr_login_server = module.acr.login_server
  acr_username     = module.acr.admin_username
  acr_password     = module.acr.admin_password
  
  # Environment variables
  env_vars = {
    SPRING_PROFILES_ACTIVE = "prod"
    POSTGRES_HOST          = module.postgresql.fqdn
    POSTGRES_PORT          = "5432"
    POSTGRES_DB            = var.project_name
    POSTGRES_USER          = var.postgres_admin_username
    COSMOS_ENDPOINT        = module.cosmosdb.endpoint
    COSMOS_DATABASE        = var.cosmos_database_name
    FRONTEND_URL           = var.frontend_url
    CORS_ALLOWED_ORIGINS   = join(",", var.cors_allowed_origins)
    AZURE_STORAGE_BLOB_ENDPOINT = module.storage.blob_endpoint
  }
  
  # Secrets
  secrets = {
    postgres-password         = var.postgres_admin_password
    cosmos-key                = module.cosmosdb.primary_key
    jwt-secret                = var.jwt_secret
    mercadopago-access-token  = var.mercadopago_access_token
    mercadopago-public-key    = var.mercadopago_public_key
    mercadopago-webhook-secret = var.mercadopago_webhook_secret
    azure-storage-connection-string = module.storage.connection_string
  }
  
  tags = local.common_tags
}
