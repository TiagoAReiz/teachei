# Plano de modularização do backend — "um módulo por entidade"

Status: **plano, não executado.** Pré-requisito: os fixes P0 já estão na branch `fix/p0-backend` (commit `a7616ca`).
Meta: migrar de organização **horizontal** (por camada: `adapter/`, `application/`, `domain/`, `config/`) para **vertical** (por entidade), mantendo a arquitetura hexagonal *dentro* de cada módulo. **Sem mudança de lógica** — é refactor de movimentação de pacotes + ajuste de imports.

Base package: `com.teachei.api`.

---

## 1. Estrutura-alvo

```
com.teachei.api/
├── TeAcheiApplication.java          (raiz — permanece)
├── anuncio/
│   ├── web/        controller + dto/{request,response}
│   ├── application/ ports/{in,out} + usecase
│   ├── domain/     modelos + AnuncioService + exceptions próprias
│   └── persistence/ adapter Cosmos + document + mapper + repository
├── perfil/
├── usuario/        (inclui auth + Google + exclusão de conta)
├── assinatura/
├── pagamento/
├── veiculo/        (FIPE)
├── legal/          (endpoints de termos/legal)
└── shared/
    ├── security/   JWT, SecurityConfig, filtros, CurrentUser, encoder
    ├── web/        GlobalExceptionHandler, ErrorResponse, PaginaResponse, conversor
    ├── storage/    BlobStorage (port + adapter)
    ├── config/     Cosmos, Cache, WebClient, WebMvc, migração
    └── domain/     DomainException (base) + TipoVeiculo (enum compartilhado)
```

---

## 2. Mapeamento completo arquivo → módulo

Origem relativa a `com/teachei/api/`. Destino é o pacote-alvo (a classe não muda, só o `package`/imports).

### → `anuncio/`
| Origem | Destino |
|---|---|
| `adapter/in/web/controller/AnuncioController.java` | `anuncio/web/` |
| `adapter/in/web/dto/request/CriarAnuncioRequest.java` | `anuncio/web/dto/request/` |
| `adapter/in/web/dto/request/AtualizarAnuncioRequest.java` | `anuncio/web/dto/request/` |
| `adapter/in/web/dto/response/AnuncioResponse.java` | `anuncio/web/dto/response/` |
| `adapter/in/web/dto/response/FiltrosDisponiveisResponse.java` | `anuncio/web/dto/response/` |
| `application/ports/in/CriarAnuncioUseCase.java` | `anuncio/application/ports/in/` |
| `application/ports/in/AtualizarAnuncioUseCase.java` | `anuncio/application/ports/in/` |
| `application/ports/in/ExcluirAnuncioUseCase.java` | `anuncio/application/ports/in/` |
| `application/ports/in/FinalizarAnuncioUseCase.java` | `anuncio/application/ports/in/` |
| `application/ports/in/BuscarAnunciosUseCase.java` | `anuncio/application/ports/in/` |
| `application/ports/in/BuscarFiltrosDisponiveisUseCase.java` | `anuncio/application/ports/in/` |
| `application/ports/out/AnuncioRepositoryPort.java` | `anuncio/application/ports/out/` |
| `application/usecase/CriarAnuncioUseCaseImpl.java` | `anuncio/application/usecase/` |
| `application/usecase/AtualizarAnuncioUseCaseImpl.java` | `anuncio/application/usecase/` |
| `application/usecase/ExcluirAnuncioUseCaseImpl.java` | `anuncio/application/usecase/` |
| `application/usecase/FinalizarAnuncioUseCaseImpl.java` | `anuncio/application/usecase/` |
| `application/usecase/BuscarAnunciosUseCaseImpl.java` | `anuncio/application/usecase/` |
| `application/usecase/BuscarFiltrosDisponiveisUseCaseImpl.java` | `anuncio/application/usecase/` |
| `domain/service/AnuncioService.java` | `anuncio/domain/` |
| `domain/model/Anuncio.java` | `anuncio/domain/` |
| `domain/model/VeiculoInfo.java` | `anuncio/domain/` |
| `domain/model/ContatoInfo.java` | `anuncio/domain/` |
| `domain/model/OpcionalVeiculo.java` | `anuncio/domain/` |
| `domain/model/VersaoInfo.java` | `anuncio/domain/` (só anuncio usa) |
| `domain/model/Nicho.java` | `anuncio/domain/` |
| `domain/model/StatusAnuncio.java` | `anuncio/domain/` |
| `domain/model/OrdemAnuncio.java` | `anuncio/domain/` |
| `domain/exception/AnuncioInvalidoException.java` | `anuncio/domain/exception/` |
| `domain/exception/AnuncioNaoEncontradoException.java` | `anuncio/domain/exception/` |
| `adapter/out/persistence/cosmosdb/AnuncioCosmosAdapter.java` | `anuncio/persistence/` |
| `adapter/out/persistence/cosmosdb/document/AnuncioDocument.java` | `anuncio/persistence/document/` |
| `adapter/out/persistence/cosmosdb/mapper/AnuncioDocumentMapper.java` | `anuncio/persistence/mapper/` |
| `adapter/out/persistence/cosmosdb/repository/AnuncioCosmosRepository.java` | `anuncio/persistence/repository/` |

