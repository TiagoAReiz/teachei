# Paginação nas telas secundárias — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trazer a paginação "Carregar mais" do feed para as telas de minhas intenções, perfil de outro usuário e favoritos, com paginação real no backend.

**Architecture:** O repositório `AnuncioSupabaseAdapter.findAll` já pagina; os handlers `meus`/`usuario` apenas paravam de expor a paginação. Vamos expô-la e adicionar, de forma aditiva, funções/ha­ooks paginados consumidos só pelas telas-alvo (mantendo as funções array-based para os perfis fora de escopo). Favoritos ganha um endpoint paginado próprio (compondo favoritos + anúncios) com fallback client-side para favoritos anônimos do `localStorage`.

**Tech Stack:** Next.js 16 (App Router), React 19, `@tanstack/react-query` v5 (`useInfiniteQuery`), Supabase, Vitest. Backend hexagonal em `backend/<entidade>/...`.

## Global Constraints

- Tamanho de página: **12** em todas as telas-alvo (igual ao feed).
- Formato paginado idêntico ao feed: `PaginatedResponse<T>` = `{ content, totalElements, totalPages, page, size, hasNext, hasPrevious }`; `getNextPageParam` usa `page < totalPages - 1`.
- Não alterar o visual dos cards de "minhas intenções" (status/editar/excluir).
- Não adicionar `IntentionFilters` às telas secundárias — só paginação.
- Não tocar em `app/profile/[id]/page.tsx` nem `app/(main)/profile/page.tsx` (devem continuar compilando e funcionando via as funções array-based).
- Verificação por tarefa: `npx tsc --noEmit` (typecheck) e, quando houver teste, `npm test`. **Não** rodar `npm run build` (dispara `prisma db push --accept-data-loss`).
- Mensagens de commit em português, terminando com a linha `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

### Task 1: `findByIds` no repositório de anúncios

**Files:**
- Modify: `backend/anuncio/application/ports/out/AnuncioRepositoryPort.ts`
- Modify: `backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts`

**Interfaces:**
- Produces: `AnuncioRepositoryPort.findByIds(ids: string[]): Promise<Anuncio[]>` — retorna os anúncios cujos IDs estão em `ids` (ordem não garantida); `[]` quando `ids` é vazio (sem consultar o banco).

- [ ] **Step 1: Adicionar o método à porta**

Em `AnuncioRepositoryPort.ts`, dentro da interface `AnuncioRepositoryPort`, logo após `findById`:

```ts
  findById(id: string): Promise<Anuncio | null>;
  findByIds(ids: string[]): Promise<Anuncio[]>;
```

- [ ] **Step 2: Implementar no adapter**

Em `AnuncioSupabaseAdapter.ts`, logo após o método `findById`:

```ts
  async findByIds(ids: string[]): Promise<Anuncio[]> {
    if (ids.length === 0) return [];
    const { data, error } = await supabase.from("anuncios").select("*").in("id", ids);
    if (error) throw new Error(error.message);
    return (data ?? []).map(toAnuncio);
  }
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add backend/anuncio/application/ports/out/AnuncioRepositoryPort.ts backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts
git commit -m "feat: findByIds no repositorio de anuncios

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Paginar `handleMeus` e `handlePorUsuario`

**Files:**
- Modify: `backend/anuncio/web/handler.ts`

**Interfaces:**
- Produces: `GET /api/v1/anuncios/meus?page=&size=&status=` → `PaginatedResponse<Anuncio>` (sem `status` ⇒ todos os status; com `status` ⇒ filtra por ele). `GET /api/v1/anuncios/usuario/:userId?page=&size=` → `PaginatedResponse<Anuncio>` (só `ATIVO`).

- [ ] **Step 1: Importar o tipo de status**

Em `backend/anuncio/web/handler.ts`, abaixo do import de `TipoVeiculo`:

```ts
import type { TipoVeiculo } from "@/backend/anuncio/domain/model/Anuncio";
import type { StatusAnuncio } from "@/backend/anuncio/domain/model/StatusAnuncio";
```

- [ ] **Step 2: Reescrever `handleMeus`**

Substituir a função `handleMeus` inteira por:

