# Next.js Backend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar toda a lógica do backend Java Spring Boot para dentro de `teachei-web/ap/` usando arquitetura hexagonal, com Supabase como banco de dados, mantendo os mesmos paths de API `/api/v1/...` para que o frontend não precise mudar.

**Architecture:** Pasta `ap/` dentro de `teachei-web/` contém módulos `auth`, `anuncio`, `perfil`, `favorito`, `veiculo` — cada um com camadas `domain/`, `application/ports+usecase/`, `infrastructure/persistence/`, `web/handler.ts`. Route Handlers em `app/api/v1/` são finos e apenas chamam os handlers. Middleware Next.js verifica JWT e injeta `X-Usuario-Id`.

**Tech Stack:** Next.js 16, Supabase (`@supabase/supabase-js`), JWT (`jose`), bcrypt (`bcryptjs`), Vitest (testes unitários)

**Spec:** `docs/superpowers/specs/2026-06-15-nextjs-backend-migration-design.md`

---

## Mapa de Arquivos

### Novos — `ap/`
```
ap/shared/db/supabase.ts
ap/shared/middleware/jwt.ts
ap/shared/errors/index.ts

ap/auth/domain/model/Usuario.ts
ap/auth/domain/model/AuthResult.ts
ap/auth/domain/exception/CredenciaisInvalidasException.ts
ap/auth/application/ports/in/LoginUseCase.ts
ap/auth/application/ports/in/RegisterUseCase.ts
ap/auth/application/ports/in/GoogleAuthUseCase.ts
ap/auth/application/ports/in/AlterarSenhaUseCase.ts
ap/auth/application/ports/in/ExcluirContaUseCase.ts
ap/auth/application/ports/out/UsuarioRepositoryPort.ts
ap/auth/application/usecase/LoginUseCaseImpl.ts
ap/auth/application/usecase/RegisterUseCaseImpl.ts
ap/auth/application/usecase/GoogleAuthUseCaseImpl.ts
ap/auth/application/usecase/AlterarSenhaUseCaseImpl.ts
ap/auth/application/usecase/ExcluirContaUseCaseImpl.ts
ap/auth/infrastructure/persistence/UsuarioSupabaseAdapter.ts
ap/auth/web/handler.ts

ap/anuncio/domain/model/Anuncio.ts
ap/anuncio/domain/model/StatusAnuncio.ts
ap/anuncio/domain/service/AnuncioService.ts
ap/anuncio/domain/exception/AnuncioNaoEncontradoException.ts
ap/anuncio/domain/exception/AnuncioInvalidoException.ts
ap/anuncio/application/ports/in/CriarAnuncioUseCase.ts
ap/anuncio/application/ports/in/BuscarAnunciosUseCase.ts
ap/anuncio/application/ports/in/BuscarAnuncioUseCase.ts
ap/anuncio/application/ports/in/AtualizarAnuncioUseCase.ts
ap/anuncio/application/ports/in/ExcluirAnuncioUseCase.ts
ap/anuncio/application/ports/in/FinalizarAnuncioUseCase.ts
ap/anuncio/application/ports/in/BuscarFiltrosUseCase.ts
ap/anuncio/application/ports/out/AnuncioRepositoryPort.ts
ap/anuncio/application/usecase/CriarAnuncioUseCaseImpl.ts
ap/anuncio/application/usecase/BuscarAnunciosUseCaseImpl.ts
ap/anuncio/application/usecase/BuscarAnuncioUseCaseImpl.ts
ap/anuncio/application/usecase/AtualizarAnuncioUseCaseImpl.ts
ap/anuncio/application/usecase/ExcluirAnuncioUseCaseImpl.ts
ap/anuncio/application/usecase/FinalizarAnuncioUseCaseImpl.ts
ap/anuncio/application/usecase/BuscarFiltrosUseCaseImpl.ts
ap/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts
ap/anuncio/web/handler.ts

ap/perfil/domain/model/Perfil.ts
ap/perfil/domain/exception/PerfilNaoEncontradoException.ts
ap/perfil/application/ports/in/GerenciarPerfilUseCase.ts
ap/perfil/application/ports/out/PerfilRepositoryPort.ts
ap/perfil/application/usecase/GerenciarPerfilUseCaseImpl.ts
ap/perfil/infrastructure/persistence/PerfilSupabaseAdapter.ts
ap/perfil/web/handler.ts

ap/favorito/domain/model/Favorito.ts
ap/favorito/application/ports/in/GerenciarFavoritosUseCase.ts
ap/favorito/application/ports/out/FavoritoRepositoryPort.ts
ap/favorito/application/usecase/GerenciarFavoritosUseCaseImpl.ts
ap/favorito/infrastructure/persistence/FavoritoSupabaseAdapter.ts
ap/favorito/web/handler.ts

ap/veiculo/web/handler.ts
```

### Novos — `app/api/v1/`
```
app/api/v1/auth/login/route.ts
app/api/v1/auth/registrar/route.ts
app/api/v1/auth/google/route.ts
app/api/v1/auth/senha/route.ts
app/api/v1/anuncios/route.ts
app/api/v1/anuncios/meus/route.ts
app/api/v1/anuncios/filtros/route.ts
app/api/v1/anuncios/[id]/route.ts
app/api/v1/anuncios/[id]/finalizar/route.ts
app/api/v1/anuncios/usuario/[userId]/route.ts
app/api/v1/perfil/route.ts
app/api/v1/perfil/[id]/route.ts
app/api/v1/favoritos/route.ts
app/api/v1/favoritos/[anuncioId]/route.ts
app/api/v1/favoritos/[anuncioId]/verificar/route.ts
app/api/v1/veiculos/[tipo]/marcas/route.ts
app/api/v1/veiculos/[tipo]/marcas/[marcaCodigo]/modelos/route.ts
app/api/v1/veiculos/[tipo]/marcas/[marcaCodigo]/modelos/[modeloCodigo]/anos/route.ts
app/api/v1/veiculos/[tipo]/marcas/[marcaCodigo]/modelos/[modeloCodigo]/anos/[anoCodigo]/preco/route.ts
```

### Novos — outros
```
middleware.ts                          (raiz de teachei-web)
supabase/migrations/001_schema.sql
vitest.config.ts
ap/__tests__/shared/jwt.test.ts
ap/__tests__/auth/LoginUseCaseImpl.test.ts
ap/__tests__/anuncio/AnuncioService.test.ts
ap/__tests__/favorito/GerenciarFavoritosUseCaseImpl.test.ts
```

### Modificados
```
package.json                           (adicionar deps)
hooks/use-saved-intentions.ts          (migrar de localStorage para API)
```

---

## Task 1: Instalar dependências e configurar Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Instalar pacotes de produção**

```bash
cd teachei-web
npm install @supabase/supabase-js jose bcryptjs
npm install --save-dev @types/bcryptjs vitest @vitejs/plugin-react @vitest/coverage-v8
```

- [ ] **Adicionar script de test no package.json**

Abrir `package.json` e adicionar em `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Criar vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Verificar que vitest funciona**

```bash
npx vitest run
```
Esperado: `No test files found`

- [ ] **Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add supabase, jose, bcryptjs, vitest"
```

---

## Task 2: Schema Supabase

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Criar arquivo de migration**

```sql
-- supabase/migrations/001_schema.sql

create table if not exists usuarios (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  senha_hash  text,
  google_id   text unique,
  aceitou_termos boolean not null default false,
  criado_em   timestamptz default now()
);

create table if not exists perfis (
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

create table if not exists anuncios (
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

create table if not exists favoritos (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  anuncio_id  uuid not null references anuncios(id) on delete cascade,
  criado_em   timestamptz default now(),
  unique(usuario_id, anuncio_id)
);
```

- [ ] **Rodar a migration no Supabase**

No painel do Supabase → SQL Editor → colar e executar o conteúdo do arquivo acima.

- [ ] **Commit**

```bash
git add supabase/
git commit -m "feat: schema inicial Supabase (usuarios, perfis, anuncios, favoritos)"
```

---

## Task 3: Shared — Supabase client, JWT, erros

**Files:**
- Create: `ap/shared/db/supabase.ts`
- Create: `ap/shared/middleware/jwt.ts`
- Create: `ap/shared/errors/index.ts`
- Create: `ap/__tests__/shared/jwt.test.ts`

- [ ] **Escrever teste de JWT**

```ts
// ap/__tests__/shared/jwt.test.ts
import { describe, it, expect } from "vitest";

// Mock env antes de importar o módulo
process.env.JWT_SECRET = "test-secret-that-is-32-chars-long!!";

const { signToken, verifyToken } = await import("@/ap/shared/middleware/jwt");

describe("jwt", () => {
  it("sign e verify retornam o mesmo payload", async () => {
    const token = await signToken({ sub: "user-123", email: "a@b.com" });
    const payload = await verifyToken(token);
    expect(payload.sub).toBe("user-123");
    expect(payload.email).toBe("a@b.com");
  });

  it("token inválido lança erro", async () => {
    await expect(verifyToken("token-invalido")).rejects.toThrow();
  });
});
```

- [ ] **Rodar teste para confirmar falha**

```bash
cd teachei-web && npx vitest run ap/__tests__/shared/jwt.test.ts
```
Esperado: FAIL — `Cannot find module '@/ap/shared/middleware/jwt'`

- [ ] **Criar ap/shared/errors/index.ts**

```ts
export class AppError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401);
  }
}
```

- [ ] **Criar ap/shared/middleware/jwt.ts**

```ts
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? (() => { throw new Error("JWT_SECRET não definido"); })()
);

const EXPIRES_IN = 60 * 60; // 1 hora em segundos

export interface JwtPayload {
  sub: string;
  email: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret);
  return { sub: payload.sub as string, email: payload["email"] as string };
}

export const TOKEN_EXPIRES_IN = EXPIRES_IN;
```

