# Varredura crítica — Backend TeAchei (Spring Boot)

Data: 2026-05-26 · Escopo: `TeAchei/src/main/java` + configs + decisões de arquitetura.
Severidade: **P0** = correção/segurança que afeta produção · **P1** = arquitetura/risco estrutural · **P2** = qualidade/manutenção.

---

## P0 — Correção e segurança

### P0.1 — Idempotência do webhook de pagamento está quebrada (transação nunca é persistida)
`ProcessarPagamentoUseCaseImpl` (`application/usecase/ProcessarPagamentoUseCaseImpl.java:52`) usa
`transacaoRepository.buscarPorPaymentId(...)` como guard de idempotência, **mas nenhum lugar do código chama `transacaoRepository.salvar(...)`** (confirmado por varredura: o único uso de `transacaoRepository` é o `buscarPorPaymentId`; o método `salvar` do port em `application/ports/out/TransacaoRepositoryPort.java:22` é código morto).

Consequências:
- O guard de idempotência **nunca dispara** → todo reenvio de webhook do Mercado Pago reprocessa a assinatura. O `project.md` exige explicitamente "Payment webhooks must be idempotent".
- Nenhum registro de transação é gravado → o comentário em `ExcluirContaUseCaseImpl.java:11` ("Payment transactions are preserved for legal requirements (5 years)") é falso; não há nada a preservar.

**Correção:** ao aprovar o pagamento (`ProcessarPagamentoUseCaseImpl.java:119-123`), persistir uma `Transacao` (via `Transacao.criar(...)`) na mesma operação que ativa a assinatura, antes/junto do `assinaturaRepository.salvar`.

### P0.2 — Busca de anúncios: paginação e total incorretos quando há filtro
`AnuncioCosmosAdapter.buscar(...)` (`adapter/out/persistence/cosmosdb/AnuncioCosmosAdapter.java:63-140`) pagina **no banco** (`findByStatusPaginated(status, offset, tamanho)` em `repository/AnuncioCosmosRepository.java:19`) e só **depois** aplica todos os filtros (tipo, marca, modelo, ano, preço, km, texto, opcionais, cidade, estado) **em memória** sobre aquela página.

Consequências:
- Com qualquer filtro ativo, a página retorna *menos* que `tamanho` itens (alguns dos 20 são descartados pós-paginação) e **registros válidos nas páginas seguintes nunca aparecem**.
- `total` vem de `repository.countByStatus(status)` (`:137`) — conta **todos** por status, ignorando os filtros. Logo `totalPaginas` e o contador da UI ficam errados.
- Comentário no próprio código admite: "Get all active intentions and filter in memory / For production, implement proper Cosmos DB query". À medida que a base cresce isto também vira full-scan caro.

**Correção:** mover os filtros para a query Cosmos (`@Query` com predicados/parametrização) e contar com os mesmos filtros, ou — se manter filtro em memória no MVP — buscar o conjunto filtrável e paginar/contar **após** filtrar (não antes).

### P0.3 — Toda a cobrança de assinatura está desativada por código morto hardcoded
`AnuncioController` força `boolean assinaturaAtiva = true` e `boolean ocultarContato = false` em 3 pontos (`:154`, `:163`, `:218-219`, `:245-246`), com o código real de verificação comentado. `verificarAssinaturaUseCase` é injetado mas nunca chamado.

Consequências:
- O contato (WhatsApp) do comprador é exposto a **qualquer** requisição — inclusive não autenticada, já que `GET /v1/anuncios/**` é `permitAll` (`SecurityConfig.java:59`). Isso contradiz a regra de negócio "Non-subscribed sellers see only buyer's city/state" e tem implicações de privacidade/LGPD.
- Toda a infraestrutura de assinatura vira código morto em produção.

**Correção:** trocar o comentário por uma *feature flag* real (`@Value("${app.subscription.enabled:false}")`) e reativar a verificação, ou remover o caminho se a decisão é mesmo "grátis". Decisão de produto disfarçada de comentário é dívida perigosa.

### P0.4 — CORS libera `localhost` em produção e ignora a config existente
`SecurityConfig.corsConfigurationSource()` (`config/security/SecurityConfig.java:80-84`) faz hardcode de `http://localhost:*` e `http://127.0.0.1:*` em **todos** os perfis. Além disso injeta `@Value("${app.cors-origins:}") corsOrigins` (`:37-38`) que **nunca é lido** — a config `app.cors-origins` (`application.yml:82`) é morta.