### → `perfil/`
| Origem | Destino |
|---|---|
| `adapter/in/web/controller/PerfilController.java` | `perfil/web/` |
| `adapter/in/web/dto/request/AtualizarPerfilRequest.java` | `perfil/web/dto/request/` |
| `adapter/in/web/dto/response/PerfilResponse.java` | `perfil/web/dto/response/` |
| `adapter/in/web/dto/response/PerfilPublicoResponse.java` | `perfil/web/dto/response/` |
| `application/ports/in/GerenciarPerfilUseCase.java` | `perfil/application/ports/in/` |
| `application/ports/out/PerfilRepositoryPort.java` | `perfil/application/ports/out/` |
| `application/usecase/GerenciarPerfilUseCaseImpl.java` | `perfil/application/usecase/` |
| `domain/model/Perfil.java` | `perfil/domain/` |
| `adapter/out/persistence/postgres/PerfilJpaAdapter.java` | `perfil/persistence/` |
| `adapter/out/persistence/postgres/entity/PerfilEntity.java` | `perfil/persistence/entity/` |
| `adapter/out/persistence/postgres/mapper/PerfilMapper.java` | `perfil/persistence/mapper/` |
| `adapter/out/persistence/postgres/repository/PerfilJpaRepository.java` | `perfil/persistence/repository/` |

### → `usuario/` (auth + conta)
| Origem | Destino |
|---|---|
| `adapter/in/web/controller/AuthController.java` | `usuario/web/` |
| `adapter/in/web/dto/request/LoginRequest.java` | `usuario/web/dto/request/` |
| `adapter/in/web/dto/request/RegistroRequest.java` | `usuario/web/dto/request/` |
| `adapter/in/web/dto/request/GoogleAuthRequest.java` | `usuario/web/dto/request/` |
| `adapter/in/web/dto/request/AlterarSenhaRequest.java` | `usuario/web/dto/request/` |
| `adapter/in/web/dto/response/AuthResponse.java` | `usuario/web/dto/response/` |
| `application/ports/in/RegistrarUsuarioUseCase.java` | `usuario/application/ports/in/` |
| `application/ports/in/AutenticarUsuarioUseCase.java` | `usuario/application/ports/in/` |
| `application/ports/in/AutenticarGoogleUseCase.java` | `usuario/application/ports/in/` |
| `application/ports/in/AlterarSenhaUseCase.java` | `usuario/application/ports/in/` |
| `application/ports/in/ExcluirContaUseCase.java` | `usuario/application/ports/in/` |
| `application/ports/out/UsuarioRepositoryPort.java` | `usuario/application/ports/out/` |
| `application/ports/out/GoogleAuthPort.java` | `usuario/application/ports/out/` |
| `application/usecase/RegistrarUsuarioUseCaseImpl.java` | `usuario/application/usecase/` |
| `application/usecase/AutenticarUsuarioUseCaseImpl.java` | `usuario/application/usecase/` |
| `application/usecase/AutenticarGoogleUseCaseImpl.java` | `usuario/application/usecase/` |
| `application/usecase/AlterarSenhaUseCaseImpl.java` | `usuario/application/usecase/` |
| `application/usecase/ExcluirContaUseCaseImpl.java` | `usuario/application/usecase/` |
| `domain/model/Usuario.java` | `usuario/domain/` |
| `domain/exception/EmailJaCadastradoException.java` | `usuario/domain/exception/` |
| `domain/exception/CredenciaisInvalidasException.java` | `usuario/domain/exception/` |
| `domain/exception/UsuarioNaoEncontradoException.java` | `usuario/domain/exception/` |
| `adapter/out/persistence/postgres/UsuarioJpaAdapter.java` | `usuario/persistence/` |
| `adapter/out/persistence/postgres/entity/UsuarioEntity.java` | `usuario/persistence/entity/` |
| `adapter/out/persistence/postgres/mapper/UsuarioMapper.java` | `usuario/persistence/mapper/` |
| `adapter/out/persistence/postgres/repository/UsuarioJpaRepository.java` | `usuario/persistence/repository/` |
| `adapter/out/external/google/GoogleAuthAdapter.java` | `usuario/external/google/` |

