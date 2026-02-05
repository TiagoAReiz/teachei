# Change: Adicionar upload de foto de referência no mobile

## Why
O fluxo de criação de intenção no app web permite que o usuário adicione uma foto de referência do veículo desejado, mas essa funcionalidade está **ausente no app mobile**. Isso cria uma experiência inconsistente entre plataformas e limita os usuários mobile de fornecer informações visuais sobre o veículo que procuram.

## What Changes
- Adicionar input de foto no fluxo de criação de intenção mobile (`specs.tsx`)
- Adicionar estado `fotoReferenciaBase64` no store do mobile (`create-intention-store.ts`)
- Atualizar tipos para incluir `fotoReferenciaBase64` no `CreateAnuncioRequest`
- Enviar foto na requisição de criação de intenção (`review.tsx`)
- Adicionar preview da foto na tela de review
- Melhorar feedback de erro quando o upload falhar (opcional - melhoria de UX)

## Impact
- **Affected specs**: intention-creation
- **Affected code**:
  - `teachei-mobile/stores/create-intention-store.ts` - adicionar campo de foto
  - `teachei-mobile/app/create/specs.tsx` - adicionar input de foto
  - `teachei-mobile/app/create/review.tsx` - exibir preview e enviar foto
  - `teachei-mobile/types/index.ts` - atualizar `CreateAnuncioRequest`
  - `teachei-mobile/hooks/use-intentions.ts` - garantir envio do campo

## Investigation Summary

### Current State Analysis

**Web Frontend (works correctly):**
- `teachei-web/app/create/specs/page.tsx:111-135` - Photo upload with validation (2MB, image type)
- `teachei-web/stores/create-intention-store.ts:35` - State `fotoReferenciaBase64`
- `teachei-web/app/create/review/page.tsx:150` - Sends photo to backend

**Mobile Frontend (missing implementation):**
- `teachei-mobile/stores/create-intention-store.ts` - No photo field
- `teachei-mobile/app/create/specs.tsx` - No photo input
- `teachei-mobile/app/create/review.tsx` - Doesn't send photo
- `teachei-mobile/types/index.ts:179-190` - `CreateAnuncioRequest` missing `fotoReferenciaBase64`

**Backend (works correctly):**
- `TeAchei/.../CriarAnuncioUseCaseImpl.java:139-151` - Receives and uploads photo
- `TeAchei/.../BlobStorageAdapter.java:76-91` - Uploads to Azure Blob Storage
- Photo deletion implemented in `ExcluirAnuncioUseCaseImpl.java`

### Root Cause
O campo `fotoReferenciaBase64` nunca foi implementado no app mobile durante o desenvolvimento inicial. A funcionalidade existe apenas no web.