```ts
export async function handleMeus(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const p = new URL(req.url).searchParams;
    const page = p.get("page") ? Number(p.get("page")) : 0;
    const size = p.get("size") ? Number(p.get("size")) : 12;
    const status = (p.get("status") as StatusAnuncio | null) ?? undefined;
    // sem status → incluirTodosStatus (senão o adapter força status=ATIVO)
    const filters = status
      ? { usuarioId, status, page, size }
      : { usuarioId, incluirTodosStatus: true, page, size };
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute(filters);
    return Response.json(result);
  } catch (e) { return err(e); }
}
```

- [ ] **Step 3: Reescrever `handlePorUsuario`**

Substituir a função `handlePorUsuario` inteira por:

```ts
export async function handlePorUsuario(req: Request, userId: string): Promise<Response> {
  try {
    const p = new URL(req.url).searchParams;
    const page = p.get("page") ? Number(p.get("page")) : 0;
    const size = p.get("size") ? Number(p.get("size")) : 12;
    // Rota pública: só ATIVO (sem incluirTodosStatus)
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute({ usuarioId: userId, page, size });
    return Response.json(result);
  } catch (e) { return err(e); }
}
```

(A rota `app/api/v1/anuncios/usuario/[userId]/route.ts` já chama `handlePorUsuario(req, userId)` — sem mudanças.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add backend/anuncio/web/handler.ts
git commit -m "feat: paginacao real em meus anuncios e anuncios por usuario

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: `findPageByUsuarioId` no repositório de favoritos

**Files:**
- Modify: `backend/favorito/application/ports/out/FavoritoRepositoryPort.ts`
- Modify: `backend/favorito/infrastructure/persistence/FavoritoSupabaseAdapter.ts`
- Modify: `backend/__tests__/favorito/GerenciarFavoritosUseCaseImpl.test.ts`

**Interfaces:**
- Produces: `FavoritoRepositoryPort.findPageByUsuarioId(usuarioId: string, page: number, size: number): Promise<{ ids: string[]; total: number }>` — página de IDs favoritos (mais recentes primeiro) + total geral.

- [ ] **Step 1: Adicionar o método à porta**

Em `FavoritoRepositoryPort.ts`, dentro da interface, após `findByUsuarioId`:

```ts
  findByUsuarioId(usuarioId: string): Promise<string[]>;
  findPageByUsuarioId(usuarioId: string, page: number, size: number): Promise<{ ids: string[]; total: number }>;
```

- [ ] **Step 2: Implementar no adapter**

Em `FavoritoSupabaseAdapter.ts`, após o método `findByUsuarioId`:

```ts
  async findPageByUsuarioId(usuarioId: string, page: number, size: number): Promise<{ ids: string[]; total: number }> {
    const from = page * size;
    const to = from + size - 1;
    const { data, count } = await supabase
      .from("favoritos")
      .select("anuncio_id", { count: "exact" })
      .eq("usuario_id", usuarioId)
      .order("criado_em", { ascending: false })
      .range(from, to);
    return {
      ids: (data ?? []).map((r) => r.anuncio_id as string),
      total: count ?? 0,
    };
  }
```

- [ ] **Step 3: Atualizar o mock do teste existente**

Em `backend/__tests__/favorito/GerenciarFavoritosUseCaseImpl.test.ts`, no objeto `mockRepo`, adicionar a nova função para o tipo continuar satisfeito:

```ts
const mockRepo: FavoritoRepositoryPort = {
  findByUsuarioId: vi.fn(),
  findPageByUsuarioId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn(),
};
```

- [ ] **Step 4: Rodar os testes**

Run: `npm test`
Expected: PASS (todos os testes existentes continuam passando).

- [ ] **Step 5: Commit**

```bash
git add backend/favorito/application/ports/out/FavoritoRepositoryPort.ts backend/favorito/infrastructure/persistence/FavoritoSupabaseAdapter.ts backend/__tests__/favorito/GerenciarFavoritosUseCaseImpl.test.ts
git commit -m "feat: findPageByUsuarioId no repositorio de favoritos

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Use case + endpoint de favoritos paginados

**Files:**
- Create: `backend/favorito/application/usecase/ListarAnunciosFavoritosUseCaseImpl.ts`
- Create: `backend/__tests__/favorito/ListarAnunciosFavoritosUseCaseImpl.test.ts`
- Modify: `backend/favorito/web/handler.ts`
- Create: `app/api/v1/favoritos/anuncios/route.ts`

**Interfaces:**
- Consumes: `FavoritoRepositoryPort.findPageByUsuarioId` (Task 3), `AnuncioRepositoryPort.findByIds` (Task 1).
- Produces: `GET /api/v1/favoritos/anuncios?page=&size=` → `PaginatedResponse<Anuncio>` (favoritos do usuário autenticado, mais recentes primeiro). `ListarAnunciosFavoritosUseCaseImpl.execute(usuarioId: string, page: number, size: number): Promise<PaginatedAnuncios>`.

- [ ] **Step 1: Escrever o teste do use case (falhando)**

Criar `backend/__tests__/favorito/ListarAnunciosFavoritosUseCaseImpl.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListarAnunciosFavoritosUseCaseImpl } from "@/backend/favorito/application/usecase/ListarAnunciosFavoritosUseCaseImpl";
import type { FavoritoRepositoryPort } from "@/backend/favorito/application/ports/out/FavoritoRepositoryPort";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";

