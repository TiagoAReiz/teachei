<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma"/>
</p>

<h1 align="center">
  TeAchei
</h1>

<p align="center">
  <strong>O marketplace invertido de veículos do Brasil</strong>
</p>

<p align="center">
  <em>Onde compradores anunciam o que querem — e vendedores respondem com ofertas reais.</em>
</p>

<p align="center">
  <a href="https://teachei-ten.vercel.app"><img src="https://img.shields.io/badge/Demo-teachei--ten.vercel.app-5B4CF5?style=for-the-badge&logo=vercel&logoColor=white" alt="Demo ao vivo"/></a>
  <a href="https://github.com/TiagoAReiz/teachei-api/actions/workflows/web-ci-cd.yml"><img src="https://github.com/TiagoAReiz/teachei-api/actions/workflows/web-ci-cd.yml/badge.svg" alt="CI"/></a>
</p>

<p align="center">
  <strong><a href="https://teachei-ten.vercel.app">Acesse a demo ao vivo →</a></strong>
</p>

<p align="center">
  <a href="#o-problema">O Problema</a> •
  <a href="#a-solução">A Solução</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#stack-tecnológica">Stack</a> •
  <a href="#arquitetura">Arquitetura</a> •
  <a href="#início-rápido">Início Rápido</a> •
  <a href="#deploy">Deploy</a>
</p>

---

## O Problema

No mercado tradicional de veículos:

- **Compradores** são bombardeados com anúncios irrelevantes
- **Vendedores** gastam tempo e dinheiro sem saber se há demanda real
- Marketplaces lucram com volume, não com conversão

> *"Eu sei exatamente o carro que quero. Por que preciso ficar buscando em centenas de anúncios?"*

---

## A Solução

**TeAchei inverte a lógica do marketplace:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   MARKETPLACE TRADICIONAL          TEACHEI (INVERTIDO)              │
│   ───────────────────────          ───────────────────              │
│                                                                     │
│   Vendedor ──────► Anúncio         Comprador ──────► Intenção      │
│                       │                                  │          │
│                       ▼                                  ▼          │
│   Comprador busca e filtra         Vendedor encontra                │
│   dezenas de opções                leads qualificados               │
│                       │                                  │          │
│                       ▼                                  ▼          │
│   Contato frio                     Contato direto                   │
│   (sem garantia de interesse)      via WhatsApp                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Como funciona

1. **Comprador publica uma intenção** → "Procuro Honda Civic 2019-2021, preto ou prata, até R$110k"
2. **Vendedores encontram compradores qualificados** → Feed de intenções com filtros
3. **Contato direto via WhatsApp** → Negociação direta, sem intermediários

---

## Screenshots

<p align="center">
  <img src="docs/screenshots/landing.png" alt="Landing page do TeAchei" width="800"/>
</p>

<p align="center">
  <img src="docs/screenshots/como-funciona.png" alt="Seção Como funciona" width="533"/>
</p>

---

## Stack Tecnológica

| Camada | Tecnologia | Propósito |
|--------|------------|-----------|
| **Framework** | Next.js 16 (App Router) | SSR, API Routes, Server Actions |
| **Banco de dados** | Supabase (PostgreSQL) | Dados relacionais gerenciados |
| **ORM** | Prisma 6 | Schema, migrations, queries tipadas |
| **Autenticação** | Google OAuth + JWT (jose) | Login social e tokens stateless |
| **Styling** | Tailwind CSS 4 | Design system responsivo |
| **State** | Zustand + TanStack Query | Estado global e cache de requisições |
| **Forms** | React Hook Form + Zod | Validação tipada |
| **Testes** | Vitest | Testes unitários |
| **Deploy** | Vercel | Hosting, CI/CD automático |

---

## Arquitetura

Toda a aplicação roda em um único projeto Next.js. A camada de backend é implementada com **API Routes** e **Server Actions**, sem servidor separado.

```
┌─────────────────────────────────────────────────────────────────────┐
│                           VERCEL                                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                     Next.js 16 (App Router)                   │   │
│  │                                                               │   │
│  │  ┌────────────────────┐   ┌────────────────────┐             │   │
│  │  │   Pages / UI       │   │  API Routes        │             │   │
│  │  │  app/(public)/     │   │  app/api/v1/       │             │   │
│  │  │  app/(private)/    │   │  (auth, anuncios,  │             │   │
│  │  │  app/(auth)/       │   │   favoritos,       │             │   │
│  │  │  app/(wizard)/     │   │   perfil, veiculos)│             │   │
│  │  └────────────────────┘   └────────┬───────────┘             │   │
│  │                                    │                          │   │
│  │  ┌────────────────────────────────▼────────────────────────┐ │   │
│  │  │                    Backend (backend/)                    │ │   │
│  │  │   auth/ │ anuncio/ │ favorito/ │ perfil/ │ veiculo/     │ │   │
│  │  └────────────────────────────────┬────────────────────────┘ │   │
│  │                                   │                           │   │
│  └───────────────────────────────────┼───────────────────────────┘  │
│                                      │                               │
└──────────────────────────────────────┼───────────────────────────────┘
                                       │
                          ┌────────────▼────────────┐
                          │       SUPABASE           │
                          │  PostgreSQL gerenciado   │
                          │  (Prisma como ORM)       │
                          └─────────────────────────┘
```

