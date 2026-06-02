#!/bin/bash
set -e
cd "$(dirname "$0")"
SRC="TeAchei/src/main/java/com/teachei/api"
TST="TeAchei/src/test/java/com/teachei/api"

# Helper: set package line of a file
setpkg() {
  local file="$1"; local new="$2"
  sed -i "1,/^package /{s|^package .*;|package ${new};|;}" "$file"
}

# === PAGAMENTO package updates ===
setpkg "$SRC/pagamento/web/PagamentoController.java"                              "com.teachei.api.pagamento.web"
setpkg "$SRC/pagamento/application/ports/in/ProcessarPagamentoUseCase.java"        "com.teachei.api.pagamento.application.ports.in"
setpkg "$SRC/pagamento/application/ports/out/PagamentoPort.java"                   "com.teachei.api.pagamento.application.ports.out"
setpkg "$SRC/pagamento/application/ports/out/TransacaoRepositoryPort.java"         "com.teachei.api.pagamento.application.ports.out"
setpkg "$SRC/pagamento/application/usecase/ProcessarPagamentoUseCaseImpl.java"     "com.teachei.api.pagamento.application.usecase"
setpkg "$SRC/pagamento/domain/StatusPagamento.java"                                "com.teachei.api.pagamento.domain"
setpkg "$SRC/pagamento/domain/exception/PagamentoException.java"                   "com.teachei.api.pagamento.domain.exception"
setpkg "$SRC/pagamento/external/mercadopago/MercadoPagoAdapter.java"               "com.teachei.api.pagamento.external.mercadopago"
setpkg "$SRC/pagamento/external/mercadopago/MercadoPagoClient.java"                "com.teachei.api.pagamento.external.mercadopago"
setpkg "$SRC/pagamento/external/mercadopago/MercadoPagoWebhookValidator.java"      "com.teachei.api.pagamento.external.mercadopago"
setpkg "$SRC/pagamento/persistence/TransacaoJpaAdapter.java"                       "com.teachei.api.pagamento.persistence"
setpkg "$SRC/pagamento/persistence/entity/TransacaoPagamentoEntity.java"           "com.teachei.api.pagamento.persistence.entity"
setpkg "$SRC/pagamento/persistence/mapper/TransacaoMapper.java"                    "com.teachei.api.pagamento.persistence.mapper"
setpkg "$SRC/pagamento/persistence/repository/TransacaoJpaRepository.java"         "com.teachei.api.pagamento.persistence.repository"
setpkg "$TST/pagamento/application/usecase/ProcessarPagamentoUseCaseImplTest.java" "com.teachei.api.pagamento.application.usecase"
setpkg "$TST/pagamento/external/mercadopago/MercadoPagoWebhookValidatorTest.java"  "com.teachei.api.pagamento.external.mercadopago"

# === ASSINATURA package updates ===
setpkg "$SRC/assinatura/web/AssinaturaController.java"                             "com.teachei.api.assinatura.web"
setpkg "$SRC/assinatura/web/dto/request/CriarAssinaturaRequest.java"               "com.teachei.api.assinatura.web.dto.request"
setpkg "$SRC/assinatura/web/dto/response/AssinaturaResponse.java"                  "com.teachei.api.assinatura.web.dto.response"
setpkg "$SRC/assinatura/web/dto/response/AssinaturaPreferenciaResponse.java"       "com.teachei.api.assinatura.web.dto.response"
setpkg "$SRC/assinatura/web/dto/response/PlanoResponse.java"                       "com.teachei.api.assinatura.web.dto.response"
setpkg "$SRC/assinatura/application/ports/in/CriarAssinaturaUseCase.java"          "com.teachei.api.assinatura.application.ports.in"
setpkg "$SRC/assinatura/application/ports/in/CancelarAssinaturaUseCase.java"       "com.teachei.api.assinatura.application.ports.in"
setpkg "$SRC/assinatura/application/ports/in/VerificarAssinaturaUseCase.java"      "com.teachei.api.assinatura.application.ports.in"
setpkg "$SRC/assinatura/application/ports/in/BuscarPlanosUseCase.java"             "com.teachei.api.assinatura.application.ports.in"
setpkg "$SRC/assinatura/application/ports/out/AssinaturaRepositoryPort.java"       "com.teachei.api.assinatura.application.ports.out"
setpkg "$SRC/assinatura/application/usecase/CriarAssinaturaUseCaseImpl.java"       "com.teachei.api.assinatura.application.usecase"
setpkg "$SRC/assinatura/application/usecase/CancelarAssinaturaUseCaseImpl.java"    "com.teachei.api.assinatura.application.usecase"
setpkg "$SRC/assinatura/application/usecase/VerificarAssinaturaUseCaseImpl.java"   "com.teachei.api.assinatura.application.usecase"
setpkg "$SRC/assinatura/application/usecase/BuscarPlanosUseCaseImpl.java"          "com.teachei.api.assinatura.application.usecase"
setpkg "$SRC/assinatura/domain/Assinatura.java"                                    "com.teachei.api.assinatura.domain"
setpkg "$SRC/assinatura/domain/PlanoAssinatura.java"                               "com.teachei.api.assinatura.domain"
setpkg "$SRC/assinatura/domain/StatusAssinatura.java"                              "com.teachei.api.assinatura.domain"
setpkg "$SRC/assinatura/config/SubscriptionConfig.java"                            "com.teachei.api.assinatura.config"
setpkg "$SRC/assinatura/persistence/AssinaturaJpaAdapter.java"                     "com.teachei.api.assinatura.persistence"
setpkg "$SRC/assinatura/persistence/entity/AssinaturaEntity.java"                  "com.teachei.api.assinatura.persistence.entity"
setpkg "$SRC/assinatura/persistence/mapper/AssinaturaMapper.java"                  "com.teachei.api.assinatura.persistence.mapper"
setpkg "$SRC/assinatura/persistence/repository/AssinaturaJpaRepository.java"       "com.teachei.api.assinatura.persistence.repository"

