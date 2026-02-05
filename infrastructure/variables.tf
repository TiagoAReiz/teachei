# ==============================================================================
# Environment Configuration
# ==============================================================================

variable "environment" {
  description = "Environment name (prod, staging)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "brazilsouth"
}

variable "project_name" {
  description = "Project name used in resource naming"
  type        = string
  default     = "teachei"
}

# ==============================================================================
# PostgreSQL Configuration
# ==============================================================================

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "teachei_admin"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "postgres_sku_name" {
  description = "PostgreSQL SKU name"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "postgres_storage_mb" {
  description = "PostgreSQL storage size in MB"
  type        = number
  default     = 32768
}

variable "postgres_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "16"
}

# ==============================================================================
# Cosmos DB Configuration
# ==============================================================================

variable "cosmos_database_name" {
  description = "Cosmos DB database name"
  type        = string
  default     = "teachei"
}

# ==============================================================================
# Container Apps Configuration
# ==============================================================================

variable "container_app_cpu" {
  description = "CPU allocation for container app"
  type        = number
  default     = 0.5
}

variable "container_app_memory" {
  description = "Memory allocation for container app"
  type        = string
  default     = "1Gi"
}

variable "container_app_min_replicas" {
  description = "Minimum number of container replicas"
  type        = number
  default     = 0
}

variable "container_app_max_replicas" {
  description = "Maximum number of container replicas"
  type        = number
  default     = 3
}

variable "container_apps_environment_name" {
  description = "Name of the Container Apps environment (use existing name for import)"
  type        = string
  default     = ""
}

variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace (use existing name for import)"
  type        = string
  default     = ""
}

variable "storage_account_name" {
  description = "Name of the Storage Account (use existing name for import)"
  type        = string
  default     = ""
}

# ==============================================================================
# Application Configuration (Secrets)
# ==============================================================================

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "mercadopago_access_token" {
  description = "Mercado Pago access token"
  type        = string
  sensitive   = true
  default     = ""
}

variable "mercadopago_public_key" {
  description = "Mercado Pago public key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "mercadopago_webhook_secret" {
  description = "Mercado Pago webhook secret"
  type        = string
  sensitive   = true
  default     = ""
}

# ==============================================================================
# Frontend Configuration
# ==============================================================================

variable "frontend_url" {
  description = "Frontend application URL for CORS"
  type        = string
  default     = "https://teachei.shop"
}

variable "cors_allowed_origins" {
  description = "List of allowed CORS origins"
  type        = list(string)
  default     = ["https://teachei.shop", "http://localhost:3000"]
}

# ==============================================================================
# Tags
# ==============================================================================

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "TeAchei"
    ManagedBy   = "Terraform"
  }
}
