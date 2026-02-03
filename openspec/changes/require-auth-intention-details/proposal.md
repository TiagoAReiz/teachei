# Change: Require Auth for Intention Details

## Why
Atualmente a página `/intention/[id]` é pública - qualquer pessoa pode ver os detalhes completos de uma intenção de compra sem estar logado. Queremos exigir login para acessar esta página.

## What Changes

### Frontend
- Atualizar `app/intention/[id]/client.tsx` para verificar autenticação
- Se usuário não estiver logado, redirecionar para `/login`
- Manter loading state enquanto verifica auth
- Preservar URL original para redirect após login (via query param `redirect`)

### Backend
- Nenhuma mudança necessária - endpoint já funciona com e sem auth

## Impact
- Affected specs: `auth-gate`
- Affected code:
  - `teachei-web/app/intention/[id]/client.tsx`

## Considerações
- SEO: O server-side fetch em `page.tsx` continuará funcionando para gerar metadata (crawlers não precisam de auth)
- UX: Usuário será redirecionado para login e depois volta para a intenção que queria ver
