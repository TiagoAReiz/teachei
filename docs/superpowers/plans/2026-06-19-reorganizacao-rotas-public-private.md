# Reorganização de Rotas (public) e (private) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar todas as páginas do Next.js App Router em dois grupos de rota: `(public)` (sem auth) e `(private)` (auth obrigatória), eliminando a lista `PUBLIC_ROUTES` do `main-layout.tsx`.

**Architecture:** Dois layouts raiz substituem o atual `(main)/layout.tsx`. `(public)/layout.tsx` usa `MainLayout` diretamente. `(private)/layout.tsx` envolve `MainLayout` com `AuthGuard`. `AuthGuard` é simplificado para sempre proteger (sem `publicRoutes`). Grupos `()` são transparentes no App Router — todas as URLs permanecem iguais.

**Tech Stack:** Next.js 14+ App Router, React, TypeScript, `@/` path alias no `tsconfig.json`

## Global Constraints

- Nenhuma URL de rota pública deve mudar (grupos `()` são transparentes)
- Mover arquivos com `git mv` para preservar histórico
- Todos os imports usam alias `@/` — não há imports relativos entre diretórios diferentes
- Dois arquivos usam import relativo de sibling: `user/[id]/page.tsx → ./client` e `intention/[id]/page.tsx → ./client` — ambos se movem juntos, sem ajuste necessário
- `middleware.ts` não deve ser tocado
- `app/page.tsx` (landing) permanece na raiz

---

## Mapa de Arquivos

### Modificados
- `teachei-web/components/auth/auth-guard.tsx` — remove prop `publicRoutes`, sempre protege
- `teachei-web/components/layout/main-layout.tsx` — remove `AuthGuard`, remove `PUBLIC_ROUTES`

### Criados
- `teachei-web/app/(public)/layout.tsx` — MainLayout sem auth
- `teachei-web/app/(public)/(auth)/layout.tsx` — passthrough (igual ao atual `(auth)/layout.tsx`)
- `teachei-web/app/(public)/(legal)/layout.tsx` — wrapper visual (igual ao atual `(legal)/layout.tsx`)
- `teachei-web/app/(private)/layout.tsx` — AuthGuard + MainLayout

### Movidos (git mv)
| De | Para |
|----|------|
| `app/feed/` | `app/(public)/feed/` |
| `app/sobre/` | `app/(public)/sobre/` |
| `app/(main)/contato/` | `app/(public)/contato/` |
| `app/guias/` | `app/(public)/guias/` |
| `app/intention/[id]/` (somente page/client, sem edit) | `app/(public)/intention/[id]/` |
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

### Deletados
- `app/(main)/layout.tsx`
- `app/(auth)/layout.tsx`
- `app/(legal)/layout.tsx`
- dirs vazios após moves

---

## Task 1: Simplificar `AuthGuard` — remover `publicRoutes`

**Files:**
- Modify: `teachei-web/components/auth/auth-guard.tsx`

**Interfaces:**
- Produces: `AuthGuard({ children: ReactNode })` — sem props opcionais, sempre requer auth

- [ ] **Step 1: Substituir conteúdo de `auth-guard.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getToken } from "@/lib/api";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasToken = typeof window !== "undefined" && !!getToken();

  useEffect(() => {
    if (isLoading) return;
    if (!user && !hasToken) {
      router.replace("/login");
    }
  }, [user, isLoading, hasToken, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user && !hasToken) {
    return null;
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Verificar que não há mais usos de `publicRoutes` no projeto**

```bash
grep -rn "publicRoutes" /home/tiago/workfolder/teachei-api/teachei-web --include="*.tsx" --include="*.ts"
```

Esperado: nenhum resultado (ou somente o arquivo que acabamos de editar, que não o contém mais).

- [ ] **Step 3: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add teachei-web/components/auth/auth-guard.tsx
git commit -m "refactor: simplifica AuthGuard — remove publicRoutes, sempre protege"
```

---

## Task 2: Simplificar `MainLayout` — remover `AuthGuard` e `PUBLIC_ROUTES`

**Files:**
- Modify: `teachei-web/components/layout/main-layout.tsx`

