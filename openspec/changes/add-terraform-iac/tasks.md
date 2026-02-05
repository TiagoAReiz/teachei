# Tasks: Terraform IaC Implementation

## 1. Setup Terraform State Backend

- [x] 1.1 Usar Resource Group existente `rg-teachei-prod`
- [x] 1.2 Usar Storage Account existente `stteacheiprod`
- [x] 1.3 Criar container `tfstate` no storage (criado via Portal)

## 2. Create Base Terraform Structure

- [x] 2.1 Criar `infrastructure/versions.tf` com requisitos de versão
- [x] 2.2 Criar `infrastructure/providers.tf` com provider azurerm
- [x] 2.3 Criar `infrastructure/backend.tf` com configuração remote state
- [x] 2.4 Criar `infrastructure/variables.tf` com todas as variáveis
- [x] 2.5 Criar `infrastructure/outputs.tf` com outputs principais
- [x] 2.6 Criar `infrastructure/main.tf` com resource group

## 3. Create Terraform Modules

- [x] 3.1 Criar módulo `modules/acr/` (Container Registry)
- [x] 3.2 Criar módulo `modules/postgresql/` (PostgreSQL Flexible Server)
- [x] 3.3 Criar módulo `modules/cosmosdb/` (Cosmos DB Account + Database)
- [x] 3.4 Criar módulo `modules/storage/` (Storage Account + Blob Containers)
- [x] 3.5 Criar módulo `modules/container-apps/` (Environment + Container App)
- [x] 3.6 Criar módulo `modules/monitoring/` (Log Analytics Workspace)

## 4. Environment Configuration

- [x] 4.1 Criar `infrastructure/environments/prod.tfvars`
- [x] 4.2 Criar `infrastructure/environments/staging.tfvars` (template)
- [x] 4.3 Criar `.gitignore` entries para arquivos sensíveis

## 5. Import Existing Resources

- [x] 5.1 Documentar comandos de import (script `import-existing.ps1`)
- [ ] 5.2 Executar terraform import para Resource Group
- [ ] 5.3 Executar terraform import para ACR
- [ ] 5.4 Executar terraform import para PostgreSQL
- [ ] 5.5 Executar terraform import para Cosmos DB
- [ ] 5.6 Executar terraform import para Storage Account
- [ ] 5.7 Executar terraform import para Container Apps Environment
- [ ] 5.8 Executar terraform import para Container App
- [ ] 5.9 Executar terraform import para Log Analytics Workspace

## 6. CI/CD Integration

- [x] 6.1 Criar `.github/workflows/terraform.yml`
- [ ] 6.2 Adicionar secrets necessários no GitHub (ARM_* credentials)
- [ ] 6.3 Testar workflow com PR de teste

## 7. Documentation

- [x] 7.1 Atualizar DEPLOY.md com seção de Terraform
- [x] 7.2 Criar infrastructure/README.md com instruções
