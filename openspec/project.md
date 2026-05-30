# Project Context

## Purpose
TeAchei is an "inverted marketplace" where **buyers announce purchase intentions** (what they want to buy) rather than sellers posting what they have. This flips the traditional marketplace model, delivering qualified leads directly to sellers. The MVP focuses on **vehicles** (cars, motorcycles, trucks) with plans to expand to real estate and electronics.

## Tech Stack

### Backend
- **Language**: Java 17 with Spring Boot 3.3.x
- **Architecture**: Hexagonal (Ports & Adapters)
- **Databases**: 
  - PostgreSQL 16 (users, profiles, transactions)
  - Azure Cosmos DB (purchase intentions - flexible documents)
- **Security**: Spring Security + JWT (com.auth0:java-jwt)
- **External APIs**: FIPE (vehicle data), Mercado Pago (payments)

### Frontend
- **Web**: Next.js (SEO optimized)
- **Mobile**: Expo (React Native)

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Cloud**: Azure (AKS for production)
- **Local Dev**: Azurite (Cosmos DB emulator), PostgreSQL container

## Project Conventions

### Code Style
- Package naming: `com.teachei.api.*`
- Classes: PascalCase (e.g., `AnuncioService`)
- Methods/variables: camelCase (e.g., `criarAnuncio`)
- Constants: UPPER_SNAKE_CASE
- Use Lombok for boilerplate reduction
- Use MapStruct for entity/DTO mapping

### Architecture Patterns
- **Hexagonal Architecture**: Domain → Application (Ports) → Adapters
- **Domain Layer**: Pure POJOs, no framework annotations
- **Port Interfaces**: Define contracts in `application/ports/in` and `application/ports/out`
- **Adapters**: Implement ports in `adapter/in/web` and `adapter/out/persistence|external`

### Testing Strategy
- Unit tests for domain services (no mocks needed - pure logic)
- Integration tests for adapters (use test containers)
- Controller tests with MockMvc
- Minimum 80% coverage on domain layer

### Git Workflow
- Main branch: `main` (production-ready)
- Development: `develop`
- Features: `feature/<description>`
- Commits: Conventional commits (feat:, fix:, refactor:, docs:)

## Domain Context

### Key Concepts
- **Anúncio (Purchase Intention)**: A buyer's public declaration of what they want to purchase
- **Intenção de Compra**: Same as Anúncio - used interchangeably
- **Nicho**: Product category (VEICULO for MVP, expandable to IMOVEL, ELETRONICO)
- **Tipo**: Vehicle subtype (CARRO, MOTO, CAMINHAO)
- **FIPE**: Brazilian vehicle pricing reference table

### Business Rules
- **Free for buyers**: Intentions are published immediately without payment
- **Seller subscriptions**: Sellers pay a monthly/quarterly/annual subscription to view buyer contact info
- Intentions expire after 60 days from creation
- Multi-select allowed for anos (years) and cores (colors) - empty means "any"
- Profile contact info (WhatsApp) is mandatory for active intentions
- Non-subscribed sellers see only buyer's city/state location

### Subscription Plans
- **Individual (R$15/month)**: 30 days access, single payment
- **Trimestral (R$30/quarter)**: 90 days access, auto-renewal
- **Anual (R$90/year)**: 365 days access, auto-renewal

## Important Constraints
- Must support future niches without schema migrations (hence NoSQL for intentions)
- FIPE API may be unreliable - implement circuit breaker and fallback
- Payment webhooks must be idempotent
- JWT tokens: 7 days expiry (no refresh tokens for MVP)
- Intention expiry: 60 days from creation (automatic status change to EXPIRADO)

## External Dependencies
- **FIPE API**: https://deividfortuna.github.io/fipe/ (community) or official
- **Mercado Pago SDK**: Payment processing for Brazilian market
- **Azure Cosmos DB**: Document storage (Azurite for local dev)
