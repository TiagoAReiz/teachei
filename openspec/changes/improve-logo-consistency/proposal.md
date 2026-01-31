# Proposal: improve-logo-consistency

## Why

A logo PNG do TeAchei foi adicionada recentemente, mas a integração visual não está consistente em toda a aplicação:

1. **Página 404** - Ainda usa o logo antigo (ícone Car + texto "TeAchei")
2. **Header principal** - Logo com fundo branco arredondado sobre header escuro, pode parecer "flutuando"
3. **Landing page** - Logo sem tratamento visual, pode não contrastar bem
4. **Auth layout** - Logo grande sem fundo, pode não contrastar sobre a imagem de fundo
5. **Favicon** - Usa a logo PNG que tem fundo claro, pode não aparecer bem na guia do navegador

## What Changes

### 1. Unificar uso do componente Logo
- Atualizar `not-found.tsx` para usar o componente `Logo`
- Remover referências ao logo antigo (Car icon + texto)

### 2. Melhorar estilo do Logo no header
- Remover o `rounded` com fundo branco que destoa
- Ajustar tamanho para integrar melhor ao header
- Considerar altura máxima relativa ao header (h-16 = 64px)

### 3. Melhorar contraste em fundos escuros
- Auth layout: adicionar container com fundo semi-transparente
- Landing page header: garantir boa visibilidade

### 4. Padronizar tamanhos
- Definir tamanhos semânticos claros para cada contexto:
  - Header: pequeno, sem container extra
  - Auth: grande, com container para contraste
  - Footer/Landing: médio

## Impact

- **Visual**: Logo consistente em toda aplicação
- **UX**: Melhor reconhecimento da marca
- **Código**: Remoção de código legado (Car icon logo)
