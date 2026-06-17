# Paginação "Carregar mais" nas telas secundárias

**Data:** 2026-06-17
**Status:** Aprovado

## Objetivo

Levar a mesma paginação da tela de intenções (feed) — botão "Carregar mais" via
`react-query` infinite query + `IntentionGrid` — para três telas que hoje carregam a
lista inteira de uma vez:

1. **Minhas intenções** (`app/(main)/my-intentions/page.tsx`)
2. **Perfil de outros usuários** (`app/user/[id]/client.tsx`)
3. **Favoritos** (`app/(main)/favorites/page.tsx`)

A paginação é **real no backend** (decisão do usuário). Tamanho de página: **12**
(igual ao feed).

## Contexto atual

- O feed (`app/(main)/page.tsx`) usa `useInfiniteIntentions` → `getIntentions` →
  `GET /api/v1/anuncios` (paginado de verdade) e renderiza via `IntentionGrid`, que
  já tem o botão "Carregar mais" através das props `onLoadMore` / `hasMore` /
  `isLoadingMore`.
- O repositório `AnuncioSupabaseAdapter.findAll` já suporta `usuarioId`, `status`,
  `page`, `size` e retorna `PaginatedAnuncios` completo
  (`content`, `totalElements`, `totalPages`, `page`, `size`, `hasNext`, `hasPrevious`).
- `handleMeus` e `handlePorUsuario` hoje chamam o use case com `size: 1000` e
  retornam **apenas** `result.content`, descartando a paginação.
- Favoritos: `GET /api/v1/favoritos` retorna **só IDs**; a tela busca cada anúncio
  por ID no cliente. Usuários **não logados** guardam os IDs no `localStorage`
  (`useSavedIntentions`), portanto o servidor não conhece esses favoritos.

`PaginatedResponse<Anuncio>` (front) e `PaginatedAnuncios` (back) têm o mesmo formato,
então o `getNextPageParam` do feed (`page < totalPages - 1`) funciona sem alteração.

### Consumidores fora de escopo (descobertos no planejamento)

Os endpoints `meus` e `usuario/[userId]` têm consumidores além das 3 telas-alvo:

- `app/(main)/profile/page.tsx` (perfil do **próprio** usuário) usa `useMyIntentions`
  e mostra `slice(0, 3)`.
- `app/profile/[id]/page.tsx` (um **segundo** perfil público, distinto de
  `app/user/[id]`) usa `getIntentionsByUserId` e mostra todas.

Para não quebrar essas telas nem aumentar o escopo, a estratégia é **aditiva**:

- `getMyIntentions()` e `getIntentionsByUserId(userId)` **continuam retornando
  `Anuncio[]`**, agora lendo `.content` da resposta paginada com `size` grande
  (preserva o comportamento atual: antes o handler usava `size: 1000`).
- Funções/hook **novos** e paginados (`getMyIntentionsPage`, `getUserIntentionsPage`,
  `useInfiniteMyIntentions`, `useInfiniteUserIntentions`) são usados **só** pelas
  telas-alvo (`my-intentions` e `user/[id]`).
- `app/profile/[id]/page.tsx` e `app/(main)/profile/page.tsx` ficam inalterados.

## Mudanças

### 1. Minhas intenções

**Backend — `backend/anuncio/web/handler.ts` → `handleMeus`:**
- Ler `page` (default `0`), `size` (default `12`) e `status` (opcional,
  `StatusAnuncio`) da query string.
- Montar filtros: `{ usuarioId, page, size }`.
  - Se `status` presente → adicionar `status` (NÃO setar `incluirTodosStatus`).
  - Se `status` ausente → `incluirTodosStatus: true` (cuidado: sem isso, o adapter
    força `status = ATIVO` na linha 31).
- Retornar `result` completo (paginado), não `result.content`.

**`lib/intentions.ts` → nova `getMyIntentionsPage`:**
- `getMyIntentionsPage(params: { page?: number; size?: number; status?: StatusAnuncio })`
  → `Promise<PaginatedResponse<Anuncio>>`. Monta query string com `page`, `size`,
  `status` quando presentes.