const favoritoRepo: FavoritoRepositoryPort = {
  findByUsuarioId: vi.fn(),
  findPageByUsuarioId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn(),
};

const anuncioRepo = { findByIds: vi.fn() } as unknown as AnuncioRepositoryPort;

const anuncio = (id: string) => ({ id }) as Anuncio;

describe("ListarAnunciosFavoritosUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retorna anuncios na ordem dos IDs favoritos e calcula a paginacao", async () => {
    vi.mocked(favoritoRepo.findPageByUsuarioId).mockResolvedValue({ ids: ["a", "b"], total: 30 });
    vi.mocked(anuncioRepo.findByIds).mockResolvedValue([anuncio("b"), anuncio("a")]); // fora de ordem

    const uc = new ListarAnunciosFavoritosUseCaseImpl(favoritoRepo, anuncioRepo);
    const res = await uc.execute("user-1", 0, 12);

    expect(res.content.map((a) => a.id)).toEqual(["a", "b"]);
    expect(res.totalElements).toBe(30);
    expect(res.totalPages).toBe(3);
    expect(res.page).toBe(0);
    expect(res.hasNext).toBe(true);
    expect(res.hasPrevious).toBe(false);
    expect(anuncioRepo.findByIds).toHaveBeenCalledWith(["a", "b"]);
  });

  it("lista vazia -> content vazio e sem proxima pagina", async () => {
    vi.mocked(favoritoRepo.findPageByUsuarioId).mockResolvedValue({ ids: [], total: 0 });
    vi.mocked(anuncioRepo.findByIds).mockResolvedValue([]);

    const uc = new ListarAnunciosFavoritosUseCaseImpl(favoritoRepo, anuncioRepo);
    const res = await uc.execute("user-1", 0, 12);

    expect(res.content).toEqual([]);
    expect(res.totalPages).toBe(0);
    expect(res.hasNext).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar a falha**

Run: `npm test -- ListarAnunciosFavoritosUseCaseImpl`
Expected: FAIL (módulo do use case ainda não existe).

- [ ] **Step 3: Implementar o use case**

Criar `backend/favorito/application/usecase/ListarAnunciosFavoritosUseCaseImpl.ts`:

```ts
import type { FavoritoRepositoryPort } from "@/backend/favorito/application/ports/out/FavoritoRepositoryPort";
import type { AnuncioRepositoryPort, PaginatedAnuncios } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";

export class ListarAnunciosFavoritosUseCaseImpl {
  constructor(
    private favoritoRepo: FavoritoRepositoryPort,
    private anuncioRepo: AnuncioRepositoryPort,
  ) {}

  async execute(usuarioId: string, page: number, size: number): Promise<PaginatedAnuncios> {
    const { ids, total } = await this.favoritoRepo.findPageByUsuarioId(usuarioId, page, size);
    const anuncios = await this.anuncioRepo.findByIds(ids);
    const byId = new Map(anuncios.map((a) => [a.id, a]));
    const content = ids
      .map((id) => byId.get(id))
      .filter((a): a is Anuncio => a !== undefined);
    const totalPages = size > 0 ? Math.ceil(total / size) : 0;
    return {
      content,
      totalElements: total,
      totalPages,
      page,
      size,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    };
  }
}
```

- [ ] **Step 4: Rodar o teste para confirmar que passa**

Run: `npm test -- ListarAnunciosFavoritosUseCaseImpl`
Expected: PASS (2 testes).

- [ ] **Step 5: Adicionar `handleListarAnuncios` ao handler de favoritos**

Em `backend/favorito/web/handler.ts`, adicionar os imports no topo:

```ts
import { FavoritoSupabaseAdapter } from "@/backend/favorito/infrastructure/persistence/FavoritoSupabaseAdapter";
import { GerenciarFavoritosUseCaseImpl } from "@/backend/favorito/application/usecase/GerenciarFavoritosUseCaseImpl";
import { AnuncioSupabaseAdapter } from "@/backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter";
import { ListarAnunciosFavoritosUseCaseImpl } from "@/backend/favorito/application/usecase/ListarAnunciosFavoritosUseCaseImpl";
import { AppError } from "@/backend/shared/errors";
```

E adicionar a função (ao final do arquivo):

```ts
export async function handleListarAnuncios(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const p = new URL(req.url).searchParams;
    const page = p.get("page") ? Number(p.get("page")) : 0;
    const size = p.get("size") ? Number(p.get("size")) : 12;
    const result = await new ListarAnunciosFavoritosUseCaseImpl(
      new FavoritoSupabaseAdapter(),
      new AnuncioSupabaseAdapter(),
    ).execute(usuarioId, page, size);
    return Response.json(result);
  } catch (e) { return err(e); }
}
```

- [ ] **Step 6: Criar a rota**

Criar `app/api/v1/favoritos/anuncios/route.ts`:

```ts
import { handleListarAnuncios } from "@/backend/favorito/web/handler";

export async function GET(req: Request) {
  return handleListarAnuncios(req);
}
```

(O middleware protege `/api/v1/favoritos` via `startsWith`, então `/api/v1/favoritos/anuncios` recebe o header `X-Usuario-Id`.)

- [ ] **Step 7: Typecheck + testes**

Run: `npx tsc --noEmit && npm test`
Expected: sem erros de tipo; todos os testes PASS.

- [ ] **Step 8: Commit**

```bash
git add backend/favorito/application/usecase/ListarAnunciosFavoritosUseCaseImpl.ts backend/__tests__/favorito/ListarAnunciosFavoritosUseCaseImpl.test.ts backend/favorito/web/handler.ts app/api/v1/favoritos/anuncios/route.ts
git commit -m "feat: endpoint paginado de anuncios favoritos

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Funções de dados no front (lib)

**Files:**
- Modify: `config/env.ts`
- Modify: `lib/intentions.ts`
- Create: `lib/favorites.ts`

**Interfaces:**
- Consumes: endpoints das Tasks 2 e 4.
- Produces:
  - `getMyIntentionsPage(params?: { page?: number; size?: number; status?: StatusAnuncio }): Promise<PaginatedResponse<Anuncio>>`
  - `getUserIntentionsPage(userId: string, params?: { page?: number; size?: number }): Promise<PaginatedResponse<Anuncio>>`
  - `getFavoriteIntentions(params?: { page?: number; size?: number }): Promise<PaginatedResponse<Anuncio>>`
  - `getMyIntentions()` e `getIntentionsByUserId(userId)` mantêm assinatura/`Anuncio[]`.

- [ ] **Step 1: Adicionar o endpoint de favoritos paginados**

Em `config/env.ts`, dentro de `API_ENDPOINTS`, após a seção de Profile (ou perto do fim), adicionar:

```ts
  // Favorites
  FAVORITES_INTENTIONS: "/api/v1/favoritos/anuncios",
```

- [ ] **Step 2: Importar `StatusAnuncio` em `lib/intentions.ts`**

Adicionar `StatusAnuncio` à lista de imports de `@/types` no topo de `lib/intentions.ts`:

```ts
import type {
  Anuncio,
  AvailableFilters,
  AvailableLocalizacao,
  CreateAnuncioRequest,
  UpdateAnuncioRequest,
  PaginatedResponse,
  IntentionFilters,
  TipoVeiculo,
  StatusAnuncio,
} from "@/types";
```

- [ ] **Step 3: Substituir `getMyIntentions` e adicionar `getMyIntentionsPage`**

Substituir a função `getMyIntentions` existente por:

```ts
/**
 * Fetch current user's intentions (array completo — usado pelo perfil próprio).
 */
export async function getMyIntentions(): Promise<Anuncio[]> {
  const res = await api.get<PaginatedResponse<Anuncio>>(`${API_ENDPOINTS.MY_INTENTIONS}?size=1000`);
  return res.content;
}

/**
 * Fetch current user's intentions, paginated (tela "minhas intenções").
 */
export async function getMyIntentionsPage(
  params: { page?: number; size?: number; status?: StatusAnuncio } = {}
): Promise<PaginatedResponse<Anuncio>> {
  const sp = new URLSearchParams();
  if (params.page !== undefined) sp.append("page", String(params.page));
  if (params.size !== undefined) sp.append("size", String(params.size));
  if (params.status) sp.append("status", params.status);
  const qs = sp.toString();
  const url = qs ? `${API_ENDPOINTS.MY_INTENTIONS}?${qs}` : API_ENDPOINTS.MY_INTENTIONS;
  return api.get<PaginatedResponse<Anuncio>>(url);
}
```

- [ ] **Step 4: Substituir `getIntentionsByUserId` e adicionar `getUserIntentionsPage`**

Substituir a função `getIntentionsByUserId` existente por:

```ts
/**
 * Fetch intentions by user ID (array completo — usado por app/profile/[id]).
 */
export async function getIntentionsByUserId(userId: string): Promise<Anuncio[]> {
  const res = await api.get<PaginatedResponse<Anuncio>>(
    `${API_ENDPOINTS.INTENTIONS_BY_USER(userId)}?size=1000`,
    { requireAuth: false }
  );
  return res.content;
}

/**
 * Fetch intentions by user ID, paginated (tela app/user/[id]).
 */
export async function getUserIntentionsPage(
  userId: string,
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<Anuncio>> {
  const sp = new URLSearchParams();
  if (params.page !== undefined) sp.append("page", String(params.page));
  if (params.size !== undefined) sp.append("size", String(params.size));
  const qs = sp.toString();
  const url = qs
    ? `${API_ENDPOINTS.INTENTIONS_BY_USER(userId)}?${qs}`
    : API_ENDPOINTS.INTENTIONS_BY_USER(userId);
  return api.get<PaginatedResponse<Anuncio>>(url, { requireAuth: false });
}
```

- [ ] **Step 5: Criar `lib/favorites.ts`**

```ts
import { api } from "./api";
import { API_ENDPOINTS } from "@/config/env";
import type { Anuncio, PaginatedResponse } from "@/types";

/**
 * Fetch the authenticated user's favorite intentions, paginated.
 */
export async function getFavoriteIntentions(
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<Anuncio>> {
  const sp = new URLSearchParams();
  if (params.page !== undefined) sp.append("page", String(params.page));
  if (params.size !== undefined) sp.append("size", String(params.size));
  const qs = sp.toString();
  const url = qs
    ? `${API_ENDPOINTS.FAVORITES_INTENTIONS}?${qs}`
    : API_ENDPOINTS.FAVORITES_INTENTIONS;
  return api.get<PaginatedResponse<Anuncio>>(url);
}
```

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros (perfis fora de escopo ainda compilam pois `getMyIntentions`/`getIntentionsByUserId` mantêm `Anuncio[]`).

- [ ] **Step 7: Commit**

```bash
git add config/env.ts lib/intentions.ts lib/favorites.ts
git commit -m "feat: funcoes paginadas de minhas intencoes, perfil e favoritos

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Hooks de infinite query

**Files:**
- Modify: `hooks/use-intentions.ts`
- Modify: `hooks/use-saved-intentions.ts`

**Interfaces:**
- Consumes: `getMyIntentionsPage`, `getUserIntentionsPage`, `getFavoriteIntentions` (Task 5).
- Produces:
  - `useInfiniteMyIntentions(status?: StatusAnuncio)`
  - `useInfiniteUserIntentions(userId: string)`
  - `useInfiniteFavorites(enabled: boolean)`

- [ ] **Step 1: Atualizar imports em `hooks/use-intentions.ts`**

Adicionar `getMyIntentionsPage` e `getUserIntentionsPage` ao import de `@/lib/intentions`, e `StatusAnuncio` ao import de `@/types`:

```ts
import {
  getIntentions,
  getIntentionById,
  getMyIntentions,
  getMyIntentionsPage,
  getUserIntentionsPage,
  createIntention,
  updateIntention,
  markAsCompleted,
  deleteIntention,
  getAvailableFilters,
  getAvailableLocations,
} from "@/lib/intentions";
import type { CreateAnuncioRequest, UpdateAnuncioRequest, IntentionFilters, TipoVeiculo, StatusAnuncio } from "@/types";
```

- [ ] **Step 2: Adicionar os hooks paginados (após `useMyIntentions`)**

Em `hooks/use-intentions.ts`, logo após a função `useMyIntentions`:

```ts
/**
 * Hook for current user's intentions with infinite pagination + status filter.
 */
export function useInfiniteMyIntentions(status?: StatusAnuncio) {
  return useInfiniteQuery({
    queryKey: ["intentions", "mine", "infinite", status ?? "ALL"],
    queryFn: ({ pageParam = 0 }) =>
      getMyIntentionsPage({ page: pageParam, size: 12, status }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
  });
}

/**
 * Hook for another user's intentions with infinite pagination.
 */
export function useInfiniteUserIntentions(userId: string) {
  return useInfiniteQuery({
    queryKey: ["intentions", "user", userId, "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      getUserIntentionsPage(userId, { page: pageParam, size: 12 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
    enabled: !!userId,
  });
}
```

(`useInfiniteQuery` já está importado de `@tanstack/react-query` no topo do arquivo.)

- [ ] **Step 3: Adicionar `useInfiniteFavorites` em `hooks/use-saved-intentions.ts`**

No topo de `hooks/use-saved-intentions.ts`, adicionar imports:

```ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFavoriteIntentions } from "@/lib/favorites";
```

E ao final do arquivo, adicionar:

```ts
/**
 * Hook for the authenticated user's favorite intentions, paginated.
 * `enabled` deve ser true só quando o usuário está autenticado.
 */
export function useInfiniteFavorites(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["favorites", "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      getFavoriteIntentions({ page: pageParam, size: 12 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
    enabled,
  });
}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add hooks/use-intentions.ts hooks/use-saved-intentions.ts
git commit -m "feat: hooks de infinite query para minhas intencoes, perfil e favoritos

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Tela "minhas intenções" com paginação

**Files:**
- Modify: `app/(main)/my-intentions/page.tsx`

**Interfaces:**
- Consumes: `useInfiniteMyIntentions(status?)` (Task 6), `useDeleteIntention` (existente).

- [ ] **Step 1: Trocar a fonte de dados**

Em `app/(main)/my-intentions/page.tsx`, na linha de import dos hooks, trocar `useMyIntentions` por `useInfiniteMyIntentions`:

```ts
import { useInfiniteMyIntentions, useDeleteIntention } from "@/hooks/use-intentions";
```

Substituir o trecho de estado/dados:

```ts
  const router = useRouter();
  const [filter, setFilter] = useState<StatusAnuncio | "">("");
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMyIntentions(filter || undefined);
  const intentions = data?.pages.flatMap((p) => p.content) ?? [];
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);
  const { error: showError, success: showSuccess } = useToast();

  const { mutate: deleteIntention, isPending: isDeleting } = useDeleteIntention();
```

Remover a linha antiga `const { data: intentions, isLoading } = useMyIntentions();` e o bloco `const filteredIntentions = filter ? ... : intentions;` (o filtro agora é server-side).

- [ ] **Step 2: Usar `intentions` direto na lista e no empty/loaded**

No JSX, trocar todas as referências a `filteredIntentions` por `intentions`:
- `filteredIntentions?.length === 0` → `intentions.length === 0`
- `filteredIntentions?.map((intention) => {` → `intentions.map((intention) => {`

- [ ] **Step 3: Adicionar o botão "Carregar mais"**

No JSX, logo após o `</div>` que fecha o `grid` da lista de intenções (o bloco renderizado quando há intenções), e antes do `)}` que fecha o ternário, adicionar:

```tsx
          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-surface border border-border rounded-full text-foreground font-medium hover:bg-muted/10 transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
              </button>
            </div>
          )}
```

Para isso, envolver o `grid` + botão num fragmento. Ou seja, o ramo "else" do ternário (quando há intenções) passa a ser:

```tsx
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {intentions.map((intention) => {
              /* ...conteúdo do card permanece idêntico... */
            })}
          </div>
          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-3 bg-surface border border-border rounded-full text-foreground font-medium hover:bg-muted/10 transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Carregando..." : "Carregar mais"}
              </button>
            </div>
          )}
        </>
      )}
