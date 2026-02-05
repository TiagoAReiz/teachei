# Change: Melhorar Logout e Separar Rotas Feed/Landing

## Why

Existem dois problemas de UX que precisam ser corrigidos:

1. **Logout incompleto em erros de autenticação**: Atualmente, apenas erro 401 dispara logout automático e redirecionamento para login. O erro 403 (Forbidden) não é tratado da mesma forma, deixando o usuário em estado inconsistente.

2. **Conflito de rotas entre Feed e Landing Page**: A rota raiz (`/`) atualmente mostra o feed para usuários autenticados e a landing page para visitantes. Isso causa:
   - Confusão na navegação (usuário autenticado não consegue acessar a landing page)
   - URLs não compartilháveis (mesma URL, conteúdos diferentes)
   - Complexidade desnecessária no código da página raiz

## What Changes

### 1. Tratamento de Erros 401/403
- **Web** (`lib/api.ts`): Adicionar tratamento de 403 igual ao 401 - remover token e redirecionar para `/login`
- **Mobile** (`services/api.ts`): Adicionar tratamento de 403 igual ao 401 - remover token e redirecionar para login

### 2. Separação de Rotas
- **Rota `/`** (raiz): Sempre mostrar LandingPage (para todos os usuários)
- **Rota `/feed`**: Feed de intenções (para usuários autenticados)
- Atualizar navegação para redirecionar usuários logados para `/feed` após login
- Atualizar links internos que apontam para `/` quando deveriam ir para `/feed`

## Impact

- **Affected specs**: web-auth, web-routing
- **Affected code**:
  - `teachei-web/lib/api.ts` - Adicionar tratamento 403
  - `teachei-mobile/services/api.ts` - Adicionar tratamento 403
  - `teachei-web/app/page.tsx` - Simplificar para sempre mostrar LandingPage
  - `teachei-web/app/feed/page.tsx` - Já existe, manter como está
  - `teachei-web/lib/auth.ts` - Atualizar redirect após login para `/feed`
  - `teachei-web/components/layout/header.tsx` - Atualizar links do logo
  - `teachei-web/components/landing/landing-page.tsx` - Verificar CTAs
- **Migration**: Nenhuma - mudanças apenas de comportamento de navegação
