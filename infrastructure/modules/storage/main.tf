# ==============================================================================
# Azure Storage Account Module
# ==============================================================================

resource "azurerm_storage_account" "main" {
  name                     = var.name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = var.account_tier
  account_replication_type = var.replication_type
  
  # Allow blob public access for public containers
  allow_nested_items_to_be_public = true

  blob_properties {
    dynamic "cors_rule" {
      for_each = length(var.cors_allowed_origins) > 0 ? [1] : []
      content {
        allowed_origins    = var.cors_allowed_origins
        allowed_methods    = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"]
        allowed_headers    = ["*"]
        exposed_headers    = ["*"]
        max_age_in_seconds = 3600
      }
    }

    delete_retention_policy {
      days = var.blob_retention_days
    }
  }

  tags = var.tags

  lifecycle {
    prevent_destroy = true
  }
}

# Blob containers
resource "azurerm_storage_container" "containers" {
  for_each = { for c in var.containers : c.name => c }

  name                  = each.value.name
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = each.value.access_type
}
