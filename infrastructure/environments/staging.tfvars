# ==============================================================================
# Staging Environment Configuration (Template - Not yet provisioned)
# ==============================================================================

environment  = "staging"
location     = "brazilsouth"
project_name = "teachei"

# PostgreSQL (smaller for staging)
postgres_admin_username = "teachei_admin"
postgres_sku_name       = "B_Standard_B1ms"
postgres_storage_mb     = 32768
postgres_version        = "16"

# Container Apps (smaller for staging)
container_app_cpu          = 0.25
container_app_memory       = "0.5Gi"
container_app_min_replicas = 0
container_app_max_replicas = 1

# Cosmos DB
cosmos_database_name = "teachei"

# Frontend (staging URL)
frontend_url = "https://staging.teachei.shop"
cors_allowed_origins = [
  "https://staging.teachei.shop",
  "http://localhost:3000"
]

# Tags
tags = {
  Project     = "TeAchei"
  Environment = "Staging"
  ManagedBy   = "Terraform"
}
