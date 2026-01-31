# Proposal: refactor-logo-and-background

## Why

As propostas anteriores (`improve-logo-consistency` e `unify-logo-and-theme`) não resolveram adequadamente a integração visual do logo. Problemas atuais:

1. **Logo com container branco** - O componente `Logo` usa `bg-white` que cria um contraste artificial com o fundo creme do próprio logo PNG
2. **Fundo do app não combina** - O `--background: #faf8f5` não é exatamente o tom creme do logo, criando desarmonia
3. **Falta de consistência** - O logo aparece diferente em cada contexto (header, landing, auth, 404)

## What Changes

### 1. Ajustar cor de fundo do app
- Alterar `--background` para combinar exatamente com o creme do logo (~`#f8f6f0` ou similar ao PNG)
- Manter `--surface` como branco para cards/elementos de superfície

### 2. Refatorar componente Logo
- **Remover** o container branco (`bg-white`) - o logo já tem seu próprio fundo creme que agora combina com o app
- **Manter** o `rounded-2xl` aplicado diretamente na imagem para bordas arredondadas
- **Manter** padding externo para espaçamento adequado das bordas do header
- Aplicar `overflow-hidden` para garantir que o arredondamento funcione corretamente

### 3. Padronizar em todos os lugares
- **Header** - Logo com container rounded e padding adequado
- **Landing page** - Header e footer com mesmo padrão
- **Auth layout** - Desktop e mobile com tratamento consistente
- **Página 404** - Mesmo padrão visual

## Impact

- **Visual**: Logo integrado naturalmente com o fundo creme do app
- **UX**: Identidade visual coesa e profissional
- **Código**: Componente Logo mais simples e consistente
- **Arquivos afetados**:
  - `teachei-web/app/globals.css`
  - `teachei-web/components/ui/logo.tsx`
