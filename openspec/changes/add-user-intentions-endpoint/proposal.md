# Change: Add User Intentions Endpoint

## Why
A página de perfil público (`/profile/[id]`) mostra "Em breve você poderá ver as intenções de compra deste usuário." Precisamos implementar a listagem de intenções de um usuário específico.

O backend já tem `buscarPorUsuario(UUID usuarioId)` no use case, mas só expõe via `/meus` que requer autenticação do próprio usuário.

## What Changes

### Backend
- Criar endpoint GET `/v1/anuncios/usuario/{usuarioId}` para listar intenções de um usuário
- Retornar apenas intenções com status ATIVO
- Endpoint público (não requer autenticação)
- Aplicar mesma lógica de `contatoOculto` (bypass por agora, TODO para monetização)

### Frontend
- Adicionar função `getIntentionsByUserId(userId)` em `lib/intentions.ts`
- Atualizar página `/profile/[id]` para buscar e exibir intenções do usuário
- Usar `IntentionGrid` para exibir os cards

## Impact
- Affected specs: `user-intentions`
- Affected code:
  - `AnuncioController.java`
  - `teachei-web/lib/intentions.ts`
  - `teachei-web/config/env.ts`
  - `teachei-web/app/profile/[id]/page.tsx`
