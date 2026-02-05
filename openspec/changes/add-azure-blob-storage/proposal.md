# Change: Adicionar Azure Blob Storage para Fotos

## Why

Atualmente as fotos de perfil são salvas como Base64 diretamente no PostgreSQL (campo `foto_base64`), o que:
- Sobrecarrega o banco de dados
- Limita o tamanho das fotos (~500KB)
- Dificulta escalabilidade futura

Além disso, não existe funcionalidade para adicionar fotos de referência nas intenções de compra, recurso desejado para que compradores possam mostrar visualmente o tipo de veículo que procuram.

## What Changes

1. **Backend - Blob Storage Service**: Criar service para upload/download de imagens no Azure Blob Storage
2. **Backend - Fotos de Perfil**: Migrar de Base64 no PostgreSQL para URL do Blob Storage
3. **Backend - Fotos de Intenção**: Adicionar campo opcional `fotoReferenciaUrl` nas intenções
4. **Frontend Web/Mobile**: Ajustar upload de fotos para usar novo fluxo
5. **Docker Compose**: Documentar uso do Azurite (já existe) para desenvolvimento local

## Impact

- Affected code:
  - `PerfilController.java`, `GerenciarPerfilUseCaseImpl.java`
  - `Anuncio.java`, `AnuncioDocument.java`, `CriarAnuncioUseCaseImpl.java`
  - `teachei-web/app/(main)/settings/page.tsx`
  - `teachei-web/stores/create-intention-store.ts`
  - `teachei-mobile` (upload de foto)

- **BREAKING**: Campo `fotoBase64` será deprecado em favor de `fotoUrl`
- Migration: Manter `fotoBase64` como fallback durante transição

## Out of Scope

- Terraform para provisionamento (será feito posteriormente)
- CDN para otimização de entrega
- Múltiplas fotos por intenção (apenas 1 foto de referência por agora)