### Estrutura de diretórios

```
teachei-web/
├── app/
│   ├── (auth)/           # Login, registro, recuperação de senha
│   ├── (public)/         # Feed, intenção, perfil público, guias, termos/privacidade
│   ├── (private)/        # Área autenticada: favoritos, minhas intenções, perfil, assinatura
│   ├── (wizard)/create/  # Wizard de criação de intenção
│   └── api/v1/           # API Routes (auth, anuncios, favoritos, perfil, veiculos/FIPE)
│
├── backend/              # Lógica de servidor (arquitetura hexagonal: domain, ports, use cases)
│   ├── auth/
│   ├── anuncio/
│   ├── favorito/
│   ├── perfil/
│   ├── shared/
│   └── veiculo/
│
├── components/           # Componentes React reutilizáveis
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e clientes (supabase, prisma)
├── stores/               # Estado global (Zustand)
├── types/                # Tipos TypeScript
├── prisma/               # Schema do banco (Prisma)
└── supabase/migrations/  # SQL de criação do schema
```

---

## Início Rápido

### Pré-requisitos

- **Node.js 20+**
- Conta no [Supabase](https://supabase.com) (banco de dados)
- Conta no [Vercel](https://vercel.com) (deploy)
- Credenciais do [Google OAuth](https://console.cloud.google.com)

### 1. Clone o repositório

```bash
git clone https://github.com/TiagoAReiz/teachei-api.git
cd teachei-api/teachei-web
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha as variáveis:

```env
# Banco de dados (Supabase Postgres, usado pelo Prisma)
POSTGRES_PRISMA_URL="postgresql://..."        # pooler (porta 6543)
POSTGRES_URL_NON_POOLING="postgresql://..."   # conexão direta (porta 5432), usada pelo db push

# Supabase (server-side)
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."

# JWT (mínimo 32 caracteres)
JWT_SECRET="..."

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="..."

# URLs públicas
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL=""   # vazio = usa as API Routes do próprio app
```

### 4. Sincronize o banco de dados

```bash
npm run db:push
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

App disponível em `http://localhost:3000`

---

## Deploy

O deploy é feito automaticamente na **Vercel** a cada push na branch `main`.

- **Produção:** https://teachei-ten.vercel.app (redireciona para o domínio `teachei.shop`)
- **CI (GitHub Actions):** lint, testes e build em cada PR que altera `teachei-web/`

### Variáveis de ambiente na Vercel

Configure todas as variáveis listadas acima no painel da Vercel em **Settings → Environment Variables**.

### Build

O build apenas gera o client Prisma e compila o Next.js — não acessa o banco:

```bash
prisma generate && next build
```

Alterações no `prisma/schema.prisma` são aplicadas manualmente com `npm run db:push`
(usa `POSTGRES_URL_NON_POOLING`; o pooler em modo transação não suporta `db push`).

---

## Testes

```bash
# Rodar testes
npm test

# Testes com watch
npm run test:watch

# Cobertura
npm run test:coverage
```

---

## Roadmap

### MVP (Atual)
- [x] Autenticação Google OAuth
- [x] CRUD de intenções de compra
- [x] Integração FIPE API
- [x] Integração Mercado Pago
- [x] Filtros facetados no feed
- [x] Perfil público do usuário
- [x] Paginação ("Carregar mais")
- [x] Deploy Vercel + Supabase

### v1.1
- [ ] Notificações push
- [ ] Chat in-app
- [ ] Sistema de avaliações
- [ ] Busca geolocalizada

### Futuro
- [ ] Expansão: Imóveis
- [ ] Expansão: Eletrônicos
- [ ] Machine Learning: Match comprador-vendedor

---

## Licença

Este projeto está sob a licença MIT.

---

<p align="center">
  <strong>TeAchei</strong> — Conectando compradores e vendedores de forma inteligente
</p>

<p align="center">
  Feito com amor no Brasil
</p>
