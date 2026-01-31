# Proposal: unify-logo-and-theme

## Why

A logo atual tem um fundo creme (#f5f5dc ou similar) que não combina com o fundo cinza claro (#f6f7f8) do app. Isso cria uma sensação visual de "descasamento".

Problemas atuais:
1. Logo aparece sem container consistente em algumas partes
2. Fundo do app é cinza claro, logo tem fundo creme - não combinam
3. Falta padding e border-radius uniforme na logo

## What Changes

### 1. Componente Logo
- Adicionar container com `rounded-xl` (ou `rounded-2xl`)
- Adicionar `padding` interno consistente
- Container com fundo branco/transparente para dar destaque

### 2. Tema do App (globals.css)
- Mudar cor de `--background` de `#f6f7f8` (cinza) para cor creme `#f5f5dc` ou similar
- Manter `--surface` como `#ffffff` para cards e elementos de superfície

### 3. Aplicar em todos os lugares
- Header principal
- Landing page (header e footer)
- Auth layout (desktop e mobile)
- Página 404

## Impact

- **Visual**: App com identidade visual coesa com a marca
- **UX**: Logo se integra naturalmente ao design
- **Consistência**: Mesmo tratamento em todos os lugares