```

(O conteúdo interno de cada card — badges, info, ações editar/excluir, dialog de exclusão — não muda.)

- [ ] **Step 4: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 5: Verificação manual**

Run: `npm run dev` e abrir `/my-intentions` logado.
Expected: lista carrega 12 itens; "Carregar mais" traz a próxima página; trocar o filtro de status (Todos/Ativos/Finalizados/Expirados) recarrega a lista do servidor a partir da página 0; excluir uma intenção atualiza a lista.

- [ ] **Step 6: Commit**

```bash
git add app/\(main\)/my-intentions/page.tsx
git commit -m "feat: paginacao Carregar mais na tela minhas intencoes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: Perfil de outro usuário (`app/user/[id]`) com paginação

**Files:**
- Modify: `app/user/[id]/client.tsx`

**Interfaces:**
- Consumes: `useInfiniteUserIntentions(userId)` (Task 6), `IntentionGrid` (existente, já aceita `onLoadMore`/`hasMore`/`isLoadingMore`).

- [ ] **Step 1: Importar o hook**

Em `app/user/[id]/client.tsx`, adicionar ao import dos componentes de intenção o hook:

```ts
import { IntentionGrid } from "@/components/intentions";
import { useInfiniteUserIntentions } from "@/hooks/use-intentions";
```

