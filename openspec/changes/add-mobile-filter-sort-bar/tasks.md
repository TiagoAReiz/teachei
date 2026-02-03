## 1. Backend - Suporte a Ordenação

- [x] 1.1 Adicionar enum `OrdemAnuncio` com valores: RECENTE, PRECO_ASC, PRECO_DESC, KM_ASC, ANO_DESC, NOME_ASC
- [x] 1.2 Adicionar parâmetro `ordenar` ao `FiltroAnuncio` record
- [x] 1.3 Atualizar `AnuncioRepositoryPort.buscar()` para aceitar ordenação
- [x] 1.4 Implementar ordenação no `AnuncioCosmosAdapter`
- [x] 1.5 Expor parâmetro `ordenar` no `AnuncioController`

## 2. Frontend - Sort Dropdown Component

- [x] 2.1 Criar tipo `SortOption` com valores de ordenação
- [x] 2.2 Criar componente `SortDropdown` (bottom sheet no mobile)
- [x] 2.3 Estilizar dropdown com opções selecionáveis

## 3. Frontend - Mobile Filter/Sort Bar

- [x] 3.1 Criar barra sticky abaixo da busca (integrado em `intention-filters.tsx`)
- [x] 3.2 Integrar botão "Filtrar" com sidebar existente
- [x] 3.3 Integrar botão "Ordenar" com `SortDropdown`
- [x] 3.4 Mostrar opção selecionada no botão de ordenar

## 4. Frontend - Integração

- [x] 4.1 Adicionar parâmetro `ordenar` ao `IntentionFilters` type
- [x] 4.2 Atualizar `getIntentions` em `lib/intentions.ts` para enviar ordenação
- [x] 4.3 Salvar/ler ordenação da URL na página principal
- [x] 4.4 Testar fluxo completo no mobile