- `getMyIntentions()` (existente) **mantida**: agora chama o endpoint com `size: 1000`
  e retorna `res.content` (`Anuncio[]`), preservando o comportamento atual.

**`hooks/use-intentions.ts` → novo `useInfiniteMyIntentions`:**
- `useInfiniteQuery` com `queryKey: ["intentions", "mine", "infinite", status]`
  (status no key → trocar filtro reseta a paginação).
- `queryFn: ({ pageParam = 0 }) => getMyIntentionsPage({ page: pageParam, size: 12, status })`.
- `getNextPageParam` igual ao feed.
- `useMyIntentions` (existente) **mantida** para `profile/page.tsx`.

**Página `my-intentions/page.tsx`:**
- Substituir `useMyIntentions()` por `useInfiniteMyIntentions(filter)` onde `filter`
  é o status selecionado (`"" | StatusAnuncio`); converter `""` em `undefined` ao
  passar para o hook.
- O filtro de status passa a ser server-side (já não filtra o array no cliente).
- `intentions = data?.pages.flatMap(p => p.content) ?? []`.
- **Manter os cards atuais** (badge de status, editar, excluir) e os estados de
  loading/empty.
- Adicionar botão "Carregar mais" no fim quando `hasNextPage` (mesmo estilo do
  `IntentionGrid`: `onClick={fetchNextPage}`, `disabled={isFetchingNextPage}`).
- `useDeleteIntention` já invalida `["intentions"]`, o que cobre a nova query.

### 2. Perfil de outros usuários

**Backend — `handlePorUsuario`:**
- Ler `page` (default `0`), `size` (default `12`).
- Filtros `{ usuarioId: userId, page, size }` (continua só `ATIVO`, sem
  `incluirTodosStatus`).
- Retornar `result` completo (paginado), não `result.content`.

**`lib/intentions.ts` → nova `getUserIntentionsPage`:**
- `getUserIntentionsPage(userId, params: { page?: number; size?: number })`
  → `Promise<PaginatedResponse<Anuncio>>`.
- `getIntentionsByUserId(userId)` (existente) **mantida**: chama o endpoint com
  `size: 1000` e retorna `res.content` (`Anuncio[]`), para `profile/[id]/page.tsx`.

**`hooks/use-intentions.ts` → novo `useInfiniteUserIntentions`:**
- `useInfiniteQuery`, `queryKey: ["intentions", "user", userId, "infinite"]`,
  `enabled: !!userId`, demais igual ao feed.

**`app/user/[id]/client.tsx`:**
- Remover o `TODO: Fetch user's intentions` e o `IntentionGrid intentions={[]}`.
- Usar `useInfiniteUserIntentions(user.id)`, achatar páginas e passar
  `intentions`, `isLoading`, `onLoadMore={fetchNextPage}`, `hasMore={hasNextPage}`,
  `isLoadingMore={isFetchingNextPage}` para o `IntentionGrid`.

### 3. Favoritos (endpoint paginado novo + fallback anônimo)

**Backend — novo endpoint `GET /api/v1/favoritos/anuncios?page=&size=`:**
- Arquivo de rota `app/api/v1/favoritos/anuncios/route.ts` chamando um novo
  `handleListarAnuncios` em `backend/favorito/web/handler.ts`.
- `handleListarAnuncios`:
  - `usuarioId` do header `X-Usuario-Id`.
  - Ler `page` (0) e `size` (12).
  - Pegar a página de IDs favoritos (com count total) → ver porta abaixo.
  - Buscar os anúncios desses IDs via `AnuncioRepositoryPort.findByIds`.
  - Reordenar os anúncios para seguir a ordem dos IDs (favoritos mais recentes
    primeiro, como já faz o adapter de favorito).
  - Devolver `PaginatedResponse<Anuncio>`:
    `{ content, totalElements, totalPages, page, size, hasNext, hasPrevious }`.

**Porta/adapter de favorito:**
- `FavoritoRepositoryPort`: novo método
  `findPageByUsuarioId(usuarioId, page, size): Promise<{ ids: string[]; total: number }>`.