- [ ] **Criar ap/shared/db/supabase.ts**

```ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? (() => { throw new Error("SUPABASE_URL não definido"); })();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? (() => { throw new Error("SUPABASE_SERVICE_ROLE_KEY não definido"); })();

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
```

- [ ] **Rodar teste — deve passar**

```bash
npx vitest run ap/__tests__/shared/jwt.test.ts
```
Esperado: PASS (2 testes)

- [ ] **Commit**

```bash
git add ap/shared/ ap/__tests__/shared/
git commit -m "feat(shared): supabase client, JWT sign/verify, error classes"
```

---

## Task 4: Auth — domain e ports

**Files:**
- Create: `ap/auth/domain/model/Usuario.ts`
- Create: `ap/auth/domain/model/AuthResult.ts`
- Create: `ap/auth/domain/exception/CredenciaisInvalidasException.ts`
- Create: `ap/auth/application/ports/in/LoginUseCase.ts`
- Create: `ap/auth/application/ports/in/RegisterUseCase.ts`
- Create: `ap/auth/application/ports/in/GoogleAuthUseCase.ts`
- Create: `ap/auth/application/ports/in/AlterarSenhaUseCase.ts`
- Create: `ap/auth/application/ports/in/ExcluirContaUseCase.ts`
- Create: `ap/auth/application/ports/out/UsuarioRepositoryPort.ts`

- [ ] **Criar modelos de domínio**

```ts
// ap/auth/domain/model/Usuario.ts
export interface Usuario {
  id: string;
  email: string;
  senhaHash: string | null;
  googleId: string | null;
  aceitouTermos: boolean;
  criadoEm: string;
}

// ap/auth/domain/model/AuthResult.ts
export interface AuthResult {
  token: string;
  usuarioId: string;
  email: string;
  expiresIn: number;
  tokenType: "Bearer";
}
```

- [ ] **Criar exceção de domínio**

```ts
// ap/auth/domain/exception/CredenciaisInvalidasException.ts
import { UnauthorizedError } from "@/ap/shared/errors";

export class CredenciaisInvalidasException extends UnauthorizedError {
  constructor() {
    super("Email ou senha inválidos");
  }
}
```

- [ ] **Criar ports out**

```ts
// ap/auth/application/ports/out/UsuarioRepositoryPort.ts
import type { Usuario } from "@/ap/auth/domain/model/Usuario";

export interface UsuarioRepositoryPort {
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
  findByGoogleId(googleId: string): Promise<Usuario | null>;
  save(data: {
    email: string;
    senhaHash?: string;
    googleId?: string;
    aceitouTermos: boolean;
  }): Promise<Usuario>;
  updateSenha(id: string, novaSenhaHash: string): Promise<void>;
  delete(id: string): Promise<void>;
}
```

- [ ] **Criar ports in**

```ts
// ap/auth/application/ports/in/LoginUseCase.ts
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";
export interface LoginUseCase {
  execute(email: string, senha: string): Promise<AuthResult>;
}

// ap/auth/application/ports/in/RegisterUseCase.ts
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";
export interface RegisterUseCase {
  execute(data: {
    email: string;
    senha: string;
    nome?: string;
    aceitouTermos: boolean;
  }): Promise<AuthResult>;
}

// ap/auth/application/ports/in/GoogleAuthUseCase.ts
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";
export interface GoogleAuthUseCase {
  execute(credential: string, aceitouTermos?: boolean): Promise<AuthResult>;
}

// ap/auth/application/ports/in/AlterarSenhaUseCase.ts
export interface AlterarSenhaUseCase {
  execute(usuarioId: string, senhaAtual: string, novaSenha: string): Promise<void>;
}

// ap/auth/application/ports/in/ExcluirContaUseCase.ts
export interface ExcluirContaUseCase {
  execute(usuarioId: string): Promise<void>;
}
```

- [ ] **Commit**

```bash
git add ap/auth/
git commit -m "feat(auth): domain models, exceptions e ports"
```

---

## Task 5: Auth — use cases

**Files:**
- Create: `ap/auth/application/usecase/LoginUseCaseImpl.ts`
- Create: `ap/auth/application/usecase/RegisterUseCaseImpl.ts`
- Create: `ap/auth/application/usecase/GoogleAuthUseCaseImpl.ts`
- Create: `ap/auth/application/usecase/AlterarSenhaUseCaseImpl.ts`
- Create: `ap/auth/application/usecase/ExcluirContaUseCaseImpl.ts`
- Create: `ap/__tests__/auth/LoginUseCaseImpl.test.ts`

- [ ] **Escrever teste de LoginUseCase**

```ts
// ap/__tests__/auth/LoginUseCaseImpl.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginUseCaseImpl } from "@/ap/auth/application/usecase/LoginUseCaseImpl";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";

process.env.JWT_SECRET = "test-secret-that-is-32-chars-long!!";

const mockRepo: UsuarioRepositoryPort = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  findByGoogleId: vi.fn(),
  save: vi.fn(),
  updateSenha: vi.fn(),
  delete: vi.fn(),
};

describe("LoginUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("lança CredenciaisInvalidasException se usuário não existe", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue(null);
    const useCase = new LoginUseCaseImpl(mockRepo);
    await expect(useCase.execute("x@x.com", "senha")).rejects.toThrow("Email ou senha inválidos");
  });

  it("lança CredenciaisInvalidasException se senha errada", async () => {
    vi.mocked(mockRepo.findByEmail).mockResolvedValue({
      id: "1", email: "a@b.com", senhaHash: "hash-errado",
      googleId: null, aceitouTermos: true, criadoEm: new Date().toISOString(),
    });
    const useCase = new LoginUseCaseImpl(mockRepo);
    await expect(useCase.execute("a@b.com", "senha-errada")).rejects.toThrow("Email ou senha inválidos");
  });
});
```

- [ ] **Rodar para confirmar falha**

```bash
npx vitest run ap/__tests__/auth/LoginUseCaseImpl.test.ts
```
Esperado: FAIL

- [ ] **Criar LoginUseCaseImpl.ts**

```ts
// ap/auth/application/usecase/LoginUseCaseImpl.ts
import bcrypt from "bcryptjs";
import { signToken, TOKEN_EXPIRES_IN } from "@/ap/shared/middleware/jwt";
import { CredenciaisInvalidasException } from "@/ap/auth/domain/exception/CredenciaisInvalidasException";
import type { LoginUseCase } from "@/ap/auth/application/ports/in/LoginUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";

export class LoginUseCaseImpl implements LoginUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(email: string, senha: string): Promise<AuthResult> {
    const usuario = await this.repo.findByEmail(email);
    if (!usuario || !usuario.senhaHash) throw new CredenciaisInvalidasException();

    const valid = await bcrypt.compare(senha, usuario.senhaHash);
    if (!valid) throw new CredenciaisInvalidasException();

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
```

- [ ] **Criar RegisterUseCaseImpl.ts**

```ts
// ap/auth/application/usecase/RegisterUseCaseImpl.ts
import bcrypt from "bcryptjs";
import { signToken, TOKEN_EXPIRES_IN } from "@/ap/shared/middleware/jwt";
import { ValidationError } from "@/ap/shared/errors";
import type { RegisterUseCase } from "@/ap/auth/application/ports/in/RegisterUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";

export class RegisterUseCaseImpl implements RegisterUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(data: { email: string; senha: string; nome?: string; aceitouTermos: boolean }): Promise<AuthResult> {
    if (!data.aceitouTermos) throw new ValidationError("Termos de uso devem ser aceitos");

    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new ValidationError("Email já cadastrado");

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const usuario = await this.repo.save({ email: data.email, senhaHash, aceitouTermos: true });

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
```

- [ ] **Criar GoogleAuthUseCaseImpl.ts**

```ts
// ap/auth/application/usecase/GoogleAuthUseCaseImpl.ts
import { signToken, TOKEN_EXPIRES_IN } from "@/ap/shared/middleware/jwt";
import { ValidationError } from "@/ap/shared/errors";
import type { GoogleAuthUseCase } from "@/ap/auth/application/ports/in/GoogleAuthUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";

interface GoogleTokenPayload {
  sub: string;
  email: string;
  name?: string;
}

async function verifyGoogleToken(credential: string): Promise<GoogleTokenPayload> {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
  );
  if (!res.ok) throw new ValidationError("Google token inválido");
  const data = await res.json();
  if (data.aud !== process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) throw new ValidationError("Google client_id inválido");
  return { sub: data.sub, email: data.email, name: data.name };
}

export class GoogleAuthUseCaseImpl implements GoogleAuthUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(credential: string, aceitouTermos?: boolean): Promise<AuthResult> {
    const googlePayload = await verifyGoogleToken(credential);

    let usuario = await this.repo.findByGoogleId(googlePayload.sub);

    if (!usuario) {
      const byEmail = await this.repo.findByEmail(googlePayload.email);
      if (byEmail) {
        usuario = byEmail;
      } else {
        if (!aceitouTermos) throw new ValidationError("Termos de uso devem ser aceitos");
        usuario = await this.repo.save({
          email: googlePayload.email,
          googleId: googlePayload.sub,
          aceitouTermos: true,
        });
      }
    }

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
```

- [ ] **Criar AlterarSenhaUseCaseImpl.ts**

```ts
// ap/auth/application/usecase/AlterarSenhaUseCaseImpl.ts
import bcrypt from "bcryptjs";
import { CredenciaisInvalidasException } from "@/ap/auth/domain/exception/CredenciaisInvalidasException";
import { NotFoundError } from "@/ap/shared/errors";
import type { AlterarSenhaUseCase } from "@/ap/auth/application/ports/in/AlterarSenhaUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";

export class AlterarSenhaUseCaseImpl implements AlterarSenhaUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(usuarioId: string, senhaAtual: string, novaSenha: string): Promise<void> {
    const usuario = await this.repo.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuário não encontrado");
    if (!usuario.senhaHash) throw new CredenciaisInvalidasException();

    const valid = await bcrypt.compare(senhaAtual, usuario.senhaHash);
    if (!valid) throw new CredenciaisInvalidasException();

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    await this.repo.updateSenha(usuarioId, novaSenhaHash);
  }
}
```

