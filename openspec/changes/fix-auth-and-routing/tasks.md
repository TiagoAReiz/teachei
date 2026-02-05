# Tasks: Melhorar Logout e Separar Rotas Feed/Landing

## 1. Tratamento de Erros 403 - Web

- [x] 1.1 Em `teachei-web/lib/api.ts`, adicionar tratamento de 403 igual ao 401
- [x] 1.2 Verificar se `removeToken()` é chamado antes do redirect
- [ ] 1.3 Testar que 403 redireciona para `/login`

## 2. Tratamento de Erros 403 - Mobile

- [x] 2.1 Em `teachei-mobile/services/api.ts`, adicionar tratamento de 403 igual ao 401
- [x] 2.2 Verificar que `removeToken()` é chamado antes do redirect
- [ ] 2.3 Testar que 403 redireciona para login

## 3. Simplificar Rota Raiz

- [x] 3.1 Modificar `teachei-web/app/page.tsx` para sempre renderizar `<LandingPage />`
- [x] 3.2 Remover lógica de verificação de autenticação do page.tsx raiz
- [x] 3.3 Remover import dinâmico do HomePage
- [ ] 3.4 Verificar que landing page funciona para todos (logados e não logados)

## 4. Atualizar Navegação Pós-Login

- [x] 4.1 Em `teachei-web/hooks/use-auth.ts`, atualizar redirect após login de `/` para `/feed`
- [x] 4.2 Em `teachei-web/app/(auth)/role-select/page.tsx`, atualizar redirect para `/feed`
- [ ] 4.3 Testar fluxo completo: login → redirect para /feed

## 5. Atualizar Links Internos

- [x] 5.1 Em `teachei-web/components/layout/header.tsx`, atualizar link do logo (vai para `/feed` se logado, `/` se não logado)
- [x] 5.2 Em `teachei-web/components/landing/landing-page.tsx`, verificar CTA "Começar" aponta para register/login
- [x] 5.3 Atualizar links "Voltar ao feed" em páginas de erro (not-found.tsx, intention/[id]/not-found.tsx, user/[id]/not-found.tsx)
- [x] 5.4 Atualizar navegação em:
  - `header.tsx`: navItems Feed link agora aponta para `/feed`
  - `footer.tsx`: link "Feed de Intenções" agora aponta para `/feed`
  - `favorites/page.tsx`: link "Explorar intenções" agora aponta para `/feed`
  - `create/layout.tsx`: back/cancel buttons e logo agora apontam para `/feed`
  - `intention-filters.tsx`: todas as navegações de filtro agora usam `/feed`
  - `assinatura/sucesso/page.tsx`: redirecionamentos agora vão para `/feed`
  - `assinatura/page.tsx`: link "Explorar intenções" agora aponta para `/feed`
  - `profile/[id]/page.tsx`: link "Voltar ao Feed" agora aponta para `/feed`

## 6. Verificar Feed Page

- [x] 6.1 Confirmar que `app/feed/page.tsx` está funcional e completo
- [x] 6.2 Verificar que filtros funcionam na página /feed (IntentionFilters atualizado)
- [x] 6.3 Feed é público (acessível sem autenticação) - comportamento intencional

## 7. Cleanup

- [x] 7.1 Remover código morto do page.tsx raiz (simplificado para apenas LandingPage)
- [x] 7.2 Verificar se há outras referências que precisam atualização (todas atualizadas)
- [ ] 7.3 Testar navegação completa: landing → login → feed → logout → landing
