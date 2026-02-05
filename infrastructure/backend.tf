# Remote state configuration
# Using the existing storage account (stteacheiprod) in the main resource group
# Container 'tfstate' was created manually in the Azure Portal

terraform {
  backend "azurerm" {
    resource_group_name  = "rg-teachei-prod"
    storage_account_name = "stteacheiprod"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
