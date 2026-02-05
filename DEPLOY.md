# TeAchei - Guia de Deploy e CI/CD

Este documento descreve como configurar a infraestrutura no Azure e a pipeline CI/CD com GitHub Actions.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                          GitHub Repository                          │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   TeAchei/   │  │ teachei-web/ │  │teachei-mobile│              │
│  │   (Backend)  │  │  (Next.js)   │  │   (Expo)     │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
   GitHub Actions    GitHub Actions    GitHub Actions
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────┐
│ Azure Container │  │   Vercel    │  │  EAS Build  │
│     Apps        │  │             │  │  (Expo)     │
└────────┬────────┘  └─────────────┘  └─────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│                   Azure Services                     │
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │ Azure Database   │  │ Azure Cosmos DB  │         │
│  │ for PostgreSQL   │  │ (NoSQL)          │         │
│  └──────────────────┘  └──────────────────┘         │
└─────────────────────────────────────────────────────┘
```

## Pré-requisitos

- Conta Azure com créditos/assinatura ativa
- Conta GitHub
- Azure CLI instalado (`winget install Microsoft.AzureCLI`)
- Git instalado

---

## Parte 1: Configuração Azure (Portal ou CLI)

### 1.1 Login no Azure

```bash
az login
az account set --subscription "SUA_SUBSCRIPTION"
```

### 1.2 Criar Resource Group

```bash
az group create \
  --name rg-teachei-prod \
  --location brazilsouth
```

### 1.3 Criar Azure Container Registry (ACR)

```bash
az acr create \
  --resource-group rg-teachei-prod \
  --name acrteachei \
  --sku Basic \
  --admin-enabled true

# Obter credenciais
az acr credential show --name acrteachei
```

### 1.4 Criar PostgreSQL Flexible Server

```bash
az postgres flexible-server create \
  --resource-group rg-teachei-prod \
  --name psql-teachei-prod \
  --location brazilsouth \
  --admin-user teachei_admin \
  --admin-password 'SUA_SENHA_FORTE_AQUI' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 16 \
  --public-access 0.0.0.0

# Criar database
az postgres flexible-server db create \
  --resource-group rg-teachei-prod \
  --server-name psql-teachei-prod \
  --database-name teachei
```

### 1.5 Criar Cosmos DB (Serverless)

```bash
az cosmosdb create \
  --name cosmos-teachei-prod \
  --resource-group rg-teachei-prod \
  --kind GlobalDocumentDB \
  --capabilities EnableServerless \
  --locations regionName=brazilsouth

# Obter connection string
az cosmosdb keys list \
  --name cosmos-teachei-prod \
  --resource-group rg-teachei-prod
```

### 1.6 Criar Container Apps Environment

```bash
# Criar ambiente
az containerapp env create \
  --name env-teachei-prod \
  --resource-group rg-teachei-prod \
  --location brazilsouth

# Criar container app (inicial, será atualizado pelo CI/CD)
az containerapp create \
  --name teachei-api \
  --resource-group rg-teachei-prod \
  --environment env-teachei-prod \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8080 \
  --ingress external \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 0 \
  --max-replicas 3
```

### 1.7 Criar Service Principal para GitHub Actions

```bash
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

az ad sp create-for-rbac \
  --name "sp-teachei-github-actions" \
  --role contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/rg-teachei-prod \
  --sdk-auth