# === PERFIL package updates ===
setpkg "$SRC/perfil/web/PerfilController.java"                                     "com.teachei.api.perfil.web"
setpkg "$SRC/perfil/web/dto/request/AtualizarPerfilRequest.java"                   "com.teachei.api.perfil.web.dto.request"
setpkg "$SRC/perfil/web/dto/response/PerfilResponse.java"                          "com.teachei.api.perfil.web.dto.response"
setpkg "$SRC/perfil/web/dto/response/PerfilPublicoResponse.java"                   "com.teachei.api.perfil.web.dto.response"
setpkg "$SRC/perfil/application/ports/in/GerenciarPerfilUseCase.java"              "com.teachei.api.perfil.application.ports.in"
setpkg "$SRC/perfil/application/ports/out/PerfilRepositoryPort.java"               "com.teachei.api.perfil.application.ports.out"
setpkg "$SRC/perfil/application/usecase/GerenciarPerfilUseCaseImpl.java"           "com.teachei.api.perfil.application.usecase"
setpkg "$SRC/perfil/domain/Perfil.java"                                            "com.teachei.api.perfil.domain"
setpkg "$SRC/perfil/persistence/PerfilJpaAdapter.java"                             "com.teachei.api.perfil.persistence"
setpkg "$SRC/perfil/persistence/entity/PerfilEntity.java"                          "com.teachei.api.perfil.persistence.entity"
setpkg "$SRC/perfil/persistence/mapper/PerfilMapper.java"                          "com.teachei.api.perfil.persistence.mapper"
setpkg "$SRC/perfil/persistence/repository/PerfilJpaRepository.java"               "com.teachei.api.perfil.persistence.repository"

# === LEGAL package update ===
setpkg "$SRC/legal/web/LegalController.java"                                       "com.teachei.api.legal.web"

echo "=== PACKAGES DONE ==="