- [ ] **Criar ExcluirContaUseCaseImpl.ts**

```ts
// ap/auth/application/usecase/ExcluirContaUseCaseImpl.ts
import { NotFoundError } from "@/ap/shared/errors";
import type { ExcluirContaUseCase } from "@/ap/auth/application/ports/in/ExcluirContaUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";

export class ExcluirContaUseCaseImpl implements ExcluirContaUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(usuarioId: string): Promise<void> {
    const usuario = await this.repo.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuário não encontrado");
    await this.repo.delete(usuarioId);
  }
}
```

- [ ] **Rodar testes de auth**

```bash
npx vitest run ap/__tests__/auth/
```
Esperado: PASS (2 testes)

- [ ] **Commit**

```bash
git add ap/auth/application/ ap/__tests__/auth/
git commit -m "feat(auth): use cases (login, register, google, alterar-senha, excluir)"
```

---

## Task 6: Auth — Supabase adapter e web handler

**Files:**
- Create: `ap/auth/infrastructure/persistence/UsuarioSupabaseAdapter.ts`
- Create: `ap/auth/web/handler.ts`
- Create: `app/api/v1/auth/login/route.ts`
- Create: `app/api/v1/auth/registrar/route.ts`
- Create: `app/api/v1/auth/google/route.ts`
- Create: `app/api/v1/auth/senha/route.ts`

- [ ] **Criar UsuarioSupabaseAdapter.ts**

```ts
// ap/auth/infrastructure/persistence/UsuarioSupabaseAdapter.ts
import { supabase } from "@/ap/shared/db/supabase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";
import type { Usuario } from "@/ap/auth/domain/model/Usuario";

function toUsuario(row: Record<string, unknown>): Usuario {
  return {
    id: row.id as string,
    email: row.email as string,
    senhaHash: (row.senha_hash as string) ?? null,
    googleId: (row.google_id as string) ?? null,
    aceitouTermos: row.aceitou_termos as boolean,
    criadoEm: row.criado_em as string,
  };
}

export class UsuarioSupabaseAdapter implements UsuarioRepositoryPort {
  async findByEmail(email: string): Promise<Usuario | null> {
    const { data } = await supabase.from("usuarios").select("*").eq("email", email).single();
    return data ? toUsuario(data) : null;
  }

  async findById(id: string): Promise<Usuario | null> {
    const { data } = await supabase.from("usuarios").select("*").eq("id", id).single();
    return data ? toUsuario(data) : null;
  }

  async findByGoogleId(googleId: string): Promise<Usuario | null> {
    const { data } = await supabase.from("usuarios").select("*").eq("google_id", googleId).single();
    return data ? toUsuario(data) : null;
  }

  async save(input: { email: string; senhaHash?: string; googleId?: string; aceitouTermos: boolean }): Promise<Usuario> {
    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        email: input.email,
        senha_hash: input.senhaHash ?? null,
        google_id: input.googleId ?? null,
        aceitou_termos: input.aceitouTermos,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toUsuario(data);
  }

  async updateSenha(id: string, novaSenhaHash: string): Promise<void> {
    await supabase.from("usuarios").update({ senha_hash: novaSenhaHash }).eq("id", id);
  }

  async delete(id: string): Promise<void> {
    await supabase.from("usuarios").delete().eq("id", id);
  }
}
```

- [ ] **Criar ap/auth/web/handler.ts**

O handler instancia os use cases com o adapter Supabase (injeção manual) e exporta funções para cada endpoint.

```ts
// ap/auth/web/handler.ts
import { UsuarioSupabaseAdapter } from "@/ap/auth/infrastructure/persistence/UsuarioSupabaseAdapter";
import { LoginUseCaseImpl } from "@/ap/auth/application/usecase/LoginUseCaseImpl";
import { RegisterUseCaseImpl } from "@/ap/auth/application/usecase/RegisterUseCaseImpl";
import { GoogleAuthUseCaseImpl } from "@/ap/auth/application/usecase/GoogleAuthUseCaseImpl";
import { AlterarSenhaUseCaseImpl } from "@/ap/auth/application/usecase/AlterarSenhaUseCaseImpl";
import { ExcluirContaUseCaseImpl } from "@/ap/auth/application/usecase/ExcluirContaUseCaseImpl";
import { AppError } from "@/ap/shared/errors";

function makeRepo() { return new UsuarioSupabaseAdapter(); }

function errorResponse(err: unknown): Response {
  if (err instanceof AppError) {
    return Response.json({ message: err.message }, { status: err.status });
  }
  console.error(err);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleLogin(req: Request): Promise<Response> {
  try {
    const { email, senha } = await req.json();
    const result = await new LoginUseCaseImpl(makeRepo()).execute(email, senha);
    return Response.json(result);
  } catch (err) { return errorResponse(err); }
}

export async function handleRegister(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = await new RegisterUseCaseImpl(makeRepo()).execute(body);
    return Response.json(result);
  } catch (err) { return errorResponse(err); }
}

export async function handleGoogle(req: Request): Promise<Response> {
  try {
    const { credential, aceitouTermos } = await req.json();
    const result = await new GoogleAuthUseCaseImpl(makeRepo()).execute(credential, aceitouTermos);
    return Response.json(result);
  } catch (err) { return errorResponse(err); }
}

export async function handleAlterarSenha(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const { senhaAtual, novaSenha } = await req.json();
    await new AlterarSenhaUseCaseImpl(makeRepo()).execute(usuarioId, senhaAtual, novaSenha);
    return new Response(null, { status: 204 });
  } catch (err) { return errorResponse(err); }
}

export async function handleExcluirConta(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await new ExcluirContaUseCaseImpl(makeRepo()).execute(usuarioId);
    return new Response(null, { status: 204 });
  } catch (err) { return errorResponse(err); }
}
```

- [ ] **Criar Route Handlers de auth**

```ts
// app/api/v1/auth/login/route.ts
import { handleLogin } from "@/ap/auth/web/handler";
export const POST = handleLogin;

// app/api/v1/auth/registrar/route.ts
import { handleRegister } from "@/ap/auth/web/handler";
export const POST = handleRegister;

// app/api/v1/auth/google/route.ts
import { handleGoogle } from "@/ap/auth/web/handler";
export const POST = handleGoogle;

// app/api/v1/auth/senha/route.ts
import { handleAlterarSenha } from "@/ap/auth/web/handler";
export const PUT = handleAlterarSenha;
```

- [ ] **Commit**

```bash
git add ap/auth/infrastructure/ ap/auth/web/ app/api/v1/auth/
git commit -m "feat(auth): supabase adapter, web handler, route handlers"
```

---

## Task 7: Middleware Next.js (JWT)

**Files:**
- Create: `middleware.ts` (raiz de `teachei-web/`)

- [ ] **Criar middleware.ts**

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/ap/shared/middleware/jwt";

const PROTECTED_ROUTES = [
  "/api/v1/perfil",
  "/api/v1/favoritos",
  "/api/v1/anuncios/meus",
];

const PROTECTED_METHODS_ON_ANUNCIOS = ["POST", "PUT", "DELETE"];

