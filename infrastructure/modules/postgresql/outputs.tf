output "id" {
  description = "ID of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.main.id
}

output "fqdn" {
  description = "Fully qualified domain name"
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "database_id" {
  description = "ID of the database"
  value       = azurerm_postgresql_flexible_server_database.main.id
}

output "database_name" {
  description = "Name of the database"
  value       = azurerm_postgresql_flexible_server_database.main.name
}