- `FavoritoSupabaseAdapter`: implementar com
  `.select("anuncio_id", { count: "exact" }).eq("usuario_id", id)
   .order("criado_em", { ascending: false }).range(from, to)`.

**Porta/adapter de anúncio:**
- `AnuncioRepositoryPort`: novo método `findByIds(ids: string[]): Promise<Anuncio[]>`.
- `AnuncioSupabaseAdapter.findByIds`: `select("*").in("id", ids)`; retorna `[]` se
  `ids` vazio (sem ida ao banco).

**`lib` (favoritos):**
- Nova função `getFavoriteIntentions({ page?, size? }): Promise<PaginatedResponse<Anuncio>>`
  chamando o novo endpoint (com `requireAuth: true`).

**`hooks` → novo `useInfiniteFavorites`:**
- `useInfiniteQuery`, `queryKey: ["favorites", "infinite"]`, `enabled` só quando
  autenticado, demais igual ao feed.

**Página `favorites/page.tsx`:**
- Detectar autenticação (mesma lógica de `useSavedIntentions` / `isAuthenticated`).
- **Logado:** `useInfiniteFavorites`; achatar páginas; render `IntentionCard` em grid +
  botão "Carregar mais".
- **Anônimo:** manter o caminho atual (IDs do localStorage), mas paginar no cliente —
  fatiar `savedIds` em blocos de 12, buscar a fatia visível por ID e revelar mais com
  "Carregar mais".
- Manter estados de loading (skeleton) e empty atuais.

## Componentes / interfaces afetados

| Unidade | Mudança |
|---|---|
| `backend/anuncio/web/handler.ts` | `handleMeus`, `handlePorUsuario` passam a paginar |
| `backend/anuncio/.../AnuncioRepositoryPort.ts` | + `findByIds` |
| `backend/anuncio/.../AnuncioSupabaseAdapter.ts` | + `findByIds` |
| `backend/favorito/web/handler.ts` | + `handleListarAnuncios` |
| `backend/favorito/.../FavoritoRepositoryPort.ts` | + `findPageByUsuarioId` |
| `backend/favorito/.../FavoritoSupabaseAdapter.ts` | + `findPageByUsuarioId` |
| `app/api/v1/favoritos/anuncios/route.ts` | nova rota |
| `lib/intentions.ts` | `getMyIntentions`, `getIntentionsByUserId` retornam paginado |
| `lib/` favoritos | + `getFavoriteIntentions` |
| `hooks/use-intentions.ts` | + `useInfiniteMyIntentions`, `useInfiniteUserIntentions` |
| `hooks/` favoritos | + `useInfiniteFavorites` |
| `app/(main)/my-intentions/page.tsx` | infinite query + filtro server-side + load-more |
| `app/user/[id]/client.tsx` | wire de dados + load-more |
| `app/(main)/favorites/page.tsx` | infinite query (logado) / slice (anônimo) + load-more |

## Tratamento de erros

- Handlers já têm `err()` padrão (AppError → status; senão 500).
- `findByIds([])` retorna `[]` sem consultar o banco.
- Favorito logado sem itens → `content: []`, `totalPages: 0`, `hasNext: false`
  (a tela mostra o empty state atual).

## Testes

- Há testes em `backend/__tests__/` para `AnuncioService` e
  `GerenciarFavoritosUseCaseImpl`. Adicionar/ajustar cobertura para:
  - `handleMeus` retornando shape paginado e respeitando `status` vs `incluirTodosStatus`.
  - `findByIds` (ordem e lista vazia).
  - `findPageByUsuarioId` (count + range).
- Verificação manual: as três telas carregam a 1ª página, "Carregar mais" traz a
  próxima, e o filtro de status em "minhas intenções" reseta a paginação.

## Fora de escopo

- Não muda o visual dos cards (minhas intenções mantém os atuais).
- Não adiciona filtros (`IntentionFilters`) às telas secundárias — só paginação.
- Não mexe no scroll infinito automático: usa o mesmo botão "Carregar mais" do feed.