# COPIE O JSON DE SAÍDA COMPLETO!
```

---

## Parte 2: Configuração GitHub

### 2.1 Secrets Necessários

Vá em: **Repository → Settings → Secrets and variables → Actions**

| Secret | Descrição |
|--------|-----------|
| `AZURE_CREDENTIALS` | JSON completo do Service Principal |
| `ACR_LOGIN_SERVER` | `acrteachei.azurecr.io` |
| `ACR_USERNAME` | Username do ACR (da credencial) |
| `ACR_PASSWORD` | Password do ACR |
| `POSTGRES_HOST` | `psql-teachei-prod.postgres.database.azure.com` |
| `POSTGRES_USER` | `teachei_admin` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL |
| `COSMOS_ENDPOINT` | URI do Cosmos DB |
| `COSMOS_KEY` | Primary Key do Cosmos |
| `JWT_SECRET` | String segura 64+ chars |
| `MERCADOPAGO_ACCESS_TOKEN` | Token do Mercado Pago |
| `MERCADOPAGO_PUBLIC_KEY` | Public Key do MP |
| `MERCADOPAGO_WEBHOOK_SECRET` | Secret do webhook |

### 2.2 Secrets para Vercel (Frontend Web)

| Secret | Descrição |
|--------|-----------|
| `VERCEL_TOKEN` | Token API do Vercel |
| `VERCEL_ORG_ID` | ID da organização Vercel |
| `VERCEL_PROJECT_ID` | ID do projeto no Vercel |

Para obter esses valores:
1. Instale Vercel CLI: `npm i -g vercel`
2. Execute: `vercel link` no diretório teachei-web
3. Veja o arquivo `.vercel/project.json` criado

### 2.3 Secrets para Expo (Mobile)

| Secret | Descrição |
|--------|-----------|
| `EXPO_TOKEN` | Token de acesso do Expo |

Para obter: https://expo.dev/settings/access-tokens

---

## Parte 3: Workflows CI/CD

Os workflows já estão configurados em `.github/workflows/`:

### Backend (`backend-ci-cd.yml`)
- **Trigger**: Push para `main` em `TeAchei/**`
- **Jobs**:
  1. Build & Test (Maven)
  2. Build Docker image & Push para ACR
  3. Deploy para Azure Container Apps

### Frontend Web (`web-ci-cd.yml`)
- **Trigger**: Push para `main` em `teachei-web/**`
- **Jobs**:
  1. Build & Lint (Next.js)
  2. Deploy para Vercel

### Mobile (`mobile-ci.yml`)
- **Trigger**: Push para `main` em `teachei-mobile/**`
- **Jobs**:
  1. Build & Type Check
  2. EAS Build (quando commit contém `[release]`)

---

## Parte 4: Deploy Manual (se necessário)

### Backend

```bash
# Build local
cd TeAchei
./mvnw clean package -DskipTests

# Build Docker
docker build -t acrteachei.azurecr.io/teachei-api:latest .

# Login ACR
az acr login --name acrteachei

# Push
docker push acrteachei.azurecr.io/teachei-api:latest

# Update Container App
az containerapp update \
  --name teachei-api \
  --resource-group rg-teachei-prod \
  --image acrteachei.azurecr.io/teachei-api:latest
```

### Frontend Web

```bash
cd teachei-web
vercel --prod
```

---

## Parte 5: Monitoramento

### Ver logs do Container App

```bash
az containerapp logs show \
  --name teachei-api \
  --resource-group rg-teachei-prod \
  --follow
```

### Ver métricas

```bash
az monitor metrics list \
  --resource "/subscriptions/SUB_ID/resourceGroups/rg-teachei-prod/providers/Microsoft.App/containerApps/teachei-api" \
  --metric "Requests" \
  --interval PT1H
```

---

## Custos Estimados (Brasil South)

| Serviço | SKU | Custo Mensal Estimado |
|---------|-----|----------------------|
| Container Apps | Consumption | ~$0-20 (pay per use) |
| PostgreSQL | B1ms (1 vCore) | ~$12 |
| Cosmos DB | Serverless | ~$0-10 (pay per use) |
| Container Registry | Basic | ~$5 |
| **Total** | | **~$20-50/mês** |

---

## Checklist de Deploy

- [ ] Resource Group criado
- [ ] ACR criado e admin habilitado
- [ ] PostgreSQL criado com database `teachei`
- [ ] Cosmos DB criado
- [ ] Container Apps Environment criado
- [ ] Container App `teachei-api` criado
- [ ] Service Principal criado
- [ ] Secrets configurados no GitHub
- [ ] Primeiro deploy executado via push para main
- [ ] Webhook do Mercado Pago configurado com URL do Container App
- [ ] DNS customizado configurado (opcional)

---

## Troubleshooting

### Container App não inicia

```bash
# Ver logs de startup
az containerapp logs show \
  --name teachei-api \
  --resource-group rg-teachei-prod \
  --type system

# Ver revisões
az containerapp revision list \
  --name teachei-api \
  --resource-group rg-teachei-prod
```

### PostgreSQL connection refused

```bash
# Verificar firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group rg-teachei-prod \
  --name psql-teachei-prod

# Adicionar IP
az postgres flexible-server firewall-rule create \
  --resource-group rg-teachei-prod \
  --name psql-teachei-prod \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Cosmos DB timeout

Verifique se a região do Cosmos DB é a mesma do Container Apps para menor latência.

---

## Parte 6: Infrastructure as Code (Terraform)

A infraestrutura também está disponível como código Terraform no diretório `infrastructure/`.

### Vantagens

- Infraestrutura versionada e reproduzível
- Facilidade para criar ambiente staging
- Auditoria de mudanças via Git
- Automação via CI/CD

### Uso Rápido

O state do Terraform está no container `tfstate` do Storage Account `stteacheiprod`.

```bash
cd infrastructure

# Inicializar Terraform
terraform init

# Visualizar mudanças
terraform plan -var-file=environments/prod.tfvars

# Aplicar mudanças
terraform apply -var-file=environments/prod.tfvars
```

### Importar Recursos Existentes

Se os recursos já existem no Azure (criados via CLI/Portal), importe-os antes de usar Terraform:

```powershell
# PowerShell
.\import-existing.ps1 -SubscriptionId "sua-subscription-id"
```

### Documentação Completa

Veja `infrastructure/README.md` para instruções detalhadas.
