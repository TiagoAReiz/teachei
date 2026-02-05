# Design: Terraform Infrastructure as Code

## Context

O TeAchei roda em Azure com os seguintes recursos criados manualmente:
- Resource Group: `rg-teachei-prod` (Brazil South)
- Container Registry: `acrteachei` (Basic SKU)
- PostgreSQL Flexible Server: `psql-teachei-prod` (Standard_B1ms, 32GB)
- Cosmos DB: `cosmos-teachei-prod` (Serverless, NoSQL API)
- Container Apps Environment + App: `teachei-api`
- Storage Account: `stteacheiprod` (Blob Storage para fotos)
- Log Analytics Workspace: `workspacergteacheiprod8fe9`

## Goals

- Infraestrutura 100% declarativa e versionada
- Capacidade de recriar ambiente do zero
- Facilitar criação de ambiente staging
- Documentação viva da infraestrutura

## Non-Goals

- Migração automática de dados entre ambientes
- Multi-region deployment
- Azure Key Vault (futuro)
- Terraform Cloud (usaremos backend em Azure Storage)

## Architecture

```
infrastructure/
├── main.tf                 # Root module, resource group
├── variables.tf            # Input variables
├── outputs.tf              # Output values
├── providers.tf            # Azure provider config
├── backend.tf              # Remote state config
├── versions.tf             # Terraform/provider versions
├── terraform.tfvars        # Valores default (não sensíveis)
├── environments/
│   ├── prod.tfvars         # Produção
│   └── staging.tfvars      # Staging (futuro)
└── modules/
    ├── acr/                # Container Registry
    ├── postgresql/         # PostgreSQL Flexible Server
    ├── cosmosdb/           # Cosmos DB Account + Database
    ├── storage/            # Storage Account + Containers
    ├── container-apps/     # Environment + Container App
    └── monitoring/         # Log Analytics Workspace
```

## Decisions

### 1. Modular Structure

**Decisão**: Cada serviço Azure em módulo separado.

**Rationale**: 
- Facilita reutilização
- Isolamento de mudanças
- Mais fácil de entender e manter

### 2. Remote State in Azure Storage