**Interfaces:**
- Consumes: `AuthGuard` sem `publicRoutes` (Task 1)
- Produces: `MainLayout({ children, showSidebar?, className? })` — puramente visual, sem lógica de auth

- [ ] **Step 1: Substituir conteúdo de `main-layout.tsx`**

```tsx
"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";

const FILTER_PAGES = ["/", "/feed"];

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function MainLayout({ children, showSidebar = true, className }: MainLayoutProps) {
  const pathname = usePathname();

  const showFilters = FILTER_PAGES.some(
    (page) => pathname === page || (page !== "/" && pathname.startsWith(page))
  );

  const sidebarWidth = showSidebar && showFilters ? "lg:ml-80" : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {showSidebar && <Sidebar />}

      <main
        className={cn(
          "min-h-screen pt-32 pb-20 lg:pb-0 transition-all duration-300 flex flex-col",
          sidebarWidth,
          className
        )}
      >
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </main>

      <MobileNav />
    </div>
  );
}
```

- [ ] **Step 2: Verificar que `PUBLIC_ROUTES` e `AuthGuard` foram removidos**

```bash
grep -n "PUBLIC_ROUTES\|AuthGuard" /home/tiago/workfolder/teachei-api/teachei-web/components/layout/main-layout.tsx
```

Esperado: nenhum resultado.

- [ ] **Step 3: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add teachei-web/components/layout/main-layout.tsx
git commit -m "refactor: remove PUBLIC_ROUTES e AuthGuard do MainLayout — auth passa a ser responsabilidade dos layouts de grupo"
```

---

## Task 3: Criar `(public)/layout.tsx` e mover páginas públicas simples

**Files:**
- Create: `teachei-web/app/(public)/layout.tsx`
- Move: `feed/`, `sobre/`, `contato/` (de `(main)/`), `guias/` (com `[slug]/`)

**Interfaces:**
- Consumes: `MainLayout` sem auth (Task 2)
- Produces: grupo `(public)` servindo `/feed`, `/sobre`, `/contato`, `/guias`, `/guias/[slug]`

- [ ] **Step 1: Criar `app/(public)/layout.tsx`**

```tsx
import { type ReactNode } from "react";
import { MainLayout } from "@/components/layout";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
```

- [ ] **Step 2: Mover páginas públicas simples**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git mv feed "(public)/feed"
git mv sobre "(public)/sobre"
git mv "(main)/contato" "(public)/contato"
git mv guias "(public)/guias"
```

- [ ] **Step 3: Verificar estrutura criada**

```bash
ls /home/tiago/workfolder/teachei-api/teachei-web/app/\(public\)/
```

Esperado: `layout.tsx  feed/  sobre/  contato/  guias/`

- [ ] **Step 4: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "feat: cria grupo (public) com layout e move feed, sobre, contato, guias"
```

---

## Task 4: Mover páginas públicas com parâmetros dinâmicos

**Files:**
- Move: `intention/[id]/` (apenas page.tsx, client.tsx, not-found — sem a subpasta `edit/`)
- Move: `profile/[id]/`
- Move: `user/[id]/`

**Interfaces:**
- Produces: rotas `/intention/[id]`, `/profile/[id]`, `/user/[id]` servidas por `(public)`

- [ ] **Step 1: Criar estrutura de destino e mover `intention/[id]` (sem edit)**

A pasta `intention/[id]/edit/` é privada — ela será movida na Task 9. Primeiro movemos os arquivos de `intention/[id]/` sem a subpasta `edit/`:

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

mkdir -p "(public)/intention/[id]"
git mv "intention/[id]/page.tsx" "(public)/intention/[id]/page.tsx"
git mv "intention/[id]/client.tsx" "(public)/intention/[id]/client.tsx"
```

Se houver outros arquivos em `intention/[id]/` além de `page.tsx`, `client.tsx` e `edit/`, movê-los também:

```bash
ls "intention/[id]/"
```

Arquivos listados (exceto `edit/`) devem ser movidos para `(public)/intention/[id]/`.

