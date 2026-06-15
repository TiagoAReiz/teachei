# Design: Migração do Backend para Next.js + Supabase

**Data:** 2026-06-15  
**Status:** Aprovado  
**Branch:** refactor/modularize-by-entity

---

## Contexto

O projeto TeAchei possui um backend Java Spring Boot com arquitetura hexagonal modularizada por entidade. O objetivo é migrar toda a lógica de backend para dentro do projeto Next.js (`teachei-web`), substituindo o Java e usando o Supabase como banco de dados relacional. O Vercel será responsável pelo deploy e integração com Supabase.

**Módulos mantidos:** auth, anuncio, perfil, favorito (novo), veiculo (proxy FIPE)  
**Módulos descartados:** assinatura, pagamento  
**Auth:** JWT customizado no Next.js — Supabase Auth não é utilizado

---

## Arquitetura

### Estrutura de pastas

```
teachei-web/
  ap/                                  ← todo o backend Next.js
    shared/
      db/supabase.ts                   ← cliente Supabase singleton
      middleware/jwt.ts                ← sign/verify JWT com jose
      errors/                          ← AppError, NotFoundError, ForbiddenError
    auth/
      domain/
        model/Usuario.ts
        model/AuthResult.ts
        exception/CredenciaisInvalidasException.ts
      application/
        ports/in/LoginUseCase.ts
        ports/in/RegisterUseCase.ts
        ports/in/GoogleAuthUseCase.ts
        ports/in/AlterarSenhaUseCase.ts
        ports/in/ExcluirContaUseCase.ts
        ports/out/UsuarioRepositoryPort.ts
        usecase/LoginUseCaseImpl.ts
        usecase/RegisterUseCaseImpl.ts
        usecase/GoogleAuthUseCaseImpl.ts
        usecase/AlterarSenhaUseCaseImpl.ts
        usecase/ExcluirContaUseCaseImpl.ts
      infrastructure/
        persistence/UsuarioSupabaseAdapter.ts
      web/handler.ts
    anuncio/
      domain/
        model/Anuncio.ts
        model/VeiculoInfo.ts
        model/ContatoInfo.ts
        model/StatusAnuncio.ts
        service/AnuncioService.ts
        exception/AnuncioNaoEncontradoException.ts
        exception/AnuncioInvalidoException.ts
      application/
        ports/in/CriarAnuncioUseCase.ts
        ports/in/BuscarAnunciosUseCase.ts
        ports/in/BuscarAnuncioUseCase.ts
        ports/in/AtualizarAnuncioUseCase.ts
        ports/in/ExcluirAnuncioUseCase.ts
        ports/in/FinalizarAnuncioUseCase.ts
        ports/in/BuscarFiltrosUseCase.ts
        ports/out/AnuncioRepositoryPort.ts
        usecase/CriarAnuncioUseCaseImpl.ts
        usecase/BuscarAnunciosUseCaseImpl.ts
        usecase/BuscarAnuncioUseCaseImpl.ts
        usecase/AtualizarAnuncioUseCaseImpl.ts
        usecase/ExcluirAnuncioUseCaseImpl.ts
        usecase/FinalizarAnuncioUseCaseImpl.ts
        usecase/BuscarFiltrosUseCaseImpl.ts
      infrastructure/
        persistence/AnuncioSupabaseAdapter.ts
      web/handler.ts
    perfil/
      domain/
        model/Perfil.ts
        exception/PerfilNaoEncontradoException.ts
      application/
        ports/in/GerenciarPerfilUseCase.ts
        ports/out/PerfilRepositoryPort.ts
        usecase/GerenciarPerfilUseCaseImpl.ts
      infrastructure/
        persistence/PerfilSupabaseAdapter.ts
      web/handler.ts
    favorito/
      domain/
        model/Favorito.ts
      application/
        ports/in/GerenciarFavoritosUseCase.ts
        ports/out/FavoritoRepositoryPort.ts
        usecase/GerenciarFavoritosUseCaseImpl.ts
      infrastructure/
        persistence/FavoritoSupabaseAdapter.ts
      web/handler.ts
    veiculo/
      web/handler.ts                   ← proxy FIPE, sem domain/persistence
  app/
    api/v1/
      auth/[...route]/route.ts
      anuncios/[...route]/route.ts
      perfil/[...route]/route.ts
      favoritos/[...route]/route.ts
      veiculos/[...route]/route.ts
  middleware.ts                        ← verifica JWT, injeta X-Usuario-Id
```

### Princípios

- Os `route.ts` são adaptadores finos: recebem `Request`, delegam ao `handler.ts` do módulo, retornam `Response`
- Toda lógica de negócio vive nos `usecase/`
- Os adapters Supabase implementam as interfaces `ports/out/`
- Os use cases recebem as dependências por injeção de construtor (sem IoC container — instanciação manual no `handler.ts`)
- Paths de API mantidos idênticos ao Java (`/api/v1/...`) — zero mudança no frontend

---

## Banco de Dados (Supabase)

```sql
-- Auth
create table usuarios (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  senha_hash  text,
  google_id   text unique,
  aceitou_termos boolean not null default false,
  criado_em   timestamptz default now()
);

-- Perfil
create table perfis (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  nome        text not null,
  bio         text,
  foto_url    text,
  whatsapp    text,
  instagram   text,
  facebook    text,
  cidade      text,
  estado      text,
  role        text not null default 'BUYER',
  criado_em   timestamptz default now()
);

-- Anuncios
create table anuncios (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  tipo        text not null,
  status      text not null default 'ATIVO',
  veiculo     jsonb not null,
  contato     jsonb not null,
  observacoes text,
  criado_em   timestamptz default now(),
  expira_em   timestamptz
);

-- Favoritos
create table favoritos (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  anuncio_id  uuid not null references anuncios(id) on delete cascade,
  criado_em   timestamptz default now(),
  unique(usuario_id, anuncio_id)
);
```

