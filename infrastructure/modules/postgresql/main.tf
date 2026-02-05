# ==============================================================================
# Azure PostgreSQL Flexible Server Module
# ==============================================================================

resource "azurerm_postgresql_flexible_server" "main" {
  name                   = var.name
  resource_group_name    = var.resource_group_name
  location               = var.location
  
  version                = var.version
  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  
  sku_name   = var.sku_name
  storage_mb = var.storage_mb
  
  zone = var.availability_zone

  public_network_access_enabled = var.public_network_access_enabled

  tags = var.tags

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      zone,
      high_availability
    ]
  }
}

# Database
resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.database_name
  server_id = azurerm_postgresql_flexible_server.main.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

# Firewall rule to allow Azure services
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Firewall rule to allow all (for development - consider restricting in production)
resource "azurerm_postgresql_flexible_server_firewall_rule" "allow_all" {
  count            = var.allow_all_ips ? 1 : 0
  name             = "AllowAll"
  server_id        = azurerm_postgresql_flexible_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}
