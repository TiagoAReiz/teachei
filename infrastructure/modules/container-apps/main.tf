# ==============================================================================
# Azure Container Apps Module
# ==============================================================================

# Container Apps Environment
resource "azurerm_container_app_environment" "main" {
  name                       = var.environment_name
  resource_group_name        = var.resource_group_name
  location                   = var.location
  log_analytics_workspace_id = var.log_analytics_workspace_id

  tags = var.tags

  lifecycle {
    prevent_destroy = true
  }
}

# Container App
resource "azurerm_container_app" "main" {
  name                         = var.app_name
  resource_group_name          = var.resource_group_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  revision_mode                = "Single"

  template {
    container {
      name   = var.app_name
      image  = var.container_image
      cpu    = var.cpu
      memory = var.memory

      # Environment variables from map
      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }

      # Secret references
      dynamic "env" {
        for_each = var.secrets
        content {
          name        = upper(replace(env.key, "-", "_"))
          secret_name = env.key
        }
      }
    }

    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    dynamic "http_scale_rule" {
      for_each = var.enable_http_scaling ? [1] : []
      content {
        name                = "http-scaling"
        concurrent_requests = var.http_scaling_concurrent_requests
      }
    }
  }

  ingress {
    external_enabled = true
    target_port      = var.target_port
    transport        = "auto"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  # ACR Registry
  registry {
    server               = var.acr_login_server
    username             = var.acr_username
    password_secret_name = "acr-password"
  }

  # ACR password secret
  secret {
    name  = "acr-password"
    value = var.acr_password
  }

  # Application secrets
  dynamic "secret" {
    for_each = var.secrets
    content {
      name  = secret.key
      value = secret.value
    }
  }

  tags = var.tags

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      template[0].container[0].image,
      secret,
    ]
  }
}
