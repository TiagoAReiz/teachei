## 1. Toast Positioning

- [x] 1.1 Ajustar posição do toast container para `bottom-24` no mobile (acima do menu h-20)
- [x] 1.2 Centralizar toasts no mobile
- [x] 1.3 Testar em telas pequenas

## 2. Mobile Navigation Size

- [x] 2.1 Aumentar altura do mobile-nav de `h-16` para `h-20`
- [x] 2.2 Aumentar tamanho dos ícones (24 → 26)
- [x] 2.3 Aumentar tamanho do texto (text-xs → text-[11px])
- [x] 2.4 Ajustar padding-bottom das páginas para compensar menu maior

## 3. Hide Hamburger Menu on Mobile

- [x] 3.1 Esconder botão hamburger no mobile (removido, já tem menu inferior)
- [x] 3.2 Verificar que não quebra layout desktop

## 4. Intention Chips Responsive

- [x] 4.1 Mudar specs grid para `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [x] 4.2 Testar que chips não quebram no mobile

## 5. Profile Photo Display

- [x] 5.1 Adicionar `fotoBase64={user.fotoBase64}` ao Avatar no perfil
- [x] 5.2 Verificar que foto aparece corretamente

## 6. Seller Info in Intention Contact

- [x] 6.1 Backend: Adicionar `fotoBase64` ao `PerfilPublicoResponse`
- [x] 6.2 Frontend: Buscar perfil por `usuarioId` na página de intenção
- [x] 6.3 Frontend: Adicionar foto do vendedor na seção de contato
- [x] 6.4 Frontend: Adicionar nome do vendedor
- [x] 6.5 Frontend: Criar link para perfil público `/profile/{id}`

## 7. Public Profile Page

- [x] 7.1 Criar página `app/profile/[id]/page.tsx`
- [x] 7.2 Buscar dados do usuário por ID
- [x] 7.3 Listar intenções do usuário (placeholder por agora)
- [x] 7.4 Mostrar dados públicos (nome, cidade, foto)

## 8. Subscription Bypass Documentation

- [x] 8.1 Adicionar TODO no código do perfil público: "Para cobrar, verificar assinatura"
- [x] 8.2 Adicionar TODO na seção de vendedor: "Para cobrar, ocultar se !assinaturaAtiva"
- [x] 8.3 Documentar no código que isso é consistente com bypass em `AnuncioController.java`
