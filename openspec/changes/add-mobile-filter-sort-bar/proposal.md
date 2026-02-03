# Change: Add Mobile Filter/Sort Bar

## Why
No celular, o botão "Filtrar" não fica visível de forma consistente. Usuários precisam de acesso rápido a filtros e ordenação ao navegar o feed de intenções.

## What Changes

### Frontend - Mobile Filter/Sort Bar
- Criar barra fixa abaixo da busca no mobile (sticky header)
- Botão "Filtrar" à esquerda (abre sidebar existente)
- Botão "Ordenar" à direita (abre dropdown/bottom sheet)
- Barra visível apenas em telas pequenas (`lg:hidden`)

### Frontend - Ordenação
- Criar dropdown/bottom sheet com opções de ordenação:
  - Mais recentes (padrão)
  - Menor preço
  - Maior preço
  - Menor km
  - Ano mais novo
  - A-Z (alfabético)
- Salvar ordenação na URL via query param `ordenar`

### Backend - Suporte a Ordenação
- Adicionar parâmetro `ordenar` ao endpoint `/v1/anuncios`
- Valores aceitos: `recente`, `preco_asc`, `preco_desc`, `km_asc`, `ano_desc`, `nome_asc`
- Default: `recente` (criadoEm DESC)

## Impact
- Affected specs: `mobile-sort-bar`
- Affected code:
  - `AnuncioController.java` (add sort param)
  - `AnuncioRepositoryPort.java` (add sort to query)
  - `AnuncioCosmosAdapter.java` (implement sort)
  - `teachei-web/components/intentions/intention-filters.tsx` (sticky bar)
  - `teachei-web/components/intentions/sort-dropdown.tsx` (new component)
  - `teachei-web/hooks/use-intentions.ts` (add sort param)