# === IMPORTS across codebase ===
find TeAchei/src -name "*.java" -type f -exec sed -i \
  `# pagamento` \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.controller\.PagamentoController|com.teachei.api.pagamento.web.PagamentoController|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.ProcessarPagamentoUseCase|com.teachei.api.pagamento.application.ports.in.ProcessarPagamentoUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.out\.PagamentoPort|com.teachei.api.pagamento.application.ports.out.PagamentoPort|g' \
  -e 's|com\.teachei\.api\.application\.ports\.out\.TransacaoRepositoryPort|com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.ProcessarPagamentoUseCaseImpl|com.teachei.api.pagamento.application.usecase.ProcessarPagamentoUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.domain\.model\.StatusPagamento|com.teachei.api.pagamento.domain.StatusPagamento|g' \
  -e 's|com\.teachei\.api\.domain\.exception\.PagamentoException|com.teachei.api.pagamento.domain.exception.PagamentoException|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.external\.mercadopago\.MercadoPagoAdapter|com.teachei.api.pagamento.external.mercadopago.MercadoPagoAdapter|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.external\.mercadopago\.MercadoPagoClient|com.teachei.api.pagamento.external.mercadopago.MercadoPagoClient|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.external\.mercadopago\.MercadoPagoWebhookValidator|com.teachei.api.pagamento.external.mercadopago.MercadoPagoWebhookValidator|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.TransacaoJpaAdapter|com.teachei.api.pagamento.persistence.TransacaoJpaAdapter|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.entity\.TransacaoPagamentoEntity|com.teachei.api.pagamento.persistence.entity.TransacaoPagamentoEntity|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.mapper\.TransacaoMapper|com.teachei.api.pagamento.persistence.mapper.TransacaoMapper|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.repository\.TransacaoJpaRepository|com.teachei.api.pagamento.persistence.repository.TransacaoJpaRepository|g' \
  `# assinatura` \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.controller\.AssinaturaController|com.teachei.api.assinatura.web.AssinaturaController|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.CriarAssinaturaRequest|com.teachei.api.assinatura.web.dto.request.CriarAssinaturaRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.AssinaturaResponse|com.teachei.api.assinatura.web.dto.response.AssinaturaResponse|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.AssinaturaPreferenciaResponse|com.teachei.api.assinatura.web.dto.response.AssinaturaPreferenciaResponse|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.PlanoResponse|com.teachei.api.assinatura.web.dto.response.PlanoResponse|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.CriarAssinaturaUseCase|com.teachei.api.assinatura.application.ports.in.CriarAssinaturaUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.CancelarAssinaturaUseCase|com.teachei.api.assinatura.application.ports.in.CancelarAssinaturaUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.VerificarAssinaturaUseCase|com.teachei.api.assinatura.application.ports.in.VerificarAssinaturaUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.BuscarPlanosUseCase|com.teachei.api.assinatura.application.ports.in.BuscarPlanosUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.out\.AssinaturaRepositoryPort|com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.CriarAssinaturaUseCaseImpl|com.teachei.api.assinatura.application.usecase.CriarAssinaturaUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.CancelarAssinaturaUseCaseImpl|com.teachei.api.assinatura.application.usecase.CancelarAssinaturaUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.VerificarAssinaturaUseCaseImpl|com.teachei.api.assinatura.application.usecase.VerificarAssinaturaUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.BuscarPlanosUseCaseImpl|com.teachei.api.assinatura.application.usecase.BuscarPlanosUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.domain\.model\.Assinatura|com.teachei.api.assinatura.domain.Assinatura|g' \
  -e 's|com\.teachei\.api\.domain\.model\.PlanoAssinatura|com.teachei.api.assinatura.domain.PlanoAssinatura|g' \
  -e 's|com\.teachei\.api\.domain\.model\.StatusAssinatura|com.teachei.api.assinatura.domain.StatusAssinatura|g' \
  -e 's|com\.teachei\.api\.config\.SubscriptionConfig|com.teachei.api.assinatura.config.SubscriptionConfig|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.AssinaturaJpaAdapter|com.teachei.api.assinatura.persistence.AssinaturaJpaAdapter|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.entity\.AssinaturaEntity|com.teachei.api.assinatura.persistence.entity.AssinaturaEntity|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.mapper\.AssinaturaMapper|com.teachei.api.assinatura.persistence.mapper.AssinaturaMapper|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.repository\.AssinaturaJpaRepository|com.teachei.api.assinatura.persistence.repository.AssinaturaJpaRepository|g' \
  `# perfil` \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.controller\.PerfilController|com.teachei.api.perfil.web.PerfilController|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.AtualizarPerfilRequest|com.teachei.api.perfil.web.dto.request.AtualizarPerfilRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.PerfilResponse|com.teachei.api.perfil.web.dto.response.PerfilResponse|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.PerfilPublicoResponse|com.teachei.api.perfil.web.dto.response.PerfilPublicoResponse|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.GerenciarPerfilUseCase|com.teachei.api.perfil.application.ports.in.GerenciarPerfilUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.out\.PerfilRepositoryPort|com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.GerenciarPerfilUseCaseImpl|com.teachei.api.perfil.application.usecase.GerenciarPerfilUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.domain\.model\.Perfil|com.teachei.api.perfil.domain.Perfil|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.PerfilJpaAdapter|com.teachei.api.perfil.persistence.PerfilJpaAdapter|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.entity\.PerfilEntity|com.teachei.api.perfil.persistence.entity.PerfilEntity|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.mapper\.PerfilMapper|com.teachei.api.perfil.persistence.mapper.PerfilMapper|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.repository\.PerfilJpaRepository|com.teachei.api.perfil.persistence.repository.PerfilJpaRepository|g' \
  `# legal` \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.controller\.LegalController|com.teachei.api.legal.web.LegalController|g' \
  {} \;

echo "=== IMPORTS DONE ==="
