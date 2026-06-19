# Reorganização de Rotas: (public) e (private)

**Data:** 2026-06-19  
**Projeto:** teachei-web (Next.js App Router)

---

## Objetivo

Reorganizar todas as páginas da aplicação em dois grupos de rota no topo do `app/`:

- `(public)` — páginas acessíveis sem login
- `(private)` — páginas que exigem autenticação

Hoje as páginas estão espalhadas entre `(main)`, `(auth)`, `(legal)`, `create/`, `assinatura/`, etc., com a lógica de auth controlada por uma lista `PUBLIC_ROUTES` dentro do `main-layout.tsx`. A reorganização elimina essa lista e transfere a responsabilidade de auth para os próprios layouts dos grupos.

---

## Nova Estrutura de Pastas

```
app/
├── page.tsx                        ← permanece na raiz (landing page)
│
├── (public)/
│   ├── layout.tsx                  ← MainLayout sem AuthGuard
│   ├── feed/
│   ├── sobre/
│   ├── contato/
│   ├── guias/
│   │   └── [slug]/
│   ├── intention/
│   │   └── [id]/
│   ├── profile/
│   │   └── [id]/
│   ├── user/
│   │   └── [id]/
│   ├── (auth)/
│   │   ├── layout.tsx              ← passthrough (igual ao atual)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── role-select/
│   └── (legal)/
│       ├── layout.tsx              ← wrapper visual (igual ao atual)
│       ├── termos/
│       └── privacidade/
│
├── (private)/
│   ├── layout.tsx                  ← MainLayout com AuthGuard sempre ativo
│   ├── profile/
│   ├── settings/
│   ├── favorites/
│   ├── messages/
│   ├── my-intentions/
│   ├── assinatura/
│   │   ├── sucesso/
│   │   ├── erro/
│   │   └── pendente/
│   ├── create/
│   │   ├── layout.tsx              ← wizard layout sem AuthGuard (removido)
│   │   ├── vehicle/
│   │   ├── specs/
│   │   └── review/
│   └── intention/
│       └── [id]/
│           └── edit/
│
└── api/                            ← não muda
```

**Rotas preservadas:** grupos `()` são transparentes no Next.js App Router. Todas as URLs permanecem idênticas.

---

## Mudanças nos Layouts

### `(public)/layout.tsx` — novo
```tsx
import { MainLayout } from "@/components/layout";

export default function PublicLayout({ children }) {
  return <MainLayout requireAuth={false}>{children}</MainLayout>;
}
```

### `(private)/layout.tsx` — novo
```tsx
import { MainLayout } from "@/components/layout";

export default function PrivateLayout({ children }) {
  return <MainLayout requireAuth={true}>{children}</MainLayout>;
}
```

### `main-layout.tsx` — simplificado
- Remove a lista `PUBLIC_ROUTES`
- Remove a lógica condicional de auth
- Aceita prop `requireAuth: boolean` e passa para `AuthGuard` de forma direta

### `(private)/create/layout.tsx`
- Mantém o wizard visual (steps, header, progress bar)
- Remove o `<AuthGuard>` interno — o `(private)/layout.tsx` já protege

### Layouts que não mudam
- `(public)/(auth)/layout.tsx` — passthrough idêntico ao atual `(auth)/layout.tsx`
- `(public)/(legal)/layout.tsx` — wrapper visual idêntico ao atual `(legal)/layout.tsx`
- `middleware.ts` — não muda (protege apenas rotas `/api/v1/`)

---

## Mapeamento de Movimentação

| Origem | Destino |
|--------|---------|
| `app/feed/` | `app/(public)/feed/` |
| `app/sobre/` | `app/(public)/sobre/` |
| `app/(main)/contato/` | `app/(public)/contato/` |
| `app/guias/` | `app/(public)/guias/` |
| `app/guias/[slug]/` | `app/(public)/guias/[slug]/` |
| `app/intention/[id]/` | `app/(public)/intention/[id]/` |
| `app/profile/[id]/` | `app/(public)/profile/[id]/` |
| `app/user/[id]/` | `app/(public)/user/[id]/` |
| `app/(auth)/login/` | `app/(public)/(auth)/login/` |
| `app/(auth)/register/` | `app/(public)/(auth)/register/` |
| `app/(auth)/forgot-password/` | `app/(public)/(auth)/forgot-password/` |
| `app/(auth)/role-select/` | `app/(public)/(auth)/role-select/` |
| `app/(legal)/termos/` | `app/(public)/(legal)/termos/` |
| `app/(legal)/privacidade/` | `app/(public)/(legal)/privacidade/` |
| `app/(main)/profile/` | `app/(private)/profile/` |
| `app/(main)/settings/` | `app/(private)/settings/` |
| `app/(main)/favorites/` | `app/(private)/favorites/` |
| `app/(main)/messages/` | `app/(private)/messages/` |
| `app/(main)/my-intentions/` | `app/(private)/my-intentions/` |
| `app/assinatura/` | `app/(private)/assinatura/` |
| `app/create/` | `app/(private)/create/` |
| `app/intention/[id]/edit/` | `app/(private)/intention/[id]/edit/` |

---

## O que é Deletado

- `app/(main)/layout.tsx` — substituído por `(public)/layout.tsx` e `(private)/layout.tsx`
- `app/(auth)/layout.tsx` — recriado em `(public)/(auth)/layout.tsx`
- `app/(legal)/layout.tsx` — recriado em `(public)/(legal)/layout.tsx`
- Lista `PUBLIC_ROUTES` em `main-layout.tsx`

---

## Critérios de Sucesso

- Todas as rotas respondem na mesma URL que antes
- Páginas públicas acessíveis sem token (sem redirect para login)
- Páginas privadas redirecionam para `/login` quando sem autenticação
- `main-layout.tsx` não contém mais nenhuma lista de rotas
- `create/layout.tsx` não contém mais `AuthGuard` próprio
