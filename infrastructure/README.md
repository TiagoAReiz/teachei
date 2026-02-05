# TeAchei Infrastructure

Infrastructure as Code (IaC) for TeAchei using Terraform on Azure.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Azure Resource Group                          │
│                         rg-teachei-prod                              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     ACR      │  │  PostgreSQL  │  │  Cosmos DB   │              │
│  │  acrteachei  │  │ psql-teachei │  │cosmos-teachei│              │
│  │   (Basic)    │  │   (B1ms)     │  │ (Serverless) │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Storage    │  │Container Apps│  │Log Analytics │              │
│  │ stteachei    │  │ teachei-api  │  │ log-teachei  │              │
│  │  (Blob)      │  │   (0.5 CPU)  │  │  (30 days)   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- [Terraform](https://www.terraform.io/downloads) >= 1.5.0
- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) >= 2.50
- Azure subscription with appropriate permissions

## Directory Structure

```
infrastructure/
├── main.tf                 # Root module
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── providers.tf            # Azure provider
├── backend.tf              # Remote state config
├── versions.tf             # Version constraints
├── environments/
│   ├── prod.tfvars         # Production values
│   └── staging.tfvars      # Staging values (template)
└── modules/
    ├── acr/                # Container Registry
    ├── postgresql/         # PostgreSQL Flexible Server
    ├── cosmosdb/           # Cosmos DB (Serverless)
    ├── storage/            # Storage Account + Blob
    ├── container-apps/     # Container Apps Environment + App
    └── monitoring/         # Log Analytics Workspace
```

## Initial Setup

### 1. State Storage

O state do Terraform é armazenado no Storage Account existente `stteacheiprod`, no container `tfstate`.

Este container já foi criado manualmente no Azure Portal. Não é necessário criar nada adicional.

### 2. Set Up Authentication

For local development, use Azure CLI:

```bash
az login
```

For CI/CD, create a Service Principal:

```bash
az ad sp create-for-rbac \
  --name "sp-terraform-teachei" \
  --role contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID
```

Add these secrets to GitHub Actions:
- `AZURE_CLIENT_ID`
- `AZURE_CLIENT_SECRET`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_TENANT_ID`

## Usage

### Initialize Terraform

```bash
cd infrastructure
terraform init
```

### Plan Changes

```bash
terraform plan \
  -var-file=environments/prod.tfvars \
  -var="postgres_admin_password=YOUR_PASSWORD" \
  -var="jwt_secret=YOUR_JWT_SECRET"
```

### Apply Changes

```bash
terraform apply \
  -var-file=environments/prod.tfvars \
  -var="postgres_admin_password=YOUR_PASSWORD" \
  -var="jwt_secret=YOUR_JWT_SECRET"
```

## Importing Existing Resources

If resources already exist in Azure, import them:

```bash
# Resource Group
terraform import azurerm_resource_group.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod

# ACR
terraform import module.acr.azurerm_container_registry.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.ContainerRegistry/registries/acrteachei

# PostgreSQL
terraform import module.postgresql.azurerm_postgresql_flexible_server.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.DBforPostgreSQL/flexibleServers/psql-teachei-prod

# Cosmos DB
terraform import module.cosmosdb.azurerm_cosmosdb_account.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-teachei-prod

# Storage Account
terraform import module.storage.azurerm_storage_account.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.Storage/storageAccounts/stteacheiprod

# Container Apps Environment
terraform import module.container_apps.azurerm_container_app_environment.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.App/managedEnvironments/managedEnvironment-rgteacheiprod-afe2

# Container App
terraform import module.container_apps.azurerm_container_app.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.App/containerApps/teachei-api

# Log Analytics
terraform import module.monitoring.azurerm_log_analytics_workspace.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.OperationalInsights/workspaces/workspacergteacheiprod8fe9
```

## Environment Variables

### Required Secrets (CI/CD)

| Variable | Description |
|----------|-------------|
| `AZURE_CLIENT_ID` | Service Principal client ID |
| `AZURE_CLIENT_SECRET` | Service Principal secret |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
| `AZURE_TENANT_ID` | Azure tenant ID |
| `POSTGRES_PASSWORD` | PostgreSQL admin password |
| `JWT_SECRET` | JWT signing secret |
| `MERCADOPAGO_ACCESS_TOKEN` | Mercado Pago token |
| `MERCADOPAGO_PUBLIC_KEY` | Mercado Pago public key |
| `MERCADOPAGO_WEBHOOK_SECRET` | Mercado Pago webhook secret |

## Outputs

After apply, you can view outputs:

```bash
terraform output

# Sensitive outputs
terraform output -json acr_admin_password
terraform output postgres_connection_string
```

Key outputs:
- `container_app_url` - API endpoint URL
- `acr_login_server` - Container Registry URL
- `postgres_fqdn` - PostgreSQL hostname
- `cosmos_endpoint` - Cosmos DB URI
- `storage_blob_endpoint` - Blob Storage URL

## Storage Containers

O Storage Account `stteacheiprod` contém:

| Container | Uso |
|-----------|-----|
| `tfstate` | Terraform state files |
| `profile-photos` | Fotos de perfil dos usuários |
| `vehicle-photos` | Fotos de referência das intenções |
| `$logs` | Logs do Azure (automático) |

## Cost Estimate

| Service | SKU | Monthly Cost (BRL) |
|---------|-----|-------------------|
| Container Apps | Consumption | ~R$0-100 |
| PostgreSQL | B1ms | ~R$60 |
| Cosmos DB | Serverless | ~R$0-50 |
| Container Registry | Basic | ~R$25 |
| Storage Account | Standard LRS | ~R$5 |
| **Total** | | **~R$100-250** |

## Troubleshooting

### State Lock

If state is locked:

```bash
terraform force-unlock LOCK_ID
```

### Provider Errors

Update providers:

```bash
terraform init -upgrade
```

### Import Issues

Check resource IDs in Azure Portal or:

```bash
az resource list --resource-group rg-teachei-prod --output table
```