**Decisão**: Usar o Storage Account existente (`stteacheiprod`) para armazenar o state.

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-teachei-prod"
    storage_account_name = "stteacheiprod"
    container_name       = "tfstate"
    key                  = "prod.terraform.tfstate"
  }
}
```

**Rationale**: Reutilizar o storage existente evita criar recursos adicionais e simplifica a gestão.

**Alternativas consideradas**:
- Storage separado (`rg-terraform-state`): Mais isolamento, mas overhead desnecessário
- Terraform Cloud: Complexidade desnecessária para projeto pequeno
- Local state: Não seguro, não colaborativo

### 3. Naming Convention

**Decisão**: Manter nomes existentes para evitar recriação de recursos.

| Recurso | Nome |
|---------|------|
| Resource Group | `rg-teachei-{env}` |
| Container Registry | `acrteachei` |
| PostgreSQL | `psql-teachei-{env}` |
| Cosmos DB | `cosmos-teachei-{env}` |
| Storage Account | `stteachei{env}` |
| Container Apps Env | `env-teachei-{env}` |
| Container App | `teachei-api` |
| Log Analytics | `log-teachei-{env}` |

### 4. Sensitive Variables

**Decisão**: Secrets via environment variables no CI/CD.

```bash
# GitHub Actions
TF_VAR_postgres_password="${{ secrets.POSTGRES_PASSWORD }}"
TF_VAR_cosmos_key="${{ secrets.COSMOS_KEY }}"
TF_VAR_jwt_secret="${{ secrets.JWT_SECRET }}"
```

### 5. Import Strategy

**Decisão**: Usar `terraform import` para recursos existentes antes de apply.

```bash
# Exemplo de import
terraform import azurerm_resource_group.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod
terraform import module.acr.azurerm_container_registry.main /subscriptions/{sub}/resourceGroups/rg-teachei-prod/providers/Microsoft.ContainerRegistry/registries/acrteachei
```

## Module Specifications

### ACR Module

```hcl
# modules/acr/main.tf
resource "azurerm_container_registry" "main" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = true
}
```

### PostgreSQL Module

```hcl
# modules/postgresql/main.tf
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = var.name
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "16"
  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  sku_name               = "B_Standard_B1ms"
  storage_mb             = 32768
  zone                   = "1"
  
  public_network_access_enabled = true
}
```

### Cosmos DB Module

```hcl
# modules/cosmosdb/main.tf
resource "azurerm_cosmosdb_account" "main" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"
  
  capabilities {
    name = "EnableServerless"
  }
  
  consistency_policy {
    consistency_level = "Session"
  }
  
  geo_location {
    location          = var.location
    failover_priority = 0
  }
}
```

### Storage Module

```hcl
# modules/storage/main.tf
resource "azurerm_storage_account" "main" {
  name                     = var.name
  resource_group_name      = var.resource_group_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  blob_properties {
    cors_rule {
      allowed_origins    = var.cors_origins
      allowed_methods    = ["GET", "POST", "PUT", "DELETE"]
      allowed_headers    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
}

resource "azurerm_storage_container" "profile_photos" {
  name                  = "profile-photos"
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = "blob"
}

resource "azurerm_storage_container" "vehicle_photos" {
  name                  = "vehicle-photos"
  storage_account_id    = azurerm_storage_account.main.id
  container_access_type = "blob"
}
```

### Container Apps Module

```hcl
# modules/container-apps/main.tf
resource "azurerm_log_analytics_workspace" "main" {
  name                = var.log_analytics_name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "main" {
  name                       = var.environment_name
  resource_group_name        = var.resource_group_name
  location                   = var.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
}

resource "azurerm_container_app" "api" {
  name                         = var.app_name
  resource_group_name          = var.resource_group_name
  container_app_environment_id = azurerm_container_app_environment.main.id
  revision_mode                = "Single"
  
  template {
    container {
      name   = "teachei-api"
      image  = "${var.acr_login_server}/teachei-api:latest"
      cpu    = 0.5
      memory = "1Gi"
      
      env {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "prod"
      }
      # ... demais env vars
    }
    
    min_replicas = 0
    max_replicas = 3
  }
  
  ingress {
    external_enabled = true
    target_port      = 8080
    transport        = "auto"
    
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
  
  registry {
    server               = var.acr_login_server
    username             = var.acr_username
    password_secret_name = "acr-password"
  }
  
  secret {
    name  = "acr-password"
    value = var.acr_password
  }
}
```

## CI/CD Workflow

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  push:
    branches: [main]
    paths: ['infrastructure/**']
  pull_request:
    paths: ['infrastructure/**']

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      
      - name: Terraform Init
        working-directory: infrastructure
        run: terraform init
        env:
          ARM_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
          ARM_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
          ARM_SUBSCRIPTION_ID: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          ARM_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
      
      - name: Terraform Plan
        working-directory: infrastructure
        run: terraform plan -var-file=environments/prod.tfvars
        env:
          TF_VAR_postgres_password: ${{ secrets.POSTGRES_PASSWORD }}
          TF_VAR_jwt_secret: ${{ secrets.JWT_SECRET }}
          # ... outros secrets

  apply:
    needs: plan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      
      - name: Terraform Apply
        working-directory: infrastructure
        run: |
          terraform init
          terraform apply -auto-approve -var-file=environments/prod.tfvars
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Drift entre Terraform e realidade | Usar `terraform import` antes de apply |
| Secrets expostos em state | State encriptado no Azure Storage |
| Destruição acidental | Usar `prevent_destroy` em recursos críticos |
| Lock de state | Azure Storage locking nativo |

## Migration Plan

1. **Fase 1**: Criar Resource Group para Terraform state
2. **Fase 2**: Criar estrutura de arquivos Terraform
3. **Fase 3**: Import de todos os recursos existentes
4. **Fase 4**: Validar com `terraform plan` (sem mudanças)
5. **Fase 5**: Configurar CI/CD workflow
6. **Fase 6**: Documentar processo de changes

## Open Questions

- ~~Backend storage para state?~~ → Azure Storage com novo RG
- ~~Importar recursos existentes?~~ → Sim, via terraform import
