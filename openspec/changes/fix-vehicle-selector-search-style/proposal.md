# Change: Corrigir estilo das barras de busca no seletor de veículos

## Why
Na página de criação de intenção (aba de seleção de veículo), tanto a barra de busca de marca quanto a de modelo apresentam um fundo branco (`bg-surface` = `#ffffff`) que contrasta de forma estranha com o fundo creme da página (`bg-background` = `#f8f6f0`). Isso cria uma inconsistência visual que prejudica a experiência do usuário.

## What Changes
- Remover o fundo branco das barras de busca de marca, modelo e versão
- Unificar o estilo dos campos de busca para combinar com o design geral da página
- Usar `bg-transparent` ou `bg-background` para o container sticky da busca
- Ajustar o input de busca para ter um estilo mais integrado (sem contraste excessivo)

## Impact
- Affected specs: `add-searchable-vehicle-selector` (modifica requisitos visuais existentes)
- Affected code: 
  - `teachei-web/app/create/vehicle/page.tsx` (componente `SearchInput`)
  - Potencialmente `teachei-web/components/ui/searchable-list.tsx` se necessário unificar