**Decisões:**
- `veiculo` e `contato` em `anuncios` são `jsonb` — evita joins e reflete o modelo NoSQL do CosmosDB
- `unique(usuario_id, anuncio_id)` em favoritos previne duplicatas
- Cascade delete: remover usuário limpa perfil, anúncios e favoritos

---

## Módulos em Detalhe

### Auth

**Fluxo login:**
1. Recebe email/senha → busca usuário no Supabase → verifica bcrypt → gera JWT com `jose`
2. JWT armazenado no cookie `teachei_token` (mesmo comportamento atual)

**Fluxo Google:**
1. Recebe Google ID token → verifica via Google API → upsert em `usuarios` → gera JWT

**Middleware Next.js:**
- Lê `teachei_token`, verifica assinatura JWT
- Injeta `X-Usuario-Id` no header para Route Handlers protegidos
- Rotas protegidas: `/api/v1/perfil`, `/api/v1/favoritos`, `/api/v1/anuncios/meus`, `/api/v1/anuncios` (POST/PUT/DELETE)

**Endpoints:**
```
POST /api/v1/auth/login
POST /api/v1/auth/registrar
POST /api/v1/auth/google
PUT  /api/v1/auth/senha
```
> Exclusão de conta (`DELETE /api/v1/perfil`) é roteada pelo handler de `perfil` mas chama `ExcluirContaUseCase` do módulo `auth`.

---

### Anuncio

**Domain service** (`AnuncioService.ts`):
- `validarAnuncio(data)` — regras de criação (tipo obrigatório, preço > 0, etc.)
- `calcularExpiracao()` — 30 dias a partir de hoje
- `podeFinalizar(anuncio, usuarioId)` — verifica propriedade

**Filtros dinâmicos** via Supabase query builder: tipo, marca, modelo, cidade, estado, ano, preço, km, opcionais, paginação, ordenação.

**Endpoints:**
```
GET    /api/v1/anuncios                  ← público, filtros via query params
POST   /api/v1/anuncios                  ← autenticado
GET    /api/v1/anuncios/meus             ← autenticado
GET    /api/v1/anuncios/filtros          ← público
GET    /api/v1/anuncios/:id              ← público
PUT    /api/v1/anuncios/:id              ← autenticado (dono)
POST   /api/v1/anuncios/:id/finalizar    ← autenticado (dono)
DELETE /api/v1/anuncios/:id             ← autenticado (dono)
GET    /api/v1/anuncios/usuario/:id      ← público
```

---

### Perfil

CRUD simples na tabela `perfis`. Upload de foto via Vercel Blob (base64 no request → URL salva no Supabase).

**Endpoints:**
```
GET    /api/v1/perfil        ← autenticado
PUT    /api/v1/perfil        ← autenticado
DELETE /api/v1/perfil        ← autenticado (chama ExcluirContaUseCase do módulo auth)
GET    /api/v1/perfil/:id    ← público
```

---

### Favorito

**Novo módulo** — substitui o `localStorage` atual.

**Interface use case:**
```ts
listar(usuarioId)                    → Promise<string[]>    // anuncioIds
adicionar(usuarioId, anuncioId)      → Promise<void>
remover(usuarioId, anuncioId)        → Promise<void>
verificar(usuarioId, anuncioId)      → Promise<boolean>
```

**Endpoints:**
```
GET    /api/v1/favoritos              ← autenticado, retorna anuncioIds
POST   /api/v1/favoritos              ← { anuncioId }
DELETE /api/v1/favoritos/:anuncioId   ← autenticado
GET    /api/v1/favoritos/:anuncioId/verificar ← autenticado
```

**Frontend:** hook `use-saved-intentions.ts` migra de `localStorage` para chamar esses endpoints. Mantém fallback de localStorage para usuários não autenticados.

---

### Veiculo

Proxy simples para a API FIPE externa. Sem camadas de domain ou persistence.

```
GET /api/v1/veiculos/:tipo/marcas
GET /api/v1/veiculos/:tipo/marcas/:marcaCodigo/modelos
GET /api/v1/veiculos/:tipo/marcas/:marcaCodigo/modelos/:modeloCodigo/anos
GET /api/v1/veiculos/:tipo/marcas/:marcaCodigo/modelos/:modeloCodigo/anos/:anoCodigo/preco
```

---

## Shared

```ts
// ap/shared/db/supabase.ts
// Cliente singleton com SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (server-side apenas)

// ap/shared/middleware/jwt.ts
// signToken(payload) → string
// verifyToken(token) → payload
// Usa jose, segredo em JWT_SECRET env var

// ap/shared/errors/
// AppError(message, status)
// NotFoundError extends AppError (404)
// ForbiddenError extends AppError (403)
// ValidationError extends AppError (400)
```

---

## Variáveis de Ambiente

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=   ← server-side (sem NEXT_PUBLIC_)
JWT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
BLOB_READ_WRITE_TOKEN=       ← Vercel Blob (já existente)
```

---

## O que NÃO muda no frontend

- Todos os paths de API (`/api/v1/...`) permanecem idênticos
- Tipos em `types/index.ts` permanecem os mesmos
- `lib/api.ts`, `lib/auth.ts`, `lib/intentions.ts`, etc. não precisam ser alterados
- Apenas `hooks/use-saved-intentions.ts` muda (localStorage → API)

---

## Fora de Escopo

- Supabase Auth — não utilizado
- Módulos `assinatura` e `pagamento` — descartados
- App mobile — não impactado (mesma API REST)
- Migração de dados do CosmosDB/Postgres existente — fora do escopo desta spec