**Correção:** origens vindas de config por perfil; em `prod`, apenas `https://teachei.shop`. Remover o campo morto ou usá-lo de fato.

### P0.5 — Comparação de assinatura HMAC vulnerável a timing attack
`MercadoPagoWebhookValidator.validateSignature` (`adapter/out/external/mercadopago/MercadoPagoWebhookValidator.java:77`) compara com `calculatedSignature.equals(v1)` (String.equals, curto-circuito → não constante no tempo).

**Correção:** `MessageDigest.isEqual(calculated.getBytes(UTF_8), v1.getBytes(UTF_8))`.

### P0.6 — Exclusão de conta sem atomicidade entre 4 armazenamentos
`ExcluirContaUseCaseImpl.executar` (`application/usecase/ExcluirContaUseCaseImpl.java:35-68`) apaga, em sequência e sem transação, Blob → Cosmos (anúncios) → Postgres (assinatura, perfil, usuário). **Não existe `@Transactional` em nenhum lugar do projeto** (varredura confirmou zero ocorrências).

Consequências: falha no meio deixa conta meio-apagada (ex.: anúncios sumiram mas usuário permanece, ou vice-versa). Para Postgres dá para envolver as 3 deleções relacionais numa transação; Cosmos/Blob exigem compensação/ordem deliberada (apagar relacional por último, ou registrar passo pendente).

> Observação geral: a ausência total de `@Transactional` também afeta `RegistrarUsuarioUseCaseImpl` (salva usuário + perfil em Postgres em duas chamadas — `:42` e `:49`) e `AutenticarGoogleUseCaseImpl`. Em falha parcial, usuário sem perfil.

### P0.7 — JWT de 1 hora sem refresh token (config diverge da spec)
`application.yml:66` → `expiration-hours: ${JWT_EXPIRATION_HOURS:1}`; `application-prod.yml` não sobrescreve. O `project.md:80` diz "JWT tokens: 7 days expiry (no refresh tokens)". Com 1h e sem refresh, o usuário é deslogado de hora em hora. Decidir o valor real e alinhar doc + default.

---

## P1 — Arquitetura

### P1.1 — Organização horizontal (por camada) dificulta o "view" por entidade
Hoje o pacote é fatiado por camada técnica (`adapter/`, `application/`, `domain/`, `config/`), e cada uma agrega *todas* as entidades. Para entender "anúncio" é preciso abrir 7+ pastas distantes. Isso é exatamente o oposto do que você pediu (módulo por entidade). Plano concreto na seção final.

### P1.2 — `BeanConfiguration` é fiação manual de 17 use cases (~170 linhas)
`config/BeanConfiguration.java` declara `@Bean` para cada use case à mão. Os `*Impl` são POJOs sem anotação Spring de propósito (pureza hexagonal), mas o custo é um arquivo central que cresce a cada feature e acopla tudo. Alternativas: anotar os `*Impl` com `@Service` (abre mão de um pouco de pureza, ganha simplicidade), ou ao menos quebrar a config por módulo (`AnuncioConfig`, `AssinaturaConfig`...) quando modularizar.

### P1.3 — Stack reativa inteira (WebFlux/Reactor/Netty) só para um cliente HTTP
`pom.xml:52-55` traz `spring-boot-starter-webflux` junto do `-web` (servlet/Tomcat). O único uso é o `WebClient` em `WebClientConfiguration.java` para FIPE/Mercado Pago. Em Spring Boot 3.2+ dá para usar `RestClient` (API síncrona, sem reator), removendo a dependência inteira e a ambiguidade de dois servidores web no classpath.

### P1.4 — Filtragem de domínio dentro do adapter de persistência
Toda a lógica de filtro/ordenção em `AnuncioCosmosAdapter` (P0.2) é regra de consulta misturada com I/O. Ao modularizar, isolar a estratégia de busca para conseguir trocar "memória → query Cosmos" sem tocar no controller.

### P1.5 — Documentação de stack desatualizada
`openspec/project.md:9-10` diz "Java 21 / Spring Boot 4.x"; o real é **Java 17 / Spring Boot 3.3.6** (`pom.xml:8,19`). Também o `AGENTS.md` está praticamente vazio (1 linha). Doc que mente custa caro em onboarding e em decisões de dependência.

---

## P2 — Qualidade e manutenção