### → `assinatura/`
| Origem | Destino |
|---|---|
| `adapter/in/web/controller/AssinaturaController.java` | `assinatura/web/` |
| `adapter/in/web/dto/request/CriarAssinaturaRequest.java` | `assinatura/web/dto/request/` |
| `adapter/in/web/dto/response/AssinaturaResponse.java` | `assinatura/web/dto/response/` |
| `adapter/in/web/dto/response/AssinaturaPreferenciaResponse.java` | `assinatura/web/dto/response/` |
| `adapter/in/web/dto/response/PlanoResponse.java` | `assinatura/web/dto/response/` |
| `application/ports/in/CriarAssinaturaUseCase.java` | `assinatura/application/ports/in/` |
| `application/ports/in/CancelarAssinaturaUseCase.java` | `assinatura/application/ports/in/` |
| `application/ports/in/VerificarAssinaturaUseCase.java` | `assinatura/application/ports/in/` |
| `application/ports/in/BuscarPlanosUseCase.java` | `assinatura/application/ports/in/` |
| `application/ports/out/AssinaturaRepositoryPort.java` | `assinatura/application/ports/out/` |
| `application/usecase/CriarAssinaturaUseCaseImpl.java` | `assinatura/application/usecase/` |
| `application/usecase/CancelarAssinaturaUseCaseImpl.java` | `assinatura/application/usecase/` |
| `application/usecase/VerificarAssinaturaUseCaseImpl.java` | `assinatura/application/usecase/` |
| `application/usecase/BuscarPlanosUseCaseImpl.java` | `assinatura/application/usecase/` |
| `domain/model/Assinatura.java` | `assinatura/domain/` |
| `domain/model/PlanoAssinatura.java` | `assinatura/domain/` |
| `domain/model/StatusAssinatura.java` | `assinatura/domain/` |
| `config/SubscriptionConfig.java` | `assinatura/config/` |
| `adapter/out/persistence/postgres/AssinaturaJpaAdapter.java` | `assinatura/persistence/` |
| `adapter/out/persistence/postgres/entity/AssinaturaEntity.java` | `assinatura/persistence/entity/` |
| `adapter/out/persistence/postgres/mapper/AssinaturaMapper.java` | `assinatura/persistence/mapper/` |
| `adapter/out/persistence/postgres/repository/AssinaturaJpaRepository.java` | `assinatura/persistence/repository/` |

