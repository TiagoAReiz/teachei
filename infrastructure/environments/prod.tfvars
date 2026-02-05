# ==============================================================================
# Production Environment Configuration
# ==============================================================================

environment  = "prod"
location     = "brazilsouth"
project_name = "teachei"

# PostgreSQL
postgres_admin_username = "teachei_admin"
postgres_sku_name       = "B_Standard_B1ms"
postgres_storage_mb     = 32768
postgres_version        = "16"

# Container Apps
container_app_cpu          = 0.5
container_app_memory       = "1Gi"
container_app_min_replicas = 0
container_app_max_replicas = 3

# Existing resource names (for import compatibility)
container_apps_environment_name = "managedEnvironment-rgteacheiprod-afe2"
log_analytics_workspace_name    = "workspacergteacheiprod8fe9"
storage_account_name            = "stteacheiprod"

# Cosmos DB
cosmos_database_name = "teachei"

# Frontend
frontend_url = "https://teachei.shop"
cors_allowed_origins = [
  "https://teachei.shop",
  "http://localhost:3000",
  "http://localhost:8081"
]

# Tags
tags = {
  Project     = "TeAchei"
  Environment = "Production"
  ManagedBy   = "Terraform"
}

# =============================================================================
# SENSITIVE VARIABLES - Pass via environment variables or terraform.tfvars.local
# =============================================================================
# postgres_admin_password    = "..." # TF_VAR_postgres_admin_password
# jwt_secret                 = "..." # TF_VAR_jwt_secret
# mercadopago_access_token   = "..." # TF_VAR_mercadopago_access_token
# mercadopago_public_key     = "..." # TF_VAR_mercadopago_public_key
# mercadopago_webhook_secret = "..." # TF_VAR_mercadopago_webhook_secret
