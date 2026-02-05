# Change: Adicionar Infrastructure as Code com Terraform

## Why

A infraestrutura do TeAchei no Azure foi criada manualmente via CLI/Portal, o que:
- Dificulta replicação de ambientes (staging, disaster recovery)
- Não há versionamento das configurações
- Mudanças são difíceis de rastrear e auditar
- Risco de configurações inconsistentes entre ambientes

Com Terraform, teremos infraestrutura declarativa, versionada e reproduzível.

## What Changes

1. **Terraform Module Principal**: Criar estrutura modular para todos os recursos Azure
2. **Módulos por Serviço**: Container Registry, PostgreSQL, Cosmos DB, Container Apps, Storage Account
3. **Environments**: Configurações separadas para prod (e futuro staging)
4. **CI/CD Integration**: GitHub Actions workflow para plan/apply
5. **State Management**: Azure Storage backend para remote state
6. **Secrets Management**: Integração com GitHub Secrets e Azure Key Vault (futuro)

## Resources Covered

| Recurso Atual | Tipo Azure | Módulo Terraform |
|---------------|-----------|------------------|
| acrteachei | Azure Container Registry | `modules/acr` |
| cosmos-teachei-prod | Cosmos DB (NoSQL, Serverless) | `modules/cosmosdb` |
| managedEnvironment-rgteacheiprod-afe2 | Container Apps Environment | `modules/container-apps` |
| psql-teachei-prod | PostgreSQL Flexible Server | `modules/postgresql` |
| stteacheiprod | Storage Account + Blob | `modules/storage` |
| teachei-api | Container App | `modules/container-apps` |
| workspacergteacheiprod8fe9 | Log Analytics Workspace | `modules/monitoring` |
| rg-teachei-prod | Resource Group | `main.tf` |

## Impact

- Affected code: Nenhum código de aplicação alterado
- New files: `infrastructure/` folder com todos os arquivos Terraform
- CI/CD: Novo workflow `.github/workflows/terraform.yml`

## Out of Scope

- Migração de state existente (recursos serão importados)
- Azure Key Vault (será adicionado em change futuro)
- Multi-region/disaster recovery
- Staging environment (template preparado, mas não provisionado)