- **Rate limiting com memória ilimitada** — `RateLimitingFilter` (`config/security/RateLimitingFilter.java:31-32`) guarda um `Bucket` por IP em `ConcurrentHashMap` que **nunca expira**. Atacante rotacionando `X-Forwarded-For` (cabeçalho confiado cegamente em `:95-97`) cria buckets infinitos → vazamento de memória/DoS, e ainda *bypassa* o próprio rate limit. Usar cache com TTL/tamanho máximo (já há Caffeine no projeto) e só confiar em `X-Forwarded-For` atrás de proxy conhecido.
- **Logs ruidosos e potencialmente sensíveis no webhook** — `PagamentoController.webhook` loga `Request body: {}` inteiro (`:47`) e há blocos `=== ... ===` em nível INFO. Payload de pagamento em log é dado sensível; baixar para DEBUG e omitir corpo.
- **Webhook sempre devolve 200, mesmo em erro de assinatura inválida?** — Não: assinatura inválida devolve 401 (`:117-120`) e erros de processamento devolvem 200 de propósito (`:135-138`, para evitar retries). OK, mas combinado com P0.1 (sem idempotência) qualquer retry duplica efeito. Resolver P0.1 destrava isto.
- **`GlobalExceptionHandler` (243 linhas) — sólido, mas repetitivo.** Não vaza stack/detalhe interno (o handler genérico em `:227` devolve mensagem fixa). Cada handler remonta `ErrorResponse` à mão; extrair um helper `build(status, code, msg, req)` reduz ~60% do arquivo. `handleIllegalArgument` (`:46-57`) ecoa `ex.getMessage()` direto — revisar para não expor mensagens internas.
- **`AnuncioController.listar` com 16 `@RequestParam`** e aliases legados (`tipo`/`tipoVeiculo`, `page`/`pagina`, `precoMinimo`/`precoMin`...) — `:87-137`. Encapsular num `@ModelAttribute FiltroQuery` com os aliases resolvidos lá, enxugando o controller e centralizando a compatibilidade.
- **Migração de dados no startup** — `config/CosmosDataMigration.java` (verificar se roda em todo boot); migração acoplada ao ciclo de subida da app é risco em múltiplas réplicas (AKS). Idealmente idempotente e/ou disparada por flag.
- **Cobertura de teste rasa** — só 4 classes de teste (`TeAcheiApplicationTests`, filtros de anúncio, veículo, conversor). Nenhum teste para webhook de pagamento, idempotência, exclusão de conta ou os filtros do `AnuncioCosmosAdapter` — justamente os pontos P0. A spec pede 80% no domínio.
- **`@SuppressWarnings("unchecked")` no parse manual do body do webhook** (`PagamentoController.java:81`) — casting de `Map<String,Object>` frágil; um DTO desserializado seria mais seguro.

---

## Plano de modularização — "um módulo por entidade"

Meta: passar do fatiamento **horizontal** (por camada) para **vertical** (por entidade/feature). Cada módulo carrega sua própria fatia das 3 camadas hexagonais; o que é transversal vai para `shared/`.

### Estrutura-alvo