- [ ] **Step 2: Mover `profile/[id]/` e `user/[id]/`**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git mv "profile/[id]" "(public)/profile/[id]"
git mv "user/[id]" "(public)/user/[id]"
```

- [ ] **Step 3: Verificar estrutura**

```bash
ls /home/tiago/workfolder/teachei-api/teachei-web/app/\(public\)/
```

Esperado: `layout.tsx  feed/  sobre/  contato/  guias/  intention/  profile/  user/`

- [ ] **Step 4: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "feat: move intention/[id], profile/[id], user/[id] para (public)"
```

---

## Task 5: Mover `(auth)` para `(public)/(auth)`

**Files:**
- Create: `teachei-web/app/(public)/(auth)/layout.tsx`
- Move: `(auth)/login/`, `(auth)/register/`, `(auth)/forgot-password/`, `(auth)/role-select/`
- Delete: `teachei-web/app/(auth)/layout.tsx` e dir vazio `(auth)/`

**Interfaces:**
- Produces: rotas `/login`, `/register`, `/forgot-password`, `/role-select` servidas por `(public)/(auth)`

- [ ] **Step 1: Criar `(public)/(auth)/layout.tsx`** (passthrough idêntico ao atual)

```tsx
import { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Mover páginas de auth**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git mv "(auth)/login" "(public)/(auth)/login"
git mv "(auth)/register" "(public)/(auth)/register"
git mv "(auth)/forgot-password" "(public)/(auth)/forgot-password"
git mv "(auth)/role-select" "(public)/(auth)/role-select"
```

- [ ] **Step 3: Deletar layout e dir antigos**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git rm "(auth)/layout.tsx"
rmdir "(auth)"
```

- [ ] **Step 4: Verificar**

```bash
ls /home/tiago/workfolder/teachei-api/teachei-web/app/\(public\)/\(auth\)/
```

Esperado: `layout.tsx  login/  register/  forgot-password/  role-select/`

- [ ] **Step 5: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "feat: move (auth) para (public)/(auth)"
```

---

## Task 6: Mover `(legal)` para `(public)/(legal)`

**Files:**
- Create: `teachei-web/app/(public)/(legal)/layout.tsx`
- Move: `(legal)/termos/`, `(legal)/privacidade/`
- Delete: `teachei-web/app/(legal)/layout.tsx` e dir vazio

**Interfaces:**
- Produces: rotas `/termos`, `/privacidade` servidas por `(public)/(legal)`

- [ ] **Step 1: Criar `(public)/(legal)/layout.tsx`** (cópia do atual `(legal)/layout.tsx`)

```tsx
import { MainLayout } from "@/components/layout";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
        <div className="bg-surface border border-border rounded-2xl p-6 lg:p-10 shadow-sm">
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
```

**Nota:** este layout aninha um `MainLayout` dentro de `(public)/layout.tsx` que também é um `MainLayout`. Para evitar header/footer duplicados, o `(public)/(legal)/layout.tsx` **não** deve chamar `MainLayout` — apenas adiciona o wrapper visual:

```tsx
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <div className="bg-surface border border-border rounded-2xl p-6 lg:p-10 shadow-sm">
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mover páginas legais**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git mv "(legal)/termos" "(public)/(legal)/termos"
git mv "(legal)/privacidade" "(public)/(legal)/privacidade"
```

- [ ] **Step 3: Deletar layout e dir antigos**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git rm "(legal)/layout.tsx"
rmdir "(legal)"
```

- [ ] **Step 4: Verificar**

```bash
ls /home/tiago/workfolder/teachei-api/teachei-web/app/\(public\)/\(legal\)/
```

Esperado: `layout.tsx  termos/  privacidade/`

- [ ] **Step 5: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "feat: move (legal) para (public)/(legal) e corrige layout para não duplicar MainLayout"
```

---

## Task 7: Criar `(private)/layout.tsx` e mover páginas privadas ex-`(main)`

**Files:**
- Create: `teachei-web/app/(private)/layout.tsx`
- Move: `(main)/profile/`, `(main)/settings/`, `(main)/favorites/`, `(main)/messages/`, `(main)/my-intentions/`
- Delete: `app/(main)/layout.tsx` e dir vazio

