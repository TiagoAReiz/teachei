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
  <a href="#-o-problema">O Problema</a> •
  <a href="#-a-solução">A Solução</a> •
  <a href="#-stack-tecnológica">Stack</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-início-rápido">Início Rápido</a> •
  <a href="#-deploy">Deploy</a>
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
│  │  │  app/(main)/       │   │  app/api/          │             │   │
│  │  │  app/(auth)/       │   │  (auth, anuncios,  │             │   │
│  │  │  app/feed/         │   │   perfil, fipe,    │             │   │
│  │  │  app/profile/      │   │   pagamentos...)   │             │   │
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
│   ├── (auth)/           # Páginas de login e registro
│   ├── (main)/           # Layout principal autenticado
│   ├── (legal)/          # Páginas de termos e privacidade
│   ├── api/              # API Routes (endpoints REST)
│   ├── feed/             # Feed de intenções
│   ├── profile/          # Perfil público
│   ├── create/           # Criar intenção
│   └── assinatura/       # Planos e pagamentos
│
├── backend/              # Lógica de servidor (services, repositórios)
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
└── prisma/               # Schema e migrations do banco
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
git clone https://github.com/seu-usuario/TeAchei.git
cd TeAchei/teachei-web
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
# Supabase
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# JWT
JWT_SECRET="..."

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN="..."
```

### 4. Sincronize o banco de dados

```bash
npx prisma db push
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

App disponível em `http://localhost:3000`

---

## Deploy

O deploy é feito automaticamente na **Vercel** a cada push na branch `main`.

### Variáveis de ambiente na Vercel

Configure todas as variáveis listadas acima no painel da Vercel em **Settings → Environment Variables**.

### Build

O script de build aplica as migrations e gera o client Prisma antes de compilar:

```bash
prisma generate && prisma db push --accept-data-loss && next build
```

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
