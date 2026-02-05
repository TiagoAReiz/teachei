# Change: Fix Remove Profile Photo Button

## Why

O botão "Remover foto" na página de configurações não funciona corretamente. Quando o usuário clica para remover a foto, a foto reaparece imediatamente devido a uma condição de corrida (race condition) no estado local do React.

**Problema identificado**: O `useEffect` que sincroniza `photoPreview` com `user.fotoBase64` dispara antes que o cache do React Query seja atualizado, re-populando `photoPreview` com o valor antigo logo após ser limpo.

## What Changes

- **Frontend - Settings Page**: 
  - Adicionar flag `isPhotoRemoved` para evitar que o `useEffect` restaure a foto após remoção
  - Garantir que o Avatar não exiba `fotoUrl` quando a foto foi removida localmente
  - Limpar a flag quando o cache do usuário for atualizado com sucesso

## Impact

- Affected specs: web-profile
- Affected code:
  - `teachei-web/app/(main)/settings/page.tsx` - Corrigir lógica de remoção de foto
