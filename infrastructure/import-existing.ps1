# ==============================================================================
# Script to Import Existing Azure Resources into Terraform State
# ==============================================================================
# 
# Usage: .\import-existing.ps1 -SubscriptionId "your-subscription-id"
#
# Prerequisites:
# - Azure CLI logged in (az login)
# - Terraform initialized (terraform init)
#

param(
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId
)

$ErrorActionPreference = "Stop"

# Resource Group
$RG = "rg-teachei-prod"

Write-Host "Starting import of existing Azure resources..." -ForegroundColor Cyan
Write-Host "Subscription: $SubscriptionId" -ForegroundColor Yellow
Write-Host "Resource Group: $RG" -ForegroundColor Yellow
Write-Host ""

# Function to import a resource
function Import-TerraformResource {
    param(
        [string]$TerraformAddress,
        [string]$AzureResourceId,
        [string]$Description
    )
    
    Write-Host "Importing: $Description" -ForegroundColor Green
    Write-Host "  Address: $TerraformAddress" -ForegroundColor Gray
    Write-Host "  Azure ID: $AzureResourceId" -ForegroundColor Gray
    
    try {
        terraform import $TerraformAddress $AzureResourceId
        Write-Host "  SUCCESS" -ForegroundColor Green
    }
    catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Base path for resources
$BasePath = "/subscriptions/$SubscriptionId/resourceGroups/$RG"

# 1. Resource Group
Import-TerraformResource `
    -TerraformAddress "azurerm_resource_group.main" `
    -AzureResourceId "/subscriptions/$SubscriptionId/resourceGroups/$RG" `
    -Description "Resource Group"

# 2. Log Analytics Workspace
Import-TerraformResource `
    -TerraformAddress "module.monitoring.azurerm_log_analytics_workspace.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.OperationalInsights/workspaces/workspacergteacheiprod8fe9" `
    -Description "Log Analytics Workspace"

# 3. Container Registry
Import-TerraformResource `
    -TerraformAddress "module.acr.azurerm_container_registry.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.ContainerRegistry/registries/acrteachei" `
    -Description "Azure Container Registry"

# 4. PostgreSQL Flexible Server
Import-TerraformResource `
    -TerraformAddress "module.postgresql.azurerm_postgresql_flexible_server.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-teachei-prod" `
    -Description "PostgreSQL Flexible Server"

# 5. PostgreSQL Database
Import-TerraformResource `
    -TerraformAddress "module.postgresql.azurerm_postgresql_flexible_server_database.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-teachei-prod/databases/teachei" `
    -Description "PostgreSQL Database"

# 6. PostgreSQL Firewall Rule (AllowAzureServices)
Import-TerraformResource `
    -TerraformAddress "module.postgresql.azurerm_postgresql_flexible_server_firewall_rule.allow_azure_services" `
    -AzureResourceId "$BasePath/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-teachei-prod/firewallRules/AllowAzureServices" `
    -Description "PostgreSQL Firewall Rule (Azure Services)"

# 7. Cosmos DB Account
Import-TerraformResource `
    -TerraformAddress "module.cosmosdb.azurerm_cosmosdb_account.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-teachei-prod" `
    -Description "Cosmos DB Account"

# 8. Cosmos DB Database
Import-TerraformResource `
    -TerraformAddress "module.cosmosdb.azurerm_cosmosdb_sql_database.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-teachei-prod/sqlDatabases/teachei" `
    -Description "Cosmos DB SQL Database"

# 9. Storage Account
Import-TerraformResource `
    -TerraformAddress "module.storage.azurerm_storage_account.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.Storage/storageAccounts/stteacheiprod" `
    -Description "Storage Account"

# 10. Storage Container - profile-photos (if exists)
Import-TerraformResource `
    -TerraformAddress 'module.storage.azurerm_storage_container.containers["profile-photos"]' `
    -AzureResourceId "https://stteacheiprod.blob.core.windows.net/profile-photos" `
    -Description "Storage Container (profile-photos)"

# 11. Storage Container - vehicle-photos (if exists)
Import-TerraformResource `
    -TerraformAddress 'module.storage.azurerm_storage_container.containers["vehicle-photos"]' `
    -AzureResourceId "https://stteacheiprod.blob.core.windows.net/vehicle-photos" `
    -Description "Storage Container (vehicle-photos)"

# 12. Container Apps Environment
Import-TerraformResource `
    -TerraformAddress "module.container_apps.azurerm_container_app_environment.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.App/managedEnvironments/managedEnvironment-rgteacheiprod-afe2" `
    -Description "Container Apps Environment"

# 13. Container App
Import-TerraformResource `
    -TerraformAddress "module.container_apps.azurerm_container_app.main" `
    -AzureResourceId "$BasePath/providers/Microsoft.App/containerApps/teachei-api" `
    -Description "Container App (teachei-api)"

Write-Host ""
Write-Host "Import complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run 'terraform plan' to verify state matches reality"
Write-Host "2. Adjust any differences in Terraform configuration"
Write-Host "3. Run 'terraform apply' only after plan shows no changes"