### → `pagamento/`
| Origem | Destino |
|---|---|
| `adapter/in/web/controller/PagamentoController.java` | `pagamento/web/` |
| `application/ports/in/ProcessarPagamentoUseCase.java` | `pagamento/application/ports/in/` |
| `application/ports/out/PagamentoPort.java` | `pagamento/application/ports/out/` |
| `application/ports/out/TransacaoRepositoryPort.java` | `pagamento/application/ports/out/` |
| `application/usecase/ProcessarPagamentoUseCaseImpl.java` | `pagamento/application/usecase/` |
| `domain/model/StatusPagamento.java` | `pagamento/domain/` |
| `domain/exception/PagamentoException.java` | `pagamento/domain/exception/` |
| `adapter/out/external/mercadopago/MercadoPagoAdapter.java` | `pagamento/external/mercadopago/` |
| `adapter/out/external/mercadopago/MercadoPagoClient.java` | `pagamento/external/mercadopago/` |
| `adapter/out/external/mercadopago/MercadoPagoWebhookValidator.java` | `pagamento/external/mercadopago/` |
| `adapter/out/persistence/postgres/TransacaoJpaAdapter.java` | `pagamento/persistence/` |
| `adapter/out/persistence/postgres/entity/TransacaoPagamentoEntity.java` | `pagamento/persistence/entity/` |
| `adapter/out/persistence/postgres/mapper/TransacaoMapper.java` | `pagamento/persistence/mapper/` |
| `adapter/out/persistence/postgres/repository/TransacaoJpaRepository.java` | `pagamento/persistence/repository/` |

### → `veiculo/`
| Origem | Destino |
|---|---|
| `adapter/in/web/controller/VeiculoController.java` | `veiculo/web/` |
| `adapter/in/web/dto/response/VeiculoDataResponse.java` | `veiculo/web/dto/response/` |
| `application/ports/in/BuscarVeiculosUseCase.java` | `veiculo/application/ports/in/` |
| `application/ports/out/VeiculoDataPort.java` | `veiculo/application/ports/out/` |
| `application/usecase/BuscarVeiculosUseCaseImpl.java` | `veiculo/application/usecase/` |
| `domain/exception/FipeApiException.java` | `veiculo/domain/exception/` |
| `adapter/out/external/fipe/FipeAdapter.java` | `veiculo/external/fipe/` |
| `adapter/out/external/fipe/FipeClient.java` | `veiculo/external/fipe/` |

### → `legal/`
| Origem | Destino |
|---|---|
| `adapter/in/web/controller/LegalController.java` | `legal/web/` |

### → `shared/`
| Origem | Destino |
|---|---|
| `config/security/SecurityConfig.java` | `shared/security/` |
| `config/security/JwtService.java` | `shared/security/` |
| `config/security/JwtAuthenticationFilter.java` | `shared/security/` |
| `config/security/CustomUserDetailsService.java` | `shared/security/` |
| `config/security/CurrentUser.java` | `shared/security/` |
| `config/security/RateLimitingFilter.java` | `shared/security/` |
| `config/security/SecurityHeadersFilter.java` | `shared/security/` |
| `application/ports/out/PasswordEncoderPort.java` | `shared/security/` |
| `adapter/out/security/BcryptPasswordEncoderAdapter.java` | `shared/security/` |
| `adapter/in/web/GlobalExceptionHandler.java` | `shared/web/` |
| `adapter/in/web/dto/response/ErrorResponse.java` | `shared/web/` |
| `adapter/in/web/dto/response/PaginaResponse.java` | `shared/web/` |
| `config/StringToTipoVeiculoConverter.java` | `shared/web/` |
| `config/WebMvcConfig.java` | `shared/web/` |
| `application/ports/out/BlobStoragePort.java` | `shared/storage/` |
| `adapter/out/storage/BlobStorageAdapter.java` | `shared/storage/` |
| `config/CosmosConfiguration.java` | `shared/config/` |
| `config/CacheConfiguration.java` | `shared/config/` |
| `config/WebClientConfiguration.java` | `shared/config/` |
| `config/CosmosDataMigration.java` | `shared/config/` |
| `domain/exception/DomainException.java` | `shared/domain/exception/` |
| `domain/exception/AcessoNegadoException.java` | `shared/domain/exception/` |
| `domain/exception/ServicoIndisponivelException.java` | `shared/domain/exception/` |
| `domain/model/TipoVeiculo.java` | `shared/domain/` (usado por `anuncio` **e** `veiculo`) |

