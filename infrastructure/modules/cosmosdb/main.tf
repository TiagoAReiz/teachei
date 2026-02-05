# ==============================================================================
# Azure Cosmos DB Module (Serverless, NoSQL API)
# ==============================================================================

resource "azurerm_cosmosdb_account" "main" {
  name                = var.account_name
  resource_group_name = var.resource_group_name
  location            = var.location
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  # Enable serverless mode
  capabilities {
    name = "EnableServerless"
  }

  consistency_policy {
    consistency_level       = var.consistency_level
    max_interval_in_seconds = var.max_interval_in_seconds
    max_staleness_prefix    = var.max_staleness_prefix
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }

  tags = var.tags

  lifecycle {
    prevent_destroy = true
  }
}

# Database
resource "azurerm_cosmosdb_sql_database" "main" {
  name                = var.database_name
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name
}

# Container for purchase intentions (anuncios)
resource "azurerm_cosmosdb_sql_container" "anuncios" {
  name                = "anuncios"
  resource_group_name = var.resource_group_name
  account_name        = azurerm_cosmosdb_account.main.name
  database_name       = azurerm_cosmosdb_sql_database.main.name
  partition_key_paths = ["/usuarioId"]

  indexing_policy {
    indexing_mode = "consistent"

    included_path {
      path = "/*"
    }

    excluded_path {
      path = "/\"_etag\"/?"
    }
  }
}
