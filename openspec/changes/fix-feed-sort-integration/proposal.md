# Change: Fix Feed Sort Integration

## Why
O dropdown de ordenacao no feed atualiza corretamente o parametro `ordenar` na URL, mas a pagina do feed nao le esse parametro ao construir o objeto de filtros. Isso faz com que a ordenacao nao seja enviada para a API, resultando em resultados sempre ordenados pelo padrao (mais recente).

Alem disso, varios outros filtros aplicados via URL (marca, modelo, preco, ano, opcionais) tambem nao estao sendo lidos na pagina do feed, quebrando a funcionalidade de filtros persistidos na URL.

## What Changes
- Corrigir `feed/page.tsx` para ler o parametro `ordenar` da URL
- Corrigir `feed/page.tsx` para ler todos os parametros de filtro da URL (marca, modeloCodigo, modelos, precoMin, precoMax, anoMin, anoMax, opcionais)
- Garantir que os filtros da URL sejam passados corretamente para o hook `useInfiniteIntentions`

## Impact
- Affected specs: `feed-sort`
- Affected code:
  - `teachei-web/app/feed/page.tsx` - adicionar leitura de todos os parametros de filtro
