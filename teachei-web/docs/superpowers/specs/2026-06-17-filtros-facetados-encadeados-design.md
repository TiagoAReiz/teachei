# Filtros facetados encadeados (feed de intenções)

**Data:** 2026-06-17
**Status:** Aprovado (design)

## Problema

No painel de filtros do feed (`/feed`), as opções de cada filtro não se
restringem com base nas demais seleções:

- O endpoint de filtros (`/api/v1/anuncios/filtros`) só considera `tipo`. O
  parâmetro `marcaCodigo` é enviado pelo front, mas **descartado** no adapter
  (`getAvailableFilters(tipo?)`), então selecionar uma marca **não** restringe
  os modelos.
- As localizações no front vêm de `useAvailableLocations()`, que busca **todas**
  as localizações (amostra de 200 anúncios, sem filtro), então localização
  nunca encadeia.
- Opcionais filtram apenas por `tipo`.

## Objetivo

Filtros **facetados de verdade**: cada filtro mostra somente as opções
compatíveis com **todas** as outras seleções ativas, em qualquer ordem de
seleção (comportamento de e-commerce).

Decisões de comportamento (aprovadas):

1. **Facetado total** — a seleção de qualquer filtro afeta todos os outros.
   Ex.: escolher localização primeiro já restringe marcas/modelos; escolher
   marca restringe localizações e opcionais.
2. **Auto-exclusão** — ao calcular as opções de uma faceta, aplicam-se todos os
   predicados **exceto o da própria faceta**. Assim, com marca = VW, a lista de
   marcas continua mostrando as outras marcas compatíveis com os demais filtros
   (permite trocar de VW para Fiat sem limpar).

## Abordagem escolhida

**Backend calcula as facetas.** O endpoint `/api/v1/anuncios/filtros` já carrega
todos os anúncios `ATIVO` em memória no servidor para montar marcas/modelos/
localizações. Estendemos para receber **todos** os filtros ativos e aplicar os
predicados em memória, com auto-exclusão por faceta. Mantém os dados no servidor,
escala melhor que computar no cliente e centraliza a regra.

(Rejeitada: computar no frontend — joga o dataset inteiro pro browser e duplica
a regra de negócio.)

## Design

### 1. Contrato de seleção

Novo tipo de entrada compartilhado pela porta de saída, use case e handler:

```ts
interface FiltroSelecao {
  tipo?: TipoVeiculo;
  marcaCodigo?: string;
  modelos?: string[];      // códigos de versão do modelo base selecionado
  modeloCodigo?: string;   // versão específica (alternativa a modelos[])
  cidade?: string;
  estado?: string;
  opcionais?: string[];
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  anoMax?: number;
  kmMin?: number;
  kmMax?: number;
}
```

`AvailableFilters` (retorno) permanece igual:
`{ tipos, marcas, modelos, opcionais, localizacoes }`.

### 2. Backend — `AnuncioSupabaseAdapter.getAvailableFilters(selecao)`

- Carrega uma vez todos os anúncios `ATIVO` (`select tipo, veiculo, contato`),
  como hoje — **sem** o `.eq("tipo", ...)` na query; o filtro de tipo passa a
  ser um predicado em memória, igual aos demais.
- Define um predicado por dimensão sobre cada anúncio:
  - `tipo`: `r.tipo === sel.tipo`
  - `marca`: `veiculo.marcaCodigo === sel.marcaCodigo`
  - `modelo`: `veiculo.modeloCodigo ∈ (sel.modelos ?? [sel.modeloCodigo])`
  - `local`: `contato.cidade === sel.cidade && contato.estado === sel.estado`
  - `opcionais`: `sel.opcionais ⊆ (veiculo.opcionais ?? [])` (todos presentes)
  - `preco`: `veiculo.precoMaximo` dentro de `[precoMin, precoMax]`
  - `ano`: algum de `veiculo.anos` dentro de `[anoMin, anoMax]`
  - `km`: sobreposição de `[quilometragemMinima, quilometragemMaxima]` com
    `[kmMin, kmMax]`
  - Cada predicado é "neutro" (true) quando o filtro correspondente está vazio.
- Para cada faceta, filtra os anúncios aplicando **todos** os predicados menos o
  próprio, e deriva as opções distintas:
  - `tipos` ← todos menos `tipo`
  - `marcas` ← todos menos `marca`
  - `modelos` ← todos menos `modelo` (mantém marca/tipo)
  - `localizacoes` ← todos menos `local`
  - `opcionais` ← todos menos `opcionais` (depois cruzado com a tabela
    `opcionais` ativa, preservando label/ordem e o filtro por tipo já existente)
- As faixas (preço/ano/km) entram apenas como predicado; não produzem lista.

### 3. Backend — porta, use case e handler

- `AnuncioRepositoryPort.getAvailableFilters(selecao: FiltroSelecao)`.
- `BuscarFiltrosUseCase.execute(selecao: FiltroSelecao)`.
- `handleFiltros`: lê todos os campos da query string (mesmos nomes já usados na
  listagem: `tipo`, `marcaCodigo`, `modeloCodigo`, `modelos` (CSV), `cidade`,
  `estado`, `opcionais` (repetido), `precoMin`, `precoMax`, `anoMin`, `anoMax`,
  `kmMin`, `kmMax`) e monta o `FiltroSelecao`.

### 4. Frontend — `lib/intentions.getAvailableFilters`

Passa a aceitar o objeto de seleção completo e serializar todos os campos na
query string (alinhado com `getIntentions`).

### 5. Frontend — `hooks/use-intentions`

- `useAvailableFilters(selecao)` recebe a seleção inteira; a `queryKey` inclui
  todos os campos.
- `useAvailableLocations` deixa de ser usado pelo painel de filtros (as
  localizações passam a vir da faceta). Avaliar remoção se não houver outro uso.

### 6. Frontend — `FilterSidebar`

- Usa **um único** fetch baseado no estado local `filters` (hoje há dois:
  um para "todos os tipos" e outro filtrado). As listas de tipo, marca, modelo,
  versão, opcionais e localização vêm todas desse retorno facetado.
- Localização passa a usar `availableFilters.localizacoes` (remove dependência
  do hook global que impedia o encadeamento).
- As opções recalculam a cada mudança no painel, **antes** do "Aplicar".
- Saneamento: ao trocar um filtro, limpar seleções dependentes que deixaram de
  existir nas novas facetas (mantém a limpeza já existente de tipo→marca→modelo
  e estende para localização/opcionais órfãos).

## Pontos de atenção

- Cada alteração no painel dispara 1 GET em `/filtros`, cacheado pelo React
  Query. Para o volume atual de intenções é aceitável; cache no servidor pode
  ser adicionado depois se o conjunto crescer.
- O endpoint continua público (`requireAuth: false`), sem mudança de contrato de
  autenticação.
- A listagem (`getIntentions`) não muda; apenas o cálculo das **opções** de
  filtro.

## Fora de escopo

- Paginação de `/my-intentions` e perfil.
- Cache no servidor para o endpoint de filtros.
- Contadores por opção (ex.: "Fiat (12)").