**Interfaces:**
- Consumes: `AuthGuard` sem publicRoutes (Task 1), `MainLayout` sem auth (Task 2)
- Produces: grupo `(private)` servindo `/profile`, `/settings`, `/favorites`, `/messages`, `/my-intentions`

- [ ] **Step 1: Criar `app/(private)/layout.tsx`**

```tsx
import { type ReactNode } from "react";
import { AuthGuard } from "@/components/auth";
import { MainLayout } from "@/components/layout";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <MainLayout>{children}</MainLayout>
    </AuthGuard>
  );
}
```

- [ ] **Step 2: Mover páginas privadas de `(main)/`**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git mv "(main)/profile" "(private)/profile"
git mv "(main)/settings" "(private)/settings"
git mv "(main)/favorites" "(private)/favorites"
git mv "(main)/messages" "(private)/messages"
git mv "(main)/my-intentions" "(private)/my-intentions"
```

- [ ] **Step 3: Deletar `(main)/layout.tsx` e dir**

Após mover `contato/` (Task 3) e todas as páginas privadas, `(main)/` deve estar vazio exceto pelo layout:

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git rm "(main)/layout.tsx"
rmdir "(main)"
```

- [ ] **Step 4: Verificar**

```bash
ls /home/tiago/workfolder/teachei-api/teachei-web/app/\(private\)/
```

Esperado: `layout.tsx  profile/  settings/  favorites/  messages/  my-intentions/`

- [ ] **Step 5: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "feat: cria grupo (private) com AuthGuard+MainLayout e move páginas ex-(main)"
```

---

## Task 8: Mover `create/` para `(private)/create/` e remover `AuthGuard` redundante

**Files:**
- Move: `app/create/` → `app/(private)/create/`
- Modify: `teachei-web/app/(private)/create/layout.tsx` — remover `AuthGuard`

**Interfaces:**
- Consumes: `(private)/layout.tsx` já protege com AuthGuard (Task 7)
- Produces: rotas `/create`, `/create/vehicle`, `/create/specs`, `/create/review` servidas por `(private)`

- [ ] **Step 1: Mover `create/` para `(private)/`**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git mv create "(private)/create"
```

- [ ] **Step 2: Remover `AuthGuard` do `(private)/create/layout.tsx`**

Substituir o conteúdo completo de `teachei-web/app/(private)/create/layout.tsx` por:

```tsx
"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Car, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCreateIntentionStore } from "@/stores/create-intention-store";

const steps = [
  { id: 1, label: "Categoria", path: "/create" },
  { id: 2, label: "Veículo", path: "/create/vehicle" },
  { id: 3, label: "Detalhes", path: "/create/specs" },
  { id: 4, label: "Revisão", path: "/create/review" },
];

export default function CreateLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { reset } = useCreateIntentionStore();

  const currentStepIndex = steps.findIndex((s) => s.path === pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleBack = () => {
    if (currentStepIndex <= 0) {
      router.push("/feed");
    } else {
      router.push(steps[currentStepIndex - 1].path);
    }
  };

  const handleCancel = () => {
    reset();
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-surface border-b border-border">
        <div className="flex items-center h-16 px-4 lg:px-6">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} />
          </button>

          <Link href="/feed" className="flex items-center gap-2 text-primary font-extrabold text-xl tracking-tight ml-2">
            <Car size={28} />
            <span className="hidden sm:inline">TeAchei</span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted">
              Passo {currentStep} de {steps.length}
            </span>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
              aria-label="Cancelar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 lg:px-6">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div
                  className={cn(
                    "flex-1 h-1 rounded-full transition-colors",
                    index < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={cn(
                  "text-xs font-medium",
                  index < currentStep ? "text-primary" : "text-muted"
                )}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-6 max-w-2xl mx-auto">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verificar que `AuthGuard` foi removido de `create/layout.tsx`**

```bash
grep -n "AuthGuard" /home/tiago/workfolder/teachei-api/teachei-web/app/\(private\)/create/layout.tsx
```

Esperado: nenhum resultado.

- [ ] **Step 4: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "feat: move create/ para (private) e remove AuthGuard redundante do wizard layout"
```

---

