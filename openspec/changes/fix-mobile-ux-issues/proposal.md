# Change: Fix Mobile UX Issues

## Why
Vários problemas de UX no mobile afetam a experiência do usuário:
- Toasts mal posicionados, ficam atrás do menu inferior
- Menu mobile pequeno demais
- Ícone hamburger (3 riscos) aparece desnecessariamente já que há menu inferior
- Chips de informação quebram no mobile
- Foto do usuário não aparece no próprio perfil
- Falta foto e link para perfil do vendedor na página de intenção

## What Changes

### 1. Toast Positioning
- Mover toasts para cima do menu mobile (bottom-20 no mobile)
- Ajustar para centralizado no mobile

### 2. Mobile Navigation
- Aumentar altura do menu inferior (h-16 → h-20)
- Aumentar ícones e texto

### 3. Hamburger Menu
- Esconder botão hamburger no mobile (já tem menu inferior)
- Manter apenas no desktop se necessário

### 4. Intention Chips
- Specs grid: `grid-cols-1` no mobile, `grid-cols-2 lg:grid-cols-3` no desktop
- Cada chip ocupa 100% da largura no mobile

### 5. Profile Photo
- Adicionar `fotoBase64` ao Avatar no perfil
- Garantir que a foto apareça corretamente

### 6. Seller Profile Link
- Adicionar foto do vendedor na seção de contato
- Adicionar nome do vendedor (requer dados do backend)
- Link para perfil público ao clicar na foto/nome
- Criar página de perfil público `/profile/[id]`

### 7. Subscription Bypass (Gratuito por Agora)
- **TODO para monetização futura**: Perfil público também será protegido por assinatura
- Deixar comentários claros no código para fácil reversão
- Quando cobrar: esconder foto/nome do vendedor para não-assinantes
- Consistente com bypass de contato já implementado em `AnuncioController.java`

## Impact
- Affected specs: `mobile-ux`
- Affected code:
  - `components/ui/toast.tsx`
  - `components/layout/mobile-nav.tsx`
  - `components/layout/header.tsx`
  - `app/intention/[id]/client.tsx`
  - `app/(main)/profile/page.tsx`
  - `app/profile/[id]/page.tsx` (novo)
