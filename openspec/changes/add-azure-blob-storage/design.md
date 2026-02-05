# Design: Azure Blob Storage Integration

## Context

O TeAchei precisa armazenar imagens de forma escalável e eficiente. Atualmente:
- Fotos de perfil: Base64 no PostgreSQL (campo `foto_base64`)
- Fotos de veículos: Não existem

O Azure Blob Storage foi escolhido por já fazer parte da stack Azure do projeto.

## Goals

- Armazenar fotos de perfil no Blob Storage
- Permitir foto de referência opcional nas intenções de compra
- Manter compatibilidade com fotos existentes (Base64)
- Suportar desenvolvimento local com Azurite

## Non-Goals

- Múltiplas fotos por intenção
- CDN para otimização
- Terraform/IaC (será feito separadamente)
- Migração automática de fotos existentes

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│  Azure Blob     │
│  (Web/Mobile)   │     │  (Spring Boot)  │     │  Storage        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                               ┌────────────────────────┘
                               ▼
                        Containers:
                        ├── profile-photos/
                        │   └── users/{userId}/avatar.jpg
                        └── vehicle-photos/
                            └── intentions/{id}/reference.jpg
```

## Decisions

### 1. Upload Flow: Backend-mediated

**Decisão**: Frontend envia Base64 para o backend, que faz upload para o Blob Storage.

**Alternativas consideradas**:
- SAS Token direto (frontend → blob): Mais complexo, requer gerenciar tokens
- Presigned URLs: Overhead desnecessário para MVP

**Rationale**: Simplicidade. O backend já recebe a imagem, basta redirecionar para o Blob ao invés de salvar no DB.

### 2. Formato de Imagem

**Decisão**: Aceitar qualquer formato, converter para JPEG no backend.

**Limite**: Máximo 2MB por imagem (comprimida para ~500KB no backend).

### 3. Estrutura de URLs

```
# Produção
https://stteacheiprod.blob.core.windows.net/profile-photos/users/{userId}/avatar.jpg
https://stteacheiprod.blob.core.windows.net/vehicle-photos/intentions/{intentionId}/reference.jpg

# Local (Azurite)
http://127.0.0.1:10000/devstoreaccount1/profile-photos/users/{userId}/avatar.jpg
```

### 4. Backward Compatibility

**Decisão**: Manter campo `fotoBase64` como fallback.

Lógica de exibição:
1. Se `fotoUrl` existe → usar URL do blob
2. Senão, se `fotoBase64` existe → usar Base64
3. Senão → avatar padrão (iniciais)

### 5. Configuração por Ambiente

```yaml
# application.yml
azure:
  storage:
    connection-string: ${AZURE_STORAGE_CONNECTION_STRING}
    blob-endpoint: ${AZURE_STORAGE_BLOB_ENDPOINT}
    containers:
      profile-photos: profile-photos
      vehicle-photos: vehicle-photos
```

## Data Model Changes

### Perfil (PostgreSQL)

```sql
-- Adicionar coluna para URL (manter foto_base64 para fallback)
ALTER TABLE perfis ADD COLUMN IF NOT EXISTS foto_url VARCHAR(500);
```

### Anuncio (Cosmos DB)

```json
{
  "id": "...",
  "detalhes": {
    "fotoReferenciaUrl": "https://...blob.../intentions/{id}/reference.jpg"
  }
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Azurite não disponível localmente | Fallback para Base64 em dev |
| URLs públicas expõem fotos | OK para fotos de perfil/veículos (não sensíveis) |
| Custo de storage | Mínimo (~R$2/mês para MVP) |

## Migration Plan

1. **Fase 1**: Implementar BlobStorageService + endpoint de upload
2. **Fase 2**: Novos uploads vão para Blob, antigos mantêm Base64
3. **Fase 3 (futuro)**: Script opcional para migrar fotos existentes

## Open Questions

- ~~Limite de tamanho de imagem?~~ → 2MB upload, 500KB após compressão
- ~~Permitir múltiplas fotos?~~ → Não no MVP, apenas 1 foto de referência