- [ ] **Step 2: Buscar os dados**

Logo após `const router = useRouter();` dentro de `UserProfileClient`:

```ts
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUserIntentions(user.id);
  const intentions = data?.pages.flatMap((p) => p.content) ?? [];
```

- [ ] **Step 3: Ligar o `IntentionGrid`**

Substituir o bloco:

```tsx
          {/* TODO: Fetch user's intentions */}
          <IntentionGrid intentions={[]} isLoading={false} />
```

por:

```tsx
          <IntentionGrid
            intentions={intentions}
            isLoading={isLoading}
            onLoadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
```

- [ ] **Step 4: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 5: Verificação manual**

Run: `npm run dev` e abrir `/user/<id-de-um-usuario-com-anuncios>`.
Expected: aparecem as intenções ATIVAS do usuário (não mais vazio); "Carregar mais" traz a próxima página.

- [ ] **Step 6: Commit**

```bash
git add app/user/\[id\]/client.tsx
git commit -m "feat: lista paginada de intencoes no perfil de outro usuario

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 9: Tela de favoritos com paginação (logado + anônimo)

**Files:**
- Modify: `app/(main)/favorites/page.tsx`

**Interfaces:**
- Consumes: `useInfiniteFavorites(enabled)` (Task 6), `useSavedIntentions` (existente), `getIntentionById` (existente), `isAuthenticated` (existente).

- [ ] **Step 1: Reescrever a página**

Substituir todo o conteúdo de `app/(main)/favorites/page.tsx` por:

```tsx
"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui";
import { IntentionCard } from "@/components/intentions";
import { useSavedIntentions, useInfiniteFavorites } from "@/hooks/use-saved-intentions";
import { getIntentionById } from "@/lib/intentions";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