```
com.teachei.api/
├── anuncio/
│   ├── web/         AnuncioController, dto/{request,response}, mappers de DTO
│   ├── application/ ports/{in,out}, usecase/* (Criar/Atualizar/Excluir/Buscar/Finalizar/Filtros)
│   ├── domain/      Anuncio, VeiculoInfo, ContatoInfo, OpcionalVeiculo, StatusAnuncio,
│   │                OrdemAnuncio, TipoVeiculo, Nicho, AnuncioService, exceptions próprias
│   └── persistence/ cosmosdb/{AnuncioCosmosAdapter, AnuncioDocument, mapper, repository}
├── perfil/
│   ├── web/         PerfilController, dto
│   ├── application/ ports + GerenciarPerfilUseCase(Impl)
│   ├── domain/      Perfil
│   └── persistence/ postgres/{PerfilJpaAdapter, PerfilEntity, mapper, repository}
├── usuario/  (ou auth/)
│   ├── web/         AuthController, dto (Login/Registro/Google/AlterarSenha)
│   ├── application/ Registrar/Autenticar/AutenticarGoogle/AlterarSenha/ExcluirConta
│   ├── domain/      Usuario
│   └── persistence/ postgres/{UsuarioJpaAdapter, UsuarioEntity, mapper, repository}
│   └── external/    google/GoogleAuthAdapter
├── assinatura/
│   ├── web/         AssinaturaController, dto
│   ├── application/ Criar/Cancelar/Verificar/BuscarPlanos
│   ├── domain/      Assinatura, PlanoAssinatura, StatusAssinatura
│   └── persistence/ postgres/{AssinaturaJpaAdapter, AssinaturaEntity, mapper, repository}
├── pagamento/
│   ├── web/         PagamentoController (webhook)
│   ├── application/ ProcessarPagamentoUseCase, ports (Pagamento, Transacao)
│   ├── domain/      StatusPagamento, Transacao
│   ├── persistence/ postgres/{TransacaoJpaAdapter, TransacaoPagamentoEntity, mapper, repository}
│   └── external/    mercadopago/{Adapter, Client, WebhookValidator}
├── veiculo/
│   ├── web/         VeiculoController, dto
│   ├── application/ BuscarVeiculos + VeiculoDataPort
│   ├── domain/      VersaoInfo
│   └── external/    fipe/{FipeAdapter, FipeClient}
└── shared/
    ├── security/    SecurityConfig, Jwt*, CustomUserDetailsService, RateLimitingFilter,
    │                SecurityHeadersFilter, CurrentUser, BcryptPasswordEncoderAdapter, PasswordEncoderPort
    ├── web/         GlobalExceptionHandler, ErrorResponse, PaginaResponse
    ├── storage/     BlobStorageAdapter + BlobStoragePort   (usado por perfil, anuncio, usuario)
    ├── config/      Cosmos/Cache/WebClient/WebMvc/SubscriptionConfig/converters
    └── domain/      DomainException (exception base)
```

### Decisões / pontos de atenção

- **`shared/` é o destino de tudo que é cross-cutting**: segurança/JWT, CORS, exception handler global + `ErrorResponse`/`PaginaResponse`, `BlobStorage` (port + adapter, usado por 3 módulos), configs de infraestrutura e a `DomainException` base.
- **Dependências entre módulos só via *ports* (interfaces `in`/`out`)**, nunca entre adapters. Regra a impor: `anuncio.persistence` não pode importar `assinatura.*`.
- **Ciclos prováveis a vigiar:**
  - `assinatura ↔ pagamento`: `pagamento` ativa a `assinatura`. Resolver com `pagamento` dependendo de um port `AtivarAssinaturaPort` exposto por `assinatura` (seta única, sem ciclo).
  - `anuncio → assinatura`: o controller de anúncio chama `VerificarAssinaturaUseCase` (quando P0.3 for reativado). Manter como dependência de port `in` de `assinatura`; não mover a verificação para dentro de `anuncio`.
  - `ExcluirConta` toca perfil, anúncio, assinatura, blob: **fica em `usuario/`** e orquestra os ports `out` dos outros módulos (é o agregador natural do ciclo de vida da conta).
- **`TipoVeiculo`/`Nicho`**: usados por `anuncio` e `veiculo`. Começam em `anuncio.domain`; se `veiculo` precisar, promover só esses enums para `shared/domain`. Não promova tudo "por via das dúvidas".
- **`BeanConfiguration` quebra junto** em uma `@Configuration` por módulo (`AnuncioBeans`, `AssinaturaBeans`...), eliminando o arquivo central de 170 linhas (resolve P1.2).
- **Como fazer com segurança:** é um *move/rename* puro de pacotes — sem mudança de lógica. Faça módulo a módulo, compilando entre cada um, e use a suíte de testes como rede (depois de ampliá-la, ver P2). A IDE faz o "Move to package" com atualização de imports.
- **Opcional — multi-módulo Maven**: a estrutura acima é por pacotes (1 artefato). Só evolua para múltiplos artefatos Maven se quiser *forçar* fisicamente as fronteiras (impede import indevido em tempo de compilação). Para o estágio atual, pacotes + disciplina de port resolvem; multi-módulo Maven adiciona atrito de build sem ganho proporcional agora.

### Sequência sugerida
1. Criar `shared/` e mover segurança/config/exception/blob (base de tudo).
2. Migrar `veiculo/` e `pagamento/` (mais isolados) para validar o padrão.
3. Migrar `anuncio/`, `perfil/`, `assinatura/`, `usuario/`.
4. Quebrar `BeanConfiguration` por módulo.
5. **Antes ou em paralelo**, corrigir os P0 — alguns (P0.1, P0.2) ficam mais fáceis de testar já dentro do módulo dono.