function isProtected(req: NextRequest): boolean {
  const { pathname } = req.nextUrl;
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) return true;
  if (pathname.startsWith("/api/v1/anuncios") && PROTECTED_METHODS_ON_ANUNCIOS.includes(req.method)) return true;
  if (pathname.startsWith("/api/v1/auth/senha")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  if (!isProtected(req)) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("teachei_token")?.value;
  const raw = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

  if (!raw) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(raw);
    const res = NextResponse.next();
    res.headers.set("X-Usuario-Id", payload.sub);
    return res;
  } catch {
    return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
```

- [ ] **Commit**

```bash
git add middleware.ts
git commit -m "feat: middleware JWT para rotas protegidas"
```

---

## Task 8: Anuncio — domain e ports

**Files:**
- Create: `ap/anuncio/domain/model/Anuncio.ts`
- Create: `ap/anuncio/domain/model/StatusAnuncio.ts`
- Create: `ap/anuncio/domain/service/AnuncioService.ts`
- Create: `ap/anuncio/domain/exception/AnuncioNaoEncontradoException.ts`
- Create: `ap/anuncio/domain/exception/AnuncioInvalidoException.ts`
- Create: `ap/anuncio/application/ports/in/*.ts` (7 arquivos)
- Create: `ap/anuncio/application/ports/out/AnuncioRepositoryPort.ts`
- Create: `ap/__tests__/anuncio/AnuncioService.test.ts`

- [ ] **Escrever teste do AnuncioService**

```ts
// ap/__tests__/anuncio/AnuncioService.test.ts
import { describe, it, expect } from "vitest";
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";

describe("AnuncioService", () => {
  it("validarAnuncio lança erro se tipo ausente", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "" as "CARRO", precoMaximo: 50000, anos: [2020], cores: [] })
    ).toThrow("Tipo de veículo inválido");
  });

  it("validarAnuncio lança erro se precoMaximo <= 0", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "CARRO", precoMaximo: 0, anos: [2020], cores: [] })
    ).toThrow("Preço máximo deve ser maior que zero");
  });

  it("validarAnuncio lança erro se anos vazio", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "CARRO", precoMaximo: 50000, anos: [], cores: [] })
    ).toThrow("Pelo menos um ano deve ser informado");
  });

  it("validarAnuncio não lança para dados válidos", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "CARRO", precoMaximo: 50000, anos: [2020], cores: ["Branco"] })
    ).not.toThrow();
  });

  it("calcularExpiracao retorna 30 dias no futuro", () => {
    const expira = AnuncioService.calcularExpiracao();
    const diff = expira.getTime() - Date.now();
    expect(diff).toBeGreaterThan(29 * 24 * 60 * 60 * 1000);
    expect(diff).toBeLessThan(31 * 24 * 60 * 60 * 1000);
  });
});
```

- [ ] **Rodar para confirmar falha**

```bash
npx vitest run ap/__tests__/anuncio/AnuncioService.test.ts
```
Esperado: FAIL

- [ ] **Criar modelos de domínio**

```ts
// ap/anuncio/domain/model/StatusAnuncio.ts
export type StatusAnuncio = "ATIVO" | "FINALIZADO" | "EXPIRADO" | "CANCELADO";

// ap/anuncio/domain/model/Anuncio.ts
import type { StatusAnuncio } from "./StatusAnuncio";

export type TipoVeiculo = "CARRO" | "MOTO" | "CAMINHAO";

export interface VeiculoInfo {
  marcaCodigo?: string;
  marcaNome?: string;
  modeloCodigo?: string;
  modeloNome?: string;
  modeloBaseNome?: string;
  versoes?: { codigo: string; nome: string }[];
  todasVersoes?: boolean;
  anos: number[];
  cores: string[];
  precoMaximo: number;
  precoFipeReferencia?: number;
  quilometragemMinima?: number;
  quilometragemMaxima?: number;
  opcionais?: string[];
  dadosManuais: boolean;
  fotoReferenciaUrl?: string;
}

export interface ContatoInfo {
  whatsapp?: string;
  whatsappLink?: string;
  instagram?: string;
  cidade?: string;
  estado?: string;
}

export interface Anuncio {
  id: string;
  usuarioId: string;
  tipo: TipoVeiculo;
  status: StatusAnuncio;
  veiculo: VeiculoInfo;
  contato: ContatoInfo;
  observacoes?: string;
  criadoEm: string;
  expiraEm?: string;
}
```

- [ ] **Criar AnuncioService.ts**

```ts
// ap/anuncio/domain/service/AnuncioService.ts
import { ValidationError } from "@/ap/shared/errors";
import { ForbiddenError } from "@/ap/shared/errors";
import type { Anuncio, TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";

const TIPOS_VALIDOS: TipoVeiculo[] = ["CARRO", "MOTO", "CAMINHAO"];

export class AnuncioService {
  static validarAnuncio(data: { tipo: TipoVeiculo; precoMaximo: number; anos: number[]; cores: string[] }): void {
    if (!TIPOS_VALIDOS.includes(data.tipo)) throw new ValidationError("Tipo de veículo inválido");
    if (data.precoMaximo <= 0) throw new ValidationError("Preço máximo deve ser maior que zero");
    if (!data.anos || data.anos.length === 0) throw new ValidationError("Pelo menos um ano deve ser informado");
  }

  static calcularExpiracao(): Date {
    const expira = new Date();
    expira.setDate(expira.getDate() + 30);
    return expira;
  }

  static verificarProprietario(anuncio: Anuncio, usuarioId: string): void {
    if (anuncio.usuarioId !== usuarioId) throw new ForbiddenError("Você não tem permissão para modificar este anúncio");
  }
}
```

- [ ] **Criar exceções**

```ts
// ap/anuncio/domain/exception/AnuncioNaoEncontradoException.ts
import { NotFoundError } from "@/ap/shared/errors";
export class AnuncioNaoEncontradoException extends NotFoundError {
  constructor() { super("Anúncio não encontrado"); }
}

// ap/anuncio/domain/exception/AnuncioInvalidoException.ts
import { ValidationError } from "@/ap/shared/errors";
export class AnuncioInvalidoException extends ValidationError {
  constructor(msg: string) { super(msg); }
}
```

- [ ] **Criar ports out**

```ts
// ap/anuncio/application/ports/out/AnuncioRepositoryPort.ts
import type { Anuncio, TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";
import type { StatusAnuncio } from "@/ap/anuncio/domain/model/StatusAnuncio";

export interface AnuncioFilters {
  tipoVeiculo?: TipoVeiculo;
  search?: string;
  status?: StatusAnuncio;
  incluirTodosStatus?: boolean;  // quando true, não filtra por status (usado em /meus)
  marcaCodigo?: string;
  modeloCodigo?: string;
  modelos?: string[];
  cidade?: string;
  estado?: string;
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  kmMin?: number;
  kmMax?: number;
  opcionais?: string[];
  ordenar?: string;
  page?: number;
  size?: number;
  usuarioId?: string;
}

export interface PaginatedAnuncios {
  content: Anuncio[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AvailableFilters {
  tipos: TipoVeiculo[];
  marcas: { codigo: string; nome: string }[];
  modelos: { codigo: string; nome: string; baseNome: string }[];
  opcionais: { codigo: string; label: string }[];
  localizacoes: { cidade: string; estado: string }[];
}

export interface AnuncioRepositoryPort {
  findAll(filters: AnuncioFilters): Promise<PaginatedAnuncios>;
  findById(id: string): Promise<Anuncio | null>;
  findByUsuarioId(usuarioId: string): Promise<Anuncio[]>;
  save(data: Omit<Anuncio, "id" | "criadoEm">): Promise<Anuncio>;
  update(id: string, data: Partial<Anuncio>): Promise<Anuncio>;
  delete(id: string): Promise<void>;
  getAvailableFilters(tipo?: TipoVeiculo, marcaCodigo?: string): Promise<AvailableFilters>;
}
```

- [ ] **Criar ports in**

```ts
// ap/anuncio/application/ports/in/CriarAnuncioUseCase.ts
import type { Anuncio, TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";
export interface CriarAnuncioInput {
  tipo: TipoVeiculo; marcaCodigo?: string; marcaNome?: string;
  modeloCodigo?: string; modeloNome?: string; modeloBaseNome?: string;
  versoes?: { codigo: string; nome: string }[]; todasVersoes?: boolean;
  anos: number[]; cores: string[]; precoMaximo: number;
  quilometragemMinima?: number; quilometragemMaxima?: number;
  opcionais?: string[]; observacoes?: string; dadosManuais?: boolean;
  cidade?: string; estado?: string; fotoReferenciaBase64?: string;
}
export interface CriarAnuncioUseCase {
  execute(usuarioId: string, data: CriarAnuncioInput): Promise<Anuncio>;
}

// ap/anuncio/application/ports/in/BuscarAnunciosUseCase.ts
import type { AnuncioFilters, PaginatedAnuncios } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
export interface BuscarAnunciosUseCase {
  execute(filters: AnuncioFilters): Promise<PaginatedAnuncios>;
}

// ap/anuncio/application/ports/in/BuscarAnuncioUseCase.ts
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export interface BuscarAnuncioUseCase {
  execute(id: string): Promise<Anuncio>;
}

// ap/anuncio/application/ports/in/AtualizarAnuncioUseCase.ts
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export interface AtualizarAnuncioUseCase {
  execute(id: string, usuarioId: string, data: Partial<Omit<Anuncio, "id" | "usuarioId" | "criadoEm">>): Promise<Anuncio>;
}

// ap/anuncio/application/ports/in/ExcluirAnuncioUseCase.ts
export interface ExcluirAnuncioUseCase {
  execute(id: string, usuarioId: string): Promise<void>;
}

// ap/anuncio/application/ports/in/FinalizarAnuncioUseCase.ts
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export interface FinalizarAnuncioUseCase {
  execute(id: string, usuarioId: string): Promise<Anuncio>;
}

// ap/anuncio/application/ports/in/BuscarFiltrosUseCase.ts
import type { AvailableFilters } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";
export interface BuscarFiltrosUseCase {
  execute(tipo?: TipoVeiculo, marcaCodigo?: string): Promise<AvailableFilters>;
}
```

- [ ] **Rodar testes de AnuncioService**

```bash
npx vitest run ap/__tests__/anuncio/AnuncioService.test.ts
```
Esperado: PASS (5 testes)

- [ ] **Commit**

```bash
git add ap/anuncio/domain/ ap/anuncio/application/ports/ ap/__tests__/anuncio/
git commit -m "feat(anuncio): domain models, service, exceptions e ports"
```

---

## Task 9: Anuncio — use cases, Supabase adapter, web handler

**Files:**
- Create: `ap/anuncio/application/usecase/*.ts` (7 arquivos)
- Create: `ap/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts`
- Create: `ap/anuncio/web/handler.ts`
- Create: `app/api/v1/anuncios/route.ts` e demais route files

- [ ] **Criar use cases**

```ts
// ap/anuncio/application/usecase/CriarAnuncioUseCaseImpl.ts
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";
import type { CriarAnuncioUseCase, CriarAnuncioInput } from "@/ap/anuncio/application/ports/in/CriarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";

export class CriarAnuncioUseCaseImpl implements CriarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}

  async execute(usuarioId: string, data: CriarAnuncioInput): Promise<Anuncio> {
    AnuncioService.validarAnuncio({ tipo: data.tipo, precoMaximo: data.precoMaximo, anos: data.anos, cores: data.cores });
    const expiraEm = AnuncioService.calcularExpiracao().toISOString();
    return this.repo.save({
      usuarioId, tipo: data.tipo, status: "ATIVO",
      veiculo: {
        marcaCodigo: data.marcaCodigo, marcaNome: data.marcaNome,
        modeloCodigo: data.modeloCodigo, modeloNome: data.modeloNome,
        modeloBaseNome: data.modeloBaseNome, versoes: data.versoes,
        todasVersoes: data.todasVersoes, anos: data.anos, cores: data.cores,
        precoMaximo: data.precoMaximo, quilometragemMinima: data.quilometragemMinima,
        quilometragemMaxima: data.quilometragemMaxima, opcionais: data.opcionais,
        dadosManuais: data.dadosManuais ?? false,
      },
      contato: { cidade: data.cidade, estado: data.estado },
      observacoes: data.observacoes, expiraEm,
    });
  }
}

// ap/anuncio/application/usecase/BuscarAnunciosUseCaseImpl.ts
import type { BuscarAnunciosUseCase } from "@/ap/anuncio/application/ports/in/BuscarAnunciosUseCase";
import type { AnuncioFilters, PaginatedAnuncios, AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
export class BuscarAnunciosUseCaseImpl implements BuscarAnunciosUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  execute(filters: AnuncioFilters): Promise<PaginatedAnuncios> { return this.repo.findAll(filters); }
}

// ap/anuncio/application/usecase/BuscarAnuncioUseCaseImpl.ts
import { AnuncioNaoEncontradoException } from "@/ap/anuncio/domain/exception/AnuncioNaoEncontradoException";
import type { BuscarAnuncioUseCase } from "@/ap/anuncio/application/ports/in/BuscarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export class BuscarAnuncioUseCaseImpl implements BuscarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string): Promise<Anuncio> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    return a;
  }
}

// ap/anuncio/application/usecase/AtualizarAnuncioUseCaseImpl.ts
import { AnuncioNaoEncontradoException } from "@/ap/anuncio/domain/exception/AnuncioNaoEncontradoException";
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";
import type { AtualizarAnuncioUseCase } from "@/ap/anuncio/application/ports/in/AtualizarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export class AtualizarAnuncioUseCaseImpl implements AtualizarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string, usuarioId: string, data: Partial<Omit<Anuncio, "id" | "usuarioId" | "criadoEm">>): Promise<Anuncio> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AnuncioNaoEncontradoException();
    AnuncioService.verificarProprietario(existing, usuarioId);
    return this.repo.update(id, data);
  }
}

// ap/anuncio/application/usecase/ExcluirAnuncioUseCaseImpl.ts
import { AnuncioNaoEncontradoException } from "@/ap/anuncio/domain/exception/AnuncioNaoEncontradoException";
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";
import type { ExcluirAnuncioUseCase } from "@/ap/anuncio/application/ports/in/ExcluirAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
export class ExcluirAnuncioUseCaseImpl implements ExcluirAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string, usuarioId: string): Promise<void> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    AnuncioService.verificarProprietario(a, usuarioId);
    await this.repo.delete(id);
  }
}

// ap/anuncio/application/usecase/FinalizarAnuncioUseCaseImpl.ts
import { AnuncioNaoEncontradoException } from "@/ap/anuncio/domain/exception/AnuncioNaoEncontradoException";
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";
import type { FinalizarAnuncioUseCase } from "@/ap/anuncio/application/ports/in/FinalizarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export class FinalizarAnuncioUseCaseImpl implements FinalizarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string, usuarioId: string): Promise<Anuncio> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    AnuncioService.verificarProprietario(a, usuarioId);
    return this.repo.update(id, { status: "FINALIZADO" });
  }
}

// ap/anuncio/application/usecase/BuscarFiltrosUseCaseImpl.ts
import type { BuscarFiltrosUseCase } from "@/ap/anuncio/application/ports/in/BuscarFiltrosUseCase";
import type { AvailableFilters, AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";
export class BuscarFiltrosUseCaseImpl implements BuscarFiltrosUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  execute(tipo?: TipoVeiculo, marcaCodigo?: string): Promise<AvailableFilters> {
    return this.repo.getAvailableFilters(tipo, marcaCodigo);
  }
}
```

- [ ] **Criar AnuncioSupabaseAdapter.ts**

```ts
// ap/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts
import { supabase } from "@/ap/shared/db/supabase";
import type { AnuncioRepositoryPort, AnuncioFilters, PaginatedAnuncios, AvailableFilters } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio, TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";

function toAnuncio(row: Record<string, unknown>): Anuncio {
  return {
    id: row.id as string,
    usuarioId: row.usuario_id as string,
    tipo: row.tipo as TipoVeiculo,
    status: row.status as Anuncio["status"],
    veiculo: row.veiculo as Anuncio["veiculo"],
    contato: row.contato as Anuncio["contato"],
    observacoes: row.observacoes as string | undefined,
    criadoEm: row.criado_em as string,
    expiraEm: row.expira_em as string | undefined,
  };
}

export class AnuncioSupabaseAdapter implements AnuncioRepositoryPort {
  async findAll(filters: AnuncioFilters): Promise<PaginatedAnuncios> {
    const page = filters.page ?? 0;
    const size = filters.size ?? 20;
    const from = page * size;
    const to = from + size - 1;

    let query = supabase.from("anuncios").select("*", { count: "exact" });

    if (filters.usuarioId) query = query.eq("usuario_id", filters.usuarioId);
    if (filters.tipoVeiculo) query = query.eq("tipo", filters.tipoVeiculo);
    if (filters.status) query = query.eq("status", filters.status);
    else if (!filters.incluirTodosStatus) query = query.eq("status", "ATIVO");

    if (filters.search) {
      query = query.or(`veiculo->>'marcaNome'.ilike.%${filters.search}%,veiculo->>'modeloNome'.ilike.%${filters.search}%`);
    }
    if (filters.cidade) query = query.eq("contato->>'cidade'", filters.cidade);
    if (filters.estado) query = query.eq("contato->>'estado'", filters.estado);

    const ordenar = filters.ordenar ?? "RECENTE";
    if (ordenar === "RECENTE") query = query.order("criado_em", { ascending: false });
    else if (ordenar === "PRECO_ASC") query = query.order("veiculo->>'precoMaximo'", { ascending: true });
    else if (ordenar === "PRECO_DESC") query = query.order("veiculo->>'precoMaximo'", { ascending: false });

    query = query.range(from, to);
    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const totalElements = count ?? 0;
    const totalPages = Math.ceil(totalElements / size);
    return {
      content: (data ?? []).map(toAnuncio),
      totalElements, totalPages, page, size,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    };
  }

  async findById(id: string): Promise<Anuncio | null> {
    const { data } = await supabase.from("anuncios").select("*").eq("id", id).single();
    return data ? toAnuncio(data) : null;
  }

  async findByUsuarioId(usuarioId: string): Promise<Anuncio[]> {
    const { data } = await supabase.from("anuncios").select("*").eq("usuario_id", usuarioId).order("criado_em", { ascending: false });
    return (data ?? []).map(toAnuncio);
  }

  async save(data: Omit<Anuncio, "id" | "criadoEm">): Promise<Anuncio> {
    const { data: row, error } = await supabase.from("anuncios").insert({
      usuario_id: data.usuarioId, tipo: data.tipo, status: data.status,
      veiculo: data.veiculo, contato: data.contato,
      observacoes: data.observacoes ?? null, expira_em: data.expiraEm ?? null,
    }).select().single();
    if (error) throw new Error(error.message);
    return toAnuncio(row);
  }

  async update(id: string, data: Partial<Anuncio>): Promise<Anuncio> {
    const patch: Record<string, unknown> = {};
    if (data.status) patch.status = data.status;
    if (data.veiculo) patch.veiculo = data.veiculo;
    if (data.contato) patch.contato = data.contato;
    if (data.observacoes !== undefined) patch.observacoes = data.observacoes;

    const { data: row, error } = await supabase.from("anuncios").update(patch).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return toAnuncio(row);
  }

  async delete(id: string): Promise<void> {
    await supabase.from("anuncios").delete().eq("id", id);
  }

  async getAvailableFilters(tipo?: TipoVeiculo): Promise<AvailableFilters> {
    let query = supabase.from("anuncios").select("tipo, veiculo, contato").eq("status", "ATIVO");
    if (tipo) query = query.eq("tipo", tipo);
    const { data } = await query;
    const rows = data ?? [];

    const tipos = [...new Set(rows.map((r) => r.tipo))] as TipoVeiculo[];
    const marcaMap = new Map<string, { codigo: string; nome: string }>();
    const modeloMap = new Map<string, { codigo: string; nome: string; baseNome: string }>();
    const opcionalMap = new Map<string, { codigo: string; label: string }>();
    const locMap = new Map<string, { cidade: string; estado: string }>();

    for (const r of rows) {
      const v = r.veiculo as Anuncio["veiculo"];
      const c = r.contato as Anuncio["contato"];
      if (v.marcaCodigo && v.marcaNome) marcaMap.set(v.marcaCodigo, { codigo: v.marcaCodigo, nome: v.marcaNome });
      if (v.modeloCodigo && v.modeloNome) modeloMap.set(v.modeloCodigo, { codigo: v.modeloCodigo, nome: v.modeloNome, baseNome: v.modeloBaseNome ?? v.modeloNome });
      if (v.opcionais) v.opcionais.forEach((op) => opcionalMap.set(op, { codigo: op, label: op }));
      if (c.cidade && c.estado) locMap.set(`${c.cidade}|${c.estado}`, { cidade: c.cidade, estado: c.estado });
    }

    return {
      tipos,
      marcas: [...marcaMap.values()],
      modelos: [...modeloMap.values()],
      opcionais: [...opcionalMap.values()],
      localizacoes: [...locMap.values()],
    };
  }
}
```

- [ ] **Criar ap/anuncio/web/handler.ts**

```ts
// ap/anuncio/web/handler.ts
import { AnuncioSupabaseAdapter } from "@/ap/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter";
import { CriarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/CriarAnuncioUseCaseImpl";
import { BuscarAnunciosUseCaseImpl } from "@/ap/anuncio/application/usecase/BuscarAnunciosUseCaseImpl";
import { BuscarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/BuscarAnuncioUseCaseImpl";
import { AtualizarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/AtualizarAnuncioUseCaseImpl";
import { ExcluirAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/ExcluirAnuncioUseCaseImpl";
import { FinalizarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/FinalizarAnuncioUseCaseImpl";
import { BuscarFiltrosUseCaseImpl } from "@/ap/anuncio/application/usecase/BuscarFiltrosUseCaseImpl";
import { AppError } from "@/ap/shared/errors";
import type { TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";

function makeRepo() { return new AnuncioSupabaseAdapter(); }
function err(e: unknown): Response {
  if (e instanceof AppError) return Response.json({ message: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleListar(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;
    const filters = {
      tipoVeiculo: p.get("tipoVeiculo") as TipoVeiculo | undefined || undefined,
      search: p.get("search") || undefined,
      status: p.get("status") as "ATIVO" | undefined || undefined,
      marcaCodigo: p.get("marcaCodigo") || undefined,
      modeloCodigo: p.get("modeloCodigo") || undefined,
      cidade: p.get("cidade") || undefined,
      estado: p.get("estado") || undefined,
      anoMin: p.get("anoMin") ? Number(p.get("anoMin")) : undefined,
      anoMax: p.get("anoMax") ? Number(p.get("anoMax")) : undefined,
      precoMin: p.get("precoMin") ? Number(p.get("precoMin")) : undefined,
      precoMax: p.get("precoMax") ? Number(p.get("precoMax")) : undefined,
      ordenar: p.get("ordenar") || undefined,
      page: p.get("page") ? Number(p.get("page")) : 0,
      size: p.get("size") ? Number(p.get("size")) : 20,
    };
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute(filters);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleCriar(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const body = await req.json();
    const result = await new CriarAnuncioUseCaseImpl(makeRepo()).execute(usuarioId, body);
    return Response.json(result, { status: 201 });
  } catch (e) { return err(e); }
}

export async function handleBuscarPorId(_req: Request, id: string): Promise<Response> {
  try {
    const result = await new BuscarAnuncioUseCaseImpl(makeRepo()).execute(id);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleAtualizar(req: Request, id: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const body = await req.json();
    const result = await new AtualizarAnuncioUseCaseImpl(makeRepo()).execute(id, usuarioId, body);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleExcluir(req: Request, id: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await new ExcluirAnuncioUseCaseImpl(makeRepo()).execute(id, usuarioId);
    return new Response(null, { status: 204 });
  } catch (e) { return err(e); }
}

export async function handleFinalizar(req: Request, id: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const result = await new FinalizarAnuncioUseCaseImpl(makeRepo()).execute(id, usuarioId);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleMeus(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    // incluirTodosStatus: true → mostra ATIVO, FINALIZADO, EXPIRADO, CANCELADO do próprio usuário
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute({ usuarioId, incluirTodosStatus: true, size: 1000 });
    return Response.json(result.content);
  } catch (e) { return err(e); }
}

export async function handleFiltros(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const tipo = url.searchParams.get("tipo") as TipoVeiculo | undefined || undefined;
    const marcaCodigo = url.searchParams.get("marcaCodigo") || undefined;
    const result = await new BuscarFiltrosUseCaseImpl(makeRepo()).execute(tipo, marcaCodigo);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handlePorUsuario(_req: Request, userId: string): Promise<Response> {
  try {
    // Rota pública: retorna apenas ATIVO (sem incluirTodosStatus)
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute({ usuarioId: userId, size: 1000 });
    return Response.json(result.content);
  } catch (e) { return err(e); }
}
```

- [ ] **Criar Route Handlers de anuncio**

```ts
// app/api/v1/anuncios/route.ts
import { handleListar, handleCriar } from "@/ap/anuncio/web/handler";
export async function GET(req: Request) { return handleListar(req); }
export async function POST(req: Request) { return handleCriar(req); }

// app/api/v1/anuncios/meus/route.ts
import { handleMeus } from "@/ap/anuncio/web/handler";
export async function GET(req: Request) { return handleMeus(req); }

// app/api/v1/anuncios/filtros/route.ts
import { handleFiltros } from "@/ap/anuncio/web/handler";
export async function GET(req: Request) { return handleFiltros(req); }

// app/api/v1/anuncios/[id]/route.ts
import { handleBuscarPorId, handleAtualizar, handleExcluir } from "@/ap/anuncio/web/handler";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleBuscarPorId(req, id);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleAtualizar(req, id);
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleExcluir(req, id);
}

// app/api/v1/anuncios/[id]/finalizar/route.ts
import { handleFinalizar } from "@/ap/anuncio/web/handler";
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleFinalizar(req, id);
}

// app/api/v1/anuncios/usuario/[userId]/route.ts
import { handlePorUsuario } from "@/ap/anuncio/web/handler";
export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params; return handlePorUsuario(req, userId);
}
```

- [ ] **Rodar todos os testes**

```bash
npx vitest run
```
Esperado: PASS (todos)

- [ ] **Commit**

```bash
git add ap/anuncio/ app/api/v1/anuncios/
git commit -m "feat(anuncio): use cases, supabase adapter, web handler, route handlers"
```

---

## Task 10: Módulo Perfil

**Files:**
- Create: `ap/perfil/domain/model/Perfil.ts`
- Create: `ap/perfil/domain/exception/PerfilNaoEncontradoException.ts`
- Create: `ap/perfil/application/ports/in/GerenciarPerfilUseCase.ts`
- Create: `ap/perfil/application/ports/out/PerfilRepositoryPort.ts`
- Create: `ap/perfil/application/usecase/GerenciarPerfilUseCaseImpl.ts`
- Create: `ap/perfil/infrastructure/persistence/PerfilSupabaseAdapter.ts`
- Create: `ap/perfil/web/handler.ts`
- Create: `app/api/v1/perfil/route.ts`
- Create: `app/api/v1/perfil/[id]/route.ts`

- [ ] **Criar domain de perfil**

```ts
// ap/perfil/domain/model/Perfil.ts
export interface Perfil {
  id: string;
  usuarioId: string;
  nome: string;
  bio?: string;
  fotoUrl?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
  role: "BUYER" | "SELLER";
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  criadoEm: string;
}

export interface AtualizarPerfilInput {
  nome?: string;
  bio?: string;
  fotoUrl?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
  role?: "BUYER" | "SELLER";
}

// ap/perfil/domain/exception/PerfilNaoEncontradoException.ts
import { NotFoundError } from "@/ap/shared/errors";
export class PerfilNaoEncontradoException extends NotFoundError {
  constructor() { super("Perfil não encontrado"); }
}
```

- [ ] **Criar ports**

```ts
// ap/perfil/application/ports/out/PerfilRepositoryPort.ts
import type { Perfil, AtualizarPerfilInput } from "@/ap/perfil/domain/model/Perfil";
export interface PerfilRepositoryPort {
  findByUsuarioId(usuarioId: string): Promise<Perfil | null>;
  findById(id: string): Promise<Perfil | null>;
  save(usuarioId: string, nome: string): Promise<Perfil>;
  update(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil>;
  delete(usuarioId: string): Promise<void>;
}

// ap/perfil/application/ports/in/GerenciarPerfilUseCase.ts
import type { Perfil, AtualizarPerfilInput } from "@/ap/perfil/domain/model/Perfil";
export interface GerenciarPerfilUseCase {
  buscar(usuarioId: string): Promise<Perfil>;
  buscarPorId(id: string): Promise<Perfil>;
  atualizar(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil>;
  criarOuBuscar(usuarioId: string, nome: string): Promise<Perfil>;
}
```

- [ ] **Criar GerenciarPerfilUseCaseImpl.ts**

```ts
// ap/perfil/application/usecase/GerenciarPerfilUseCaseImpl.ts
import { PerfilNaoEncontradoException } from "@/ap/perfil/domain/exception/PerfilNaoEncontradoException";
import type { GerenciarPerfilUseCase } from "@/ap/perfil/application/ports/in/GerenciarPerfilUseCase";
import type { PerfilRepositoryPort } from "@/ap/perfil/application/ports/out/PerfilRepositoryPort";
import type { Perfil, AtualizarPerfilInput } from "@/ap/perfil/domain/model/Perfil";

export class GerenciarPerfilUseCaseImpl implements GerenciarPerfilUseCase {
  constructor(private repo: PerfilRepositoryPort) {}

  async buscar(usuarioId: string): Promise<Perfil> {
    const p = await this.repo.findByUsuarioId(usuarioId);
    if (!p) throw new PerfilNaoEncontradoException();
    return p;
  }

  async buscarPorId(id: string): Promise<Perfil> {
    const p = await this.repo.findById(id);
    if (!p) throw new PerfilNaoEncontradoException();
    return p;
  }

  async atualizar(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil> {
    const existing = await this.repo.findByUsuarioId(usuarioId);
    if (!existing) throw new PerfilNaoEncontradoException();
    return this.repo.update(usuarioId, data);
  }

  async criarOuBuscar(usuarioId: string, nome: string): Promise<Perfil> {
    const existing = await this.repo.findByUsuarioId(usuarioId);
    if (existing) return existing;
    return this.repo.save(usuarioId, nome);
  }
}
```

- [ ] **Criar PerfilSupabaseAdapter.ts**

```ts
// ap/perfil/infrastructure/persistence/PerfilSupabaseAdapter.ts
import { supabase } from "@/ap/shared/db/supabase";
import type { PerfilRepositoryPort } from "@/ap/perfil/application/ports/out/PerfilRepositoryPort";
import type { Perfil, AtualizarPerfilInput } from "@/ap/perfil/domain/model/Perfil";

function toPerfil(row: Record<string, unknown>): Perfil {
  return {
    id: row.id as string,
    usuarioId: row.usuario_id as string,
    nome: row.nome as string,
    bio: row.bio as string | undefined,
    fotoUrl: row.foto_url as string | undefined,
    whatsapp: row.whatsapp as string | undefined,
    instagram: row.instagram as string | undefined,
    facebook: row.facebook as string | undefined,
    cidade: row.cidade as string | undefined,
    estado: row.estado as string | undefined,
    role: (row.role as "BUYER" | "SELLER") ?? "BUYER",
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
    criadoEm: row.criado_em as string,
  };
}

export class PerfilSupabaseAdapter implements PerfilRepositoryPort {
  async findByUsuarioId(usuarioId: string): Promise<Perfil | null> {
    const { data } = await supabase.from("perfis").select("*").eq("usuario_id", usuarioId).single();
    return data ? toPerfil(data) : null;
  }

  async findById(id: string): Promise<Perfil | null> {
    const { data } = await supabase.from("perfis").select("*").eq("id", id).single();
    return data ? toPerfil(data) : null;
  }

  async save(usuarioId: string, nome: string): Promise<Perfil> {
    const { data, error } = await supabase.from("perfis").insert({ usuario_id: usuarioId, nome }).select().single();
    if (error) throw new Error(error.message);
    return toPerfil(data);
  }

  async update(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil> {
    const patch: Record<string, unknown> = {};
    if (data.nome !== undefined) patch.nome = data.nome;
    if (data.bio !== undefined) patch.bio = data.bio;
    if (data.fotoUrl !== undefined) patch.foto_url = data.fotoUrl;
    if (data.whatsapp !== undefined) patch.whatsapp = data.whatsapp;
    if (data.instagram !== undefined) patch.instagram = data.instagram;
    if (data.facebook !== undefined) patch.facebook = data.facebook;
    if (data.cidade !== undefined) patch.cidade = data.cidade;
    if (data.estado !== undefined) patch.estado = data.estado;
    if (data.role !== undefined) patch.role = data.role;

    const { data: row, error } = await supabase.from("perfis").update(patch).eq("usuario_id", usuarioId).select().single();
    if (error) throw new Error(error.message);
    return toPerfil(row);
  }

  async delete(usuarioId: string): Promise<void> {
    await supabase.from("perfis").delete().eq("usuario_id", usuarioId);
  }
}
```

- [ ] **Criar ap/perfil/web/handler.ts**

```ts
// ap/perfil/web/handler.ts
import { PerfilSupabaseAdapter } from "@/ap/perfil/infrastructure/persistence/PerfilSupabaseAdapter";
import { GerenciarPerfilUseCaseImpl } from "@/ap/perfil/application/usecase/GerenciarPerfilUseCaseImpl";
import { ExcluirContaUseCaseImpl } from "@/ap/auth/application/usecase/ExcluirContaUseCaseImpl";
import { UsuarioSupabaseAdapter } from "@/ap/auth/infrastructure/persistence/UsuarioSupabaseAdapter";
import { AppError } from "@/ap/shared/errors";

function makeUseCase() { return new GerenciarPerfilUseCaseImpl(new PerfilSupabaseAdapter()); }
function err(e: unknown): Response {
  if (e instanceof AppError) return Response.json({ message: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleBuscarPerfil(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const perfil = await makeUseCase().buscar(usuarioId);
    return Response.json(perfil);
  } catch (e) { return err(e); }
}

export async function handleAtualizarPerfil(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const body = await req.json();
    const perfil = await makeUseCase().atualizar(usuarioId, body);
    return Response.json(perfil);
  } catch (e) { return err(e); }
}

export async function handleExcluirConta(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await new ExcluirContaUseCaseImpl(new UsuarioSupabaseAdapter()).execute(usuarioId);
    return new Response(null, { status: 204 });
  } catch (e) { return err(e); }
}

export async function handleBuscarPerfilPorId(_req: Request, id: string): Promise<Response> {
  try {
    const perfil = await makeUseCase().buscarPorId(id);
    return Response.json(perfil);
  } catch (e) { return err(e); }
}
```

- [ ] **Criar Route Handlers de perfil**

```ts
// app/api/v1/perfil/route.ts
import { handleBuscarPerfil, handleAtualizarPerfil, handleExcluirConta } from "@/ap/perfil/web/handler";
export async function GET(req: Request) { return handleBuscarPerfil(req); }
export async function PUT(req: Request) { return handleAtualizarPerfil(req); }
export async function DELETE(req: Request) { return handleExcluirConta(req); }

// app/api/v1/perfil/[id]/route.ts
import { handleBuscarPerfilPorId } from "@/ap/perfil/web/handler";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleBuscarPerfilPorId(req, id);
}
```

- [ ] **Commit**

```bash
git add ap/perfil/ app/api/v1/perfil/
git commit -m "feat(perfil): domain, ports, use case, supabase adapter, route handlers"
```

---

## Task 11: Módulo Favorito

**Files:**
- Create: `ap/favorito/domain/model/Favorito.ts`
- Create: `ap/favorito/application/ports/in/GerenciarFavoritosUseCase.ts`
- Create: `ap/favorito/application/ports/out/FavoritoRepositoryPort.ts`
- Create: `ap/favorito/application/usecase/GerenciarFavoritosUseCaseImpl.ts`
- Create: `ap/favorito/infrastructure/persistence/FavoritoSupabaseAdapter.ts`
- Create: `ap/favorito/web/handler.ts`
- Create: `app/api/v1/favoritos/route.ts`
- Create: `app/api/v1/favoritos/[anuncioId]/route.ts`
- Create: `app/api/v1/favoritos/[anuncioId]/verificar/route.ts`
- Create: `ap/__tests__/favorito/GerenciarFavoritosUseCaseImpl.test.ts`

- [ ] **Escrever teste do use case**

```ts
// ap/__tests__/favorito/GerenciarFavoritosUseCaseImpl.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GerenciarFavoritosUseCaseImpl } from "@/ap/favorito/application/usecase/GerenciarFavoritosUseCaseImpl";
import type { FavoritoRepositoryPort } from "@/ap/favorito/application/ports/out/FavoritoRepositoryPort";

const mockRepo: FavoritoRepositoryPort = {
  findByUsuarioId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn(),
};

describe("GerenciarFavoritosUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("listar delega ao repo", async () => {
    vi.mocked(mockRepo.findByUsuarioId).mockResolvedValue(["id-1", "id-2"]);
    const uc = new GerenciarFavoritosUseCaseImpl(mockRepo);
    const result = await uc.listar("usuario-1");
    expect(result).toEqual(["id-1", "id-2"]);
    expect(mockRepo.findByUsuarioId).toHaveBeenCalledWith("usuario-1");
  });

  it("adicionar delega ao repo", async () => {
    vi.mocked(mockRepo.save).mockResolvedValue(undefined);
    const uc = new GerenciarFavoritosUseCaseImpl(mockRepo);
    await uc.adicionar("usuario-1", "anuncio-1");
    expect(mockRepo.save).toHaveBeenCalledWith("usuario-1", "anuncio-1");
  });

  it("verificar retorna true quando existe", async () => {
    vi.mocked(mockRepo.exists).mockResolvedValue(true);
    const uc = new GerenciarFavoritosUseCaseImpl(mockRepo);
    expect(await uc.verificar("u", "a")).toBe(true);
  });
});
```

- [ ] **Rodar para confirmar falha**

```bash
npx vitest run ap/__tests__/favorito/
```
Esperado: FAIL

- [ ] **Criar domain e ports**

```ts
// ap/favorito/domain/model/Favorito.ts
export interface Favorito {
  id: string;
  usuarioId: string;
  anuncioId: string;
  criadoEm: string;
}

// ap/favorito/application/ports/out/FavoritoRepositoryPort.ts
export interface FavoritoRepositoryPort {
  findByUsuarioId(usuarioId: string): Promise<string[]>;
  save(usuarioId: string, anuncioId: string): Promise<void>;
  delete(usuarioId: string, anuncioId: string): Promise<void>;
  exists(usuarioId: string, anuncioId: string): Promise<boolean>;
}

// ap/favorito/application/ports/in/GerenciarFavoritosUseCase.ts
export interface GerenciarFavoritosUseCase {
  listar(usuarioId: string): Promise<string[]>;
  adicionar(usuarioId: string, anuncioId: string): Promise<void>;
  remover(usuarioId: string, anuncioId: string): Promise<void>;
  verificar(usuarioId: string, anuncioId: string): Promise<boolean>;
}
```

- [ ] **Criar use case**

```ts
// ap/favorito/application/usecase/GerenciarFavoritosUseCaseImpl.ts
import type { GerenciarFavoritosUseCase } from "@/ap/favorito/application/ports/in/GerenciarFavoritosUseCase";
import type { FavoritoRepositoryPort } from "@/ap/favorito/application/ports/out/FavoritoRepositoryPort";

export class GerenciarFavoritosUseCaseImpl implements GerenciarFavoritosUseCase {
  constructor(private repo: FavoritoRepositoryPort) {}
  listar(usuarioId: string)                         { return this.repo.findByUsuarioId(usuarioId); }
  adicionar(usuarioId: string, anuncioId: string)   { return this.repo.save(usuarioId, anuncioId); }
  remover(usuarioId: string, anuncioId: string)     { return this.repo.delete(usuarioId, anuncioId); }
  verificar(usuarioId: string, anuncioId: string)   { return this.repo.exists(usuarioId, anuncioId); }
}
```

- [ ] **Criar FavoritoSupabaseAdapter.ts**

```ts
// ap/favorito/infrastructure/persistence/FavoritoSupabaseAdapter.ts
import { supabase } from "@/ap/shared/db/supabase";
import type { FavoritoRepositoryPort } from "@/ap/favorito/application/ports/out/FavoritoRepositoryPort";

export class FavoritoSupabaseAdapter implements FavoritoRepositoryPort {
  async findByUsuarioId(usuarioId: string): Promise<string[]> {
    const { data } = await supabase.from("favoritos").select("anuncio_id").eq("usuario_id", usuarioId).order("criado_em", { ascending: false });
    return (data ?? []).map((r) => r.anuncio_id as string);
  }

  async save(usuarioId: string, anuncioId: string): Promise<void> {
    await supabase.from("favoritos").upsert({ usuario_id: usuarioId, anuncio_id: anuncioId }, { onConflict: "usuario_id,anuncio_id" });
  }

  async delete(usuarioId: string, anuncioId: string): Promise<void> {
    await supabase.from("favoritos").delete().eq("usuario_id", usuarioId).eq("anuncio_id", anuncioId);
  }

  async exists(usuarioId: string, anuncioId: string): Promise<boolean> {
    const { count } = await supabase.from("favoritos").select("*", { count: "exact", head: true }).eq("usuario_id", usuarioId).eq("anuncio_id", anuncioId);
    return (count ?? 0) > 0;
  }
}
```

- [ ] **Criar ap/favorito/web/handler.ts**

```ts
// ap/favorito/web/handler.ts
import { FavoritoSupabaseAdapter } from "@/ap/favorito/infrastructure/persistence/FavoritoSupabaseAdapter";
import { GerenciarFavoritosUseCaseImpl } from "@/ap/favorito/application/usecase/GerenciarFavoritosUseCaseImpl";
import { AppError } from "@/ap/shared/errors";

function makeUseCase() { return new GerenciarFavoritosUseCaseImpl(new FavoritoSupabaseAdapter()); }
function err(e: unknown): Response {
  if (e instanceof AppError) return Response.json({ message: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleListar(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const ids = await makeUseCase().listar(usuarioId);
    return Response.json(ids);
  } catch (e) { return err(e); }
}

export async function handleAdicionar(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const { anuncioId } = await req.json();
    await makeUseCase().adicionar(usuarioId, anuncioId);
    return new Response(null, { status: 201 });
  } catch (e) { return err(e); }
}

export async function handleRemover(req: Request, anuncioId: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await makeUseCase().remover(usuarioId, anuncioId);
    return new Response(null, { status: 204 });
  } catch (e) { return err(e); }
}

export async function handleVerificar(req: Request, anuncioId: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const exists = await makeUseCase().verificar(usuarioId, anuncioId);
    return Response.json({ favorito: exists });
  } catch (e) { return err(e); }
}
```

- [ ] **Criar Route Handlers de favorito**

```ts
// app/api/v1/favoritos/route.ts
import { handleListar, handleAdicionar } from "@/ap/favorito/web/handler";
export async function GET(req: Request) { return handleListar(req); }
export async function POST(req: Request) { return handleAdicionar(req); }

// app/api/v1/favoritos/[anuncioId]/route.ts
import { handleRemover } from "@/ap/favorito/web/handler";
export async function DELETE(req: Request, { params }: { params: Promise<{ anuncioId: string }> }) {
  const { anuncioId } = await params; return handleRemover(req, anuncioId);
}

// app/api/v1/favoritos/[anuncioId]/verificar/route.ts
import { handleVerificar } from "@/ap/favorito/web/handler";
export async function GET(req: Request, { params }: { params: Promise<{ anuncioId: string }> }) {
  const { anuncioId } = await params; return handleVerificar(req, anuncioId);
}
```

- [ ] **Rodar todos os testes**

```bash
npx vitest run
```
Esperado: PASS (todos)

- [ ] **Commit**

```bash
git add ap/favorito/ app/api/v1/favoritos/ ap/__tests__/favorito/
git commit -m "feat(favorito): módulo completo com tabela Supabase e route handlers"
```

---

## Task 12: Módulo Veiculo (proxy FIPE)

**Files:**
- Create: `ap/veiculo/web/handler.ts`
- Create: `app/api/v1/veiculos/[tipo]/marcas/route.ts` (e demais)

- [ ] **Criar ap/veiculo/web/handler.ts**

```ts
// ap/veiculo/web/handler.ts
const FIPE_BASE = "https://parallelum.com.br/fipe/api/v1";

async function proxyFipe(path: string): Promise<Response> {
  try {
    const res = await fetch(`${FIPE_BASE}${path}`);
    if (!res.ok) return Response.json({ message: "Erro ao consultar FIPE" }, { status: res.status });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ message: "Serviço FIPE indisponível" }, { status: 503 });
  }
}

export function handleMarcas(tipo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas`);
}

export function handleModelos(tipo: string, marcaCodigo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas/${marcaCodigo}/modelos`);
}

export function handleAnos(tipo: string, marcaCodigo: string, modeloCodigo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`);
}

export function handlePreco(tipo: string, marcaCodigo: string, modeloCodigo: string, anoCodigo: string) {
  return proxyFipe(`/${tipo.toLowerCase()}s/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}`);
}
```

- [ ] **Criar Route Handlers de veiculo**

```ts
// app/api/v1/veiculos/[tipo]/marcas/route.ts
import { handleMarcas } from "@/ap/veiculo/web/handler";
export async function GET(_: Request, { params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params; return handleMarcas(tipo);
}

// app/api/v1/veiculos/[tipo]/marcas/[marcaCodigo]/modelos/route.ts
import { handleModelos } from "@/ap/veiculo/web/handler";
export async function GET(_: Request, { params }: { params: Promise<{ tipo: string; marcaCodigo: string }> }) {
  const { tipo, marcaCodigo } = await params; return handleModelos(tipo, marcaCodigo);
}

// app/api/v1/veiculos/[tipo]/marcas/[marcaCodigo]/modelos/[modeloCodigo]/anos/route.ts
import { handleAnos } from "@/ap/veiculo/web/handler";
export async function GET(_: Request, { params }: { params: Promise<{ tipo: string; marcaCodigo: string; modeloCodigo: string }> }) {
  const { tipo, marcaCodigo, modeloCodigo } = await params; return handleAnos(tipo, marcaCodigo, modeloCodigo);
}

// app/api/v1/veiculos/[tipo]/marcas/[marcaCodigo]/modelos/[modeloCodigo]/anos/[anoCodigo]/preco/route.ts
import { handlePreco } from "@/ap/veiculo/web/handler";
export async function GET(_: Request, { params }: { params: Promise<{ tipo: string; marcaCodigo: string; modeloCodigo: string; anoCodigo: string }> }) {
  const { tipo, marcaCodigo, modeloCodigo, anoCodigo } = await params;
  return handlePreco(tipo, marcaCodigo, modeloCodigo, anoCodigo);
}
```

- [ ] **Commit**

```bash
git add ap/veiculo/ app/api/v1/veiculos/
git commit -m "feat(veiculo): proxy FIPE via route handlers"
```

---

## Task 13: Migrar hook use-saved-intentions para API

**Files:**
- Modify: `hooks/use-saved-intentions.ts`

O hook atual usa localStorage. Agora deve chamar a API de favoritos quando o usuário está autenticado, com fallback para localStorage quando não autenticado.

- [ ] **Substituir conteúdo de hooks/use-saved-intentions.ts**

```ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";

const LOCAL_KEY = "teachei_saved_intentions";

function getLocal(): string[] {
  try {
    const s = localStorage.getItem(LOCAL_KEY);
    return s ? (JSON.parse(s) as string[]) : [];
  } catch { return []; }
}

function setLocal(ids: string[]): void {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(ids)); } catch {}
}

export function useSavedIntentions() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const authed = isAuthenticated();

  useEffect(() => {
    if (authed) {
      api.get<string[]>("/api/v1/favoritos")
        .then((ids) => { setSavedIds(ids); setIsLoaded(true); })
        .catch(() => { setSavedIds(getLocal()); setIsLoaded(true); });
    } else {
      setSavedIds(getLocal());
      setIsLoaded(true);
    }
  }, [authed]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSave = useCallback(async (id: string) => {
    const saving = !savedIds.includes(id);
    if (authed) {
      if (saving) {
        await api.post("/api/v1/favoritos", { anuncioId: id }).catch(() => {});
      } else {
        await api.delete(`/api/v1/favoritos/${id}`).catch(() => {});
      }
    }
    setSavedIds((prev) => {
      const next = saving ? [...prev, id] : prev.filter((x) => x !== id);
      if (!authed) setLocal(next);
      return next;
    });
  }, [savedIds, authed]);

  const save = useCallback(async (id: string) => {
    if (savedIds.includes(id)) return;
    if (authed) await api.post("/api/v1/favoritos", { anuncioId: id }).catch(() => {});
    setSavedIds((prev) => { const next = [...prev, id]; if (!authed) setLocal(next); return next; });
  }, [savedIds, authed]);

  const unsave = useCallback(async (id: string) => {
    if (authed) await api.delete(`/api/v1/favoritos/${id}`).catch(() => {});
    setSavedIds((prev) => { const next = prev.filter((x) => x !== id); if (!authed) setLocal(next); return next; });
  }, [authed]);

  const clearAll = useCallback(async () => {
    setSavedIds([]);
    if (!authed) setLocal([]);
  }, [authed]);

  return { savedIds, isSaved, toggleSave, save, unsave, clearAll, isLoaded };
}
```

- [ ] **Rodar todos os testes**

```bash
npx vitest run
```
Esperado: PASS (todos)

- [ ] **Adicionar variáveis de ambiente ao .env.local**

Criar `teachei-web/.env.local` (não commitar):
```
SUPABASE_URL=<sua-url-do-supabase>
SUPABASE_SERVICE_ROLE_KEY=<sua-service-role-key>
JWT_SECRET=<string-aleatória-de-32+-caracteres>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<seu-google-client-id>
```

- [ ] **Commit**

```bash
git add hooks/use-saved-intentions.ts
git commit -m "feat(favorito): migrar hook de localStorage para API de favoritos"
```

---

## Task 14: Verificação final e build

- [ ] **Rodar todos os testes**

```bash
cd teachei-web && npx vitest run
```
Esperado: PASS (todos os testes)

- [ ] **Verificar TypeScript**

```bash
npx tsc --noEmit
```
Esperado: sem erros

- [ ] **Rodar build de produção**

```bash
npm run build
```
Esperado: Build concluído sem erros

- [ ] **Commit final**

```bash
git add -A
git commit -m "chore: verificação final — build e tsc limpos após migração backend"
```