const PAGE_SIZE = 12;

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface overflow-hidden border border-border animate-pulse">
      <div className="h-48 bg-muted/20" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-muted/20 rounded-full w-3/4" />
          <div className="h-4 bg-muted/20 rounded-full w-1/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted/20 rounded-full w-16" />
          <div className="h-6 bg-muted/20 rounded-full w-16" />
          <div className="h-6 bg-muted/20 rounded-full w-12" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="h-4 bg-muted/20 rounded-full w-24" />
          <div className="h-4 bg-muted/20 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const authed = isAuthenticated();

  // Caminho autenticado: paginação real no servidor.
  const infinite = useInfiniteFavorites(authed);

  // Caminho anônimo: paginação no cliente sobre os IDs do localStorage.
  const { savedIds, isLoaded } = useSavedIntentions();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const anonIds = authed ? [] : savedIds.slice(0, visibleCount);
  const anonQueries = useQueries({
    queries: anonIds.map((id) => ({
      queryKey: ["intention", id],
      queryFn: () => getIntentionById(id),
      enabled: !authed && isLoaded,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = authed
    ? infinite.isLoading
    : !isLoaded || anonQueries.some((q) => q.isLoading);

  const intentions = authed
    ? infinite.data?.pages.flatMap((p) => p.content) ?? []
    : anonQueries
        .map((q) => q.data)
        .filter((d): d is NonNullable<typeof d> => !!d);

  const totalCount = authed
    ? infinite.data?.pages[0]?.totalElements ?? 0
    : savedIds.length;

  const hasMore = authed ? !!infinite.hasNextPage : visibleCount < savedIds.length;
  const isLoadingMore = authed ? infinite.isFetchingNextPage : false;
  const loadMore = authed
    ? () => infinite.fetchNextPage()
    : () => setVisibleCount((c) => c + PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Salvos</h1>
          <div className="h-4 bg-muted/20 rounded-full w-20 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Bookmark className="text-primary" size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Nenhum favorito ainda
        </h2>
        <p className="text-muted text-center max-w-sm mb-6">
          Salve intenções de compra para encontrá-las facilmente depois.
          Clique no ícone de salvar em qualquer intenção para adicioná-la aqui.
        </p>
        <Link href="/feed">
          <Button>Explorar intenções</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Salvos</h1>
        <span className="text-sm text-muted">
          {totalCount} {totalCount === 1 ? "intenção" : "intenções"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {intentions.map((intention) => (
          <IntentionCard key={intention.id} intention={intention} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-surface border border-border rounded-full text-foreground font-medium hover:bg-muted/10 transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck + lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 3: Verificação manual (logado)**

Run: `npm run dev`, logar, salvar >12 intenções e abrir `/favorites`.
Expected: mostra 12; "Carregar mais" traz a próxima página vinda do endpoint paginado; contador mostra o total.

- [ ] **Step 4: Verificação manual (anônimo)**

Deslogar, salvar >12 intenções (localStorage) e abrir `/favorites`.
Expected: mostra 12; "Carregar mais" revela mais 12 (fatiamento no cliente); empty state quando não há favoritos.

- [ ] **Step 5: Commit**

```bash
git add app/\(main\)/favorites/page.tsx
git commit -m "feat: paginacao Carregar mais na tela de favoritos

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Minhas intenções (backend + lib + hook + página): Tasks 2, 5, 6, 7. ✔
- Perfil de outro usuário (backend + lib + hook + página): Tasks 2, 5, 6, 8. ✔
- Favoritos (findByIds, findPageByUsuarioId, use case, rota, lib, hook, página + fallback anônimo): Tasks 1, 3, 4, 5, 6, 9. ✔
- Consumidores fora de escopo preservados (funções array-based mantidas): Task 5. ✔
- Tamanho de página 12 e formato `PaginatedResponse`: Tasks 2, 4, 5, 6 (Global Constraints). ✔

**Placeholder scan:** Nenhum "TBD/TODO/implementar depois" introduzido. (O comentário `TODO: Fetch user's intentions` é removido na Task 8.)

**Type consistency:**
- `findByIds(ids: string[]): Promise<Anuncio[]>` — definido na Task 1, consumido na Task 4. ✔
- `findPageByUsuarioId(usuarioId, page, size): Promise<{ ids; total }>` — Task 3, consumido na Task 4. ✔
- `ListarAnunciosFavoritosUseCaseImpl.execute(usuarioId, page, size)` retorna `PaginatedAnuncios` (mesmo shape de `PaginatedResponse`). ✔
- `getMyIntentionsPage`/`getUserIntentionsPage`/`getFavoriteIntentions` retornam `PaginatedResponse<Anuncio>`, consumidos pelos hooks da Task 6 e páginas 7/8/9. ✔
- `useInfiniteFavorites(enabled: boolean)` — Task 6, chamado na Task 9 com `authed`. ✔