### Caso especial — `config/BeanConfiguration.java`
**Não move como está.** Ver seção 4 (quebra em uma `@Configuration` por módulo).

---

## 3. Dependências entre módulos e seams (regras anti-ciclo)

Regra geral: um módulo só depende de **outro módulo via seu `application/ports/in`** (caso de uso) ou via uma **port `out` que o outro módulo expõe**. Nunca adapter→adapter. `shared/` não depende de nenhum módulo de negócio.

Dependências reais a respeitar:

- **`pagamento` → `assinatura`**: `ProcessarPagamentoUseCaseImpl` ativa a assinatura. Hoje injeta `AssinaturaRepositoryPort` diretamente. Para não criar dependência de persistência cruzada, expor em `assinatura` uma port de entrada `AtivarAssinaturaPort` (ou reusar `VerificarAssinaturaUseCase`-style) que `pagamento` consome. Seta única `pagamento → assinatura`, sem ciclo. **Decisão de design a tomar na execução** — alternativa mínima: `pagamento` depende de `assinatura.application.ports.out.AssinaturaRepositoryPort` (aceitável no MVP, mas é acoplamento a persistência).
- **`anuncio` → `assinatura`**: `AnuncioController` usa `VerificarAssinaturaUseCase` (reativado pela flag P0.3). Mantém-se como dependência de uma port `in` de `assinatura`. Seta única.
- **`usuario` → `perfil`, `anuncio`, `assinatura`, `shared/storage`**: `ExcluirContaUseCaseImpl` orquestra deleção em todos. Fica em `usuario/` e chama as ports `out` (`PerfilRepositoryPort`, `AnuncioRepositoryPort`, `AssinaturaRepositoryPort`, `BlobStoragePort`). `usuario` é o agregador do ciclo de vida da conta — aceitável depender de vários, desde que via ports.
- **`usuario` / `perfil` / `anuncio` → `shared/storage`**: upload/*delete* de fotos. Via `BlobStoragePort`. OK.
- **Registro/Google em `usuario` cria `Perfil`**: `RegistrarUsuarioUseCaseImpl` e `AutenticarGoogleUseCaseImpl` usam `PerfilRepositoryPort`. Seta `usuario → perfil`. OK.

Ciclos a **proibir**: `assinatura → pagamento` (não deve existir — só a seta inversa), `perfil → anuncio`, qualquer `*.persistence` importando outro módulo.

---

## 4. BeanConfiguration → uma `@Configuration` por módulo

O `BeanConfiguration` central (~170 linhas, 17 use cases) some. Cada módulo ganha sua config de wiring:

- `anuncio/config/AnuncioBeans.java` — `criarAnuncioUseCase`, `buscarAnunciosUseCase`, `buscarFiltrosDisponiveisUseCase`, `atualizarAnuncioUseCase`, `excluirAnuncioUseCase`, `finalizarAnuncioUseCase`, `anuncioService`.
- `usuario/config/UsuarioBeans.java` — `registrarUsuarioUseCase`, `autenticarUsuarioUseCase`, `autenticarGoogleUseCase`, `alterarSenhaUseCase`, `excluirContaUseCase`.
- `perfil/config/PerfilBeans.java` — `gerenciarPerfilUseCase`.
- `assinatura/config/AssinaturaBeans.java` — `buscarPlanosUseCase`, `criarAssinaturaUseCase`, `verificarAssinaturaUseCase`, `cancelarAssinaturaUseCase`.
- `pagamento/config/PagamentoBeans.java` — `processarPagamentoUseCase`.
- `veiculo/config/VeiculoBeans.java` — `buscarVeiculosUseCase`.

`@Value` hoje em `BeanConfiguration` (`app.frontend-url`, `app.base-url`) migra para `AssinaturaBeans` (único consumidor: `criarAssinaturaUseCase`).

> Alternativa mais enxuta (avaliar): anotar os `*Impl` com `@Service` e injetar por construtor, eliminando o wiring manual. Custo: perde-se a "pureza" de a camada `application` não conhecer Spring. Recomendação: manter wiring explícito por módulo agora (menor mudança), considerar `@Service` num passo futuro.

---

## 5. Ordem de execução (com checkpoint de compilação a cada passo)

Fazer **um módulo por vez**, `mvn -q test-compile` entre cada (idealmente `mvn test`). Commit por módulo.

1. **`shared/`** — base de tudo (security, web, storage, config, `DomainException`, `TipoVeiculo`). Depois deste passo a maior parte dos imports do projeto muda; compilar e corrigir em massa.
2. **`veiculo/`** — pequeno e quase isolado (só depende de `shared`). Valida o padrão.
3. **`pagamento/`** — isolado, exceto a seta para `assinatura` (que ainda não existe; criar a port primeiro ou mover `assinatura` antes — ver nota).
4. **`assinatura/`** — antes de `anuncio` e `pagamento` finalizarem, por causa das setas `anuncio→assinatura` e `pagamento→assinatura`. **Sugestão: inverter 3 e 4** — mover `assinatura` antes de `pagamento`.
5. **`perfil/`**
6. **`anuncio/`** — depende de `shared` (`TipoVeiculo`) e `assinatura` (`VerificarAssinaturaUseCase`).
7. **`usuario/`** — por último: depende de `perfil`, `anuncio`, `assinatura`, `shared/storage`.
8. **`legal/`** — trivial, qualquer momento.
9. **Quebrar `BeanConfiguration`** nos `*Beans` por módulo e deletar o central.

Ordem revisada recomendada: `shared → veiculo → assinatura → pagamento → perfil → anuncio → usuario → legal → beans`.

---

## 6. Mecânica e cuidados

- **Use o "Move to package" da IDE** (IntelliJ/VS Code Java) — atualiza `package` e todos os imports automaticamente. Muito mais seguro que `git mv` + edição manual. Move *por pasta destino* para minimizar passos.
- **MapStruct**: os mappers (`*Mapper.java`) são processados em tempo de compilação; ao mover, o `mvn compile` regenera. Confirmar que continuam compilando após cada move.
- **Spring component scan**: tudo segue sob `com.teachei.api.*`, então `@SpringBootApplication` na raiz continua varrendo todos os módulos sem `@ComponentScan` extra. Nada a configurar.
- **`@Query` / nomes de método de repositório**: inalterados — só muda o pacote da interface.
- **Testes a atualizar** (imports vão quebrar; mesma técnica de move/find-replace de import):
  - `adapter/in/web/controller/AnuncioControllerFiltrosTest.java` → referencia `anuncio/`
  - `adapter/in/web/controller/VeiculoControllerTest.java` → `veiculo/`
  - `config/StringToTipoVeiculoConverterTest.java` → `shared/web/`
  - `TeAcheiApplicationTests.java` → só carrega contexto, ajustar imports se houver.
- **`application.yml` / Flyway / entidades JPA**: nenhuma mudança de nome de tabela/coluna — só Java muda de pacote. `ddl-auto: validate` continua válido.
- **Não misturar com mudança de lógica**: este refactor deve ser um diff que só altera linhas `package`/`import` e move arquivos. Qualquer alteração de comportamento entra em commit separado.

---

## 7. Não-objetivos (escopo desta fase)

- **Não** quebrar em múltiplos artefatos/módulos Maven. Fica em 1 artefato, fronteiras por pacote + disciplina de port. Multi-módulo Maven só se quiser impor fronteiras em tempo de compilação — atrito desproporcional agora.
- **Não** trocar `WebClient`→`RestClient`, **não** mexer no rate limiter, **não** adicionar testes. Esses são itens P1/P2 separados do relatório `REVIEW_BACKEND.md`.
- **Não** alterar contratos de API, nomes de tabela, nem comportamento.

---

## 8. Resumo de risco

Baixo-médio. É movimentação mecânica com rede de compilação a cada passo. Maiores pontos de atenção: (a) a seta `pagamento → assinatura` (decidir a port de ativação), (b) regenerar MapStruct sem erro, (c) volume de imports a corrigir após mover `shared/`/`TipoVeiculo`. Recuperável via commit por módulo.