## Task 9: Mover `assinatura/` e `intention/[id]/edit/` para `(private)/`

**Files:**
- Move: `app/assinatura/` → `app/(private)/assinatura/`
- Move: `app/intention/[id]/edit/` → `app/(private)/intention/[id]/edit/`
- Delete: dir vazio `app/intention/` (se `[id]/` ficou vazio após Task 4 e esta task)

**Interfaces:**
- Produces: rotas `/assinatura`, `/assinatura/sucesso`, `/assinatura/erro`, `/assinatura/pendente`, `/intention/[id]/edit` servidas por `(private)`

- [ ] **Step 1: Mover `assinatura/`**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

git mv assinatura "(private)/assinatura"
```

- [ ] **Step 2: Mover `intention/[id]/edit/`**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

mkdir -p "(private)/intention/[id]"
git mv "intention/[id]/edit" "(private)/intention/[id]/edit"
```

- [ ] **Step 3: Remover diretórios vazios de `intention/`**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web/app

# Verificar se intention/[id]/ está vazio (só tinha edit/ que foi movido)
ls "intention/[id]/"
# Se vazio:
rmdir "intention/[id]"
rmdir "intention"
```

- [ ] **Step 4: Verificar estrutura final de `(private)/`**

```bash
ls /home/tiago/workfolder/teachei-api/teachei-web/app/\(private\)/
```

Esperado: `layout.tsx  profile/  settings/  favorites/  messages/  my-intentions/  create/  assinatura/  intention/`

- [ ] **Step 5: Commit**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "feat: move assinatura/ e intention/[id]/edit para (private)"
```

---

## Task 10: Verificação final — build e checagem de rotas

**Files:** nenhum arquivo novo — apenas validação

- [ ] **Step 1: Verificar estrutura completa de `app/`**

```bash
find /home/tiago/workfolder/teachei-api/teachei-web/app -type d | grep -v "node_modules\|\.next\|api" | sort
```

Esperado (sem `api/`):
```
app/
app/(private)
app/(private)/assinatura
app/(private)/assinatura/erro
app/(private)/assinatura/pendente
app/(private)/assinatura/sucesso
app/(private)/create
app/(private)/create/review
app/(private)/create/specs
app/(private)/create/vehicle
app/(private)/favorites
app/(private)/intention
app/(private)/intention/[id]
app/(private)/intention/[id]/edit
app/(private)/messages
app/(private)/my-intentions
app/(private)/profile
app/(private)/settings
app/(public)
app/(public)/(auth)
app/(public)/(auth)/forgot-password
app/(public)/(auth)/login
app/(public)/(auth)/register
app/(public)/(auth)/role-select
app/(public)/(legal)
app/(public)/(legal)/privacidade
app/(public)/(legal)/termos
app/(public)/contato
app/(public)/feed
app/(public)/guias
app/(public)/guias/[slug]
app/(public)/intention
app/(public)/intention/[id]
app/(public)/profile
app/(public)/profile/[id]
app/(public)/sobre
app/(public)/user
app/(public)/user/[id]
```

- [ ] **Step 2: Confirmar que não há `PUBLIC_ROUTES` ou `AuthGuard` no `MainLayout`**

```bash
grep -n "PUBLIC_ROUTES\|AuthGuard" /home/tiago/workfolder/teachei-api/teachei-web/components/layout/main-layout.tsx
```

Esperado: nenhum resultado.

- [ ] **Step 3: Confirmar que `AuthGuard` é usado apenas em `(private)/layout.tsx`**

```bash
grep -rn "AuthGuard" /home/tiago/workfolder/teachei-api/teachei-web/app --include="*.tsx"
```

Esperado: apenas `app/(private)/layout.tsx`.

- [ ] **Step 4: Rodar o build**

```bash
cd /home/tiago/workfolder/teachei-api/teachei-web
npm run build
```

Esperado: build sem erros. Se houver erros de módulo não encontrado, verificar se algum arquivo ficou referenciando um caminho que não existe mais.

- [ ] **Step 5: Commit final**

```bash
cd /home/tiago/workfolder/teachei-api
git add -A
git commit -m "chore: verificação final — reorganização (public)/(private) concluída"
```
