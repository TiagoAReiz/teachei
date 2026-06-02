#!/bin/bash
set -e
cd "$(dirname "$0")"
SRC="TeAchei/src/main/java/com/teachei/api"
TST="TeAchei/src/test/java/com/teachei/api"

# Create destination directories
mkdir -p \
  "$SRC/pagamento/web" \
  "$SRC/pagamento/application/ports/in" \
  "$SRC/pagamento/application/ports/out" \
  "$SRC/pagamento/application/usecase" \
  "$SRC/pagamento/domain/exception" \
  "$SRC/pagamento/external/mercadopago" \
  "$SRC/pagamento/persistence/entity" \
  "$SRC/pagamento/persistence/mapper" \
  "$SRC/pagamento/persistence/repository" \
  "$SRC/assinatura/web/dto/request" \
  "$SRC/assinatura/web/dto/response" \
  "$SRC/assinatura/application/ports/in" \
  "$SRC/assinatura/application/ports/out" \
  "$SRC/assinatura/application/usecase" \
  "$SRC/assinatura/domain" \
  "$SRC/assinatura/config" \
  "$SRC/assinatura/persistence/entity" \
  "$SRC/assinatura/persistence/mapper" \
  "$SRC/assinatura/persistence/repository" \
  "$SRC/perfil/web/dto/request" \
  "$SRC/perfil/web/dto/response" \
  "$SRC/perfil/application/ports/in" \
  "$SRC/perfil/application/ports/out" \
  "$SRC/perfil/application/usecase" \
  "$SRC/perfil/domain" \
  "$SRC/perfil/persistence/entity" \
  "$SRC/perfil/persistence/mapper" \
  "$SRC/perfil/persistence/repository" \
  "$SRC/legal/web" \
  "$TST/pagamento/application/usecase" \
  "$TST/pagamento/external/mercadopago"

# === PAGAMENTO ===
git mv "$SRC/adapter/in/web/controller/PagamentoController.java"                          "$SRC/pagamento/web/PagamentoController.java"
git mv "$SRC/application/ports/in/ProcessarPagamentoUseCase.java"                         "$SRC/pagamento/application/ports/in/ProcessarPagamentoUseCase.java"
git mv "$SRC/application/ports/out/PagamentoPort.java"                                    "$SRC/pagamento/application/ports/out/PagamentoPort.java"
git mv "$SRC/application/ports/out/TransacaoRepositoryPort.java"                          "$SRC/pagamento/application/ports/out/TransacaoRepositoryPort.java"
git mv "$SRC/application/usecase/ProcessarPagamentoUseCaseImpl.java"                      "$SRC/pagamento/application/usecase/ProcessarPagamentoUseCaseImpl.java"
git mv "$SRC/domain/model/StatusPagamento.java"                                           "$SRC/pagamento/domain/StatusPagamento.java"
git mv "$SRC/domain/exception/PagamentoException.java"                                    "$SRC/pagamento/domain/exception/PagamentoException.java"
git mv "$SRC/adapter/out/external/mercadopago/MercadoPagoAdapter.java"                    "$SRC/pagamento/external/mercadopago/MercadoPagoAdapter.java"
git mv "$SRC/adapter/out/external/mercadopago/MercadoPagoClient.java"                     "$SRC/pagamento/external/mercadopago/MercadoPagoClient.java"
git mv "$SRC/adapter/out/external/mercadopago/MercadoPagoWebhookValidator.java"           "$SRC/pagamento/external/mercadopago/MercadoPagoWebhookValidator.java"
git mv "$SRC/adapter/out/persistence/postgres/TransacaoJpaAdapter.java"                   "$SRC/pagamento/persistence/TransacaoJpaAdapter.java"
git mv "$SRC/adapter/out/persistence/postgres/entity/TransacaoPagamentoEntity.java"       "$SRC/pagamento/persistence/entity/TransacaoPagamentoEntity.java"
git mv "$SRC/adapter/out/persistence/postgres/mapper/TransacaoMapper.java"                "$SRC/pagamento/persistence/mapper/TransacaoMapper.java"
git mv "$SRC/adapter/out/persistence/postgres/repository/TransacaoJpaRepository.java"     "$SRC/pagamento/persistence/repository/TransacaoJpaRepository.java"
git mv "$TST/application/usecase/ProcessarPagamentoUseCaseImplTest.java"                  "$TST/pagamento/application/usecase/ProcessarPagamentoUseCaseImplTest.java"
git mv "$TST/adapter/out/external/mercadopago/MercadoPagoWebhookValidatorTest.java"       "$TST/pagamento/external/mercadopago/MercadoPagoWebhookValidatorTest.java"

# === ASSINATURA ===
git mv "$SRC/adapter/in/web/controller/AssinaturaController.java"                         "$SRC/assinatura/web/AssinaturaController.java"
git mv "$SRC/adapter/in/web/dto/request/CriarAssinaturaRequest.java"                      "$SRC/assinatura/web/dto/request/CriarAssinaturaRequest.java"
git mv "$SRC/adapter/in/web/dto/response/AssinaturaResponse.java"                         "$SRC/assinatura/web/dto/response/AssinaturaResponse.java"
git mv "$SRC/adapter/in/web/dto/response/AssinaturaPreferenciaResponse.java"              "$SRC/assinatura/web/dto/response/AssinaturaPreferenciaResponse.java"
git mv "$SRC/adapter/in/web/dto/response/PlanoResponse.java"                              "$SRC/assinatura/web/dto/response/PlanoResponse.java"
git mv "$SRC/application/ports/in/CriarAssinaturaUseCase.java"                            "$SRC/assinatura/application/ports/in/CriarAssinaturaUseCase.java"
git mv "$SRC/application/ports/in/CancelarAssinaturaUseCase.java"                         "$SRC/assinatura/application/ports/in/CancelarAssinaturaUseCase.java"
git mv "$SRC/application/ports/in/VerificarAssinaturaUseCase.java"                        "$SRC/assinatura/application/ports/in/VerificarAssinaturaUseCase.java"
git mv "$SRC/application/ports/in/BuscarPlanosUseCase.java"                               "$SRC/assinatura/application/ports/in/BuscarPlanosUseCase.java"
git mv "$SRC/application/ports/out/AssinaturaRepositoryPort.java"                         "$SRC/assinatura/application/ports/out/AssinaturaRepositoryPort.java"
git mv "$SRC/application/usecase/CriarAssinaturaUseCaseImpl.java"                         "$SRC/assinatura/application/usecase/CriarAssinaturaUseCaseImpl.java"
git mv "$SRC/application/usecase/CancelarAssinaturaUseCaseImpl.java"                      "$SRC/assinatura/application/usecase/CancelarAssinaturaUseCaseImpl.java"
git mv "$SRC/application/usecase/VerificarAssinaturaUseCaseImpl.java"                     "$SRC/assinatura/application/usecase/VerificarAssinaturaUseCaseImpl.java"
git mv "$SRC/application/usecase/BuscarPlanosUseCaseImpl.java"                            "$SRC/assinatura/application/usecase/BuscarPlanosUseCaseImpl.java"
git mv "$SRC/domain/model/Assinatura.java"                                                "$SRC/assinatura/domain/Assinatura.java"
git mv "$SRC/domain/model/PlanoAssinatura.java"                                           "$SRC/assinatura/domain/PlanoAssinatura.java"
git mv "$SRC/domain/model/StatusAssinatura.java"                                          "$SRC/assinatura/domain/StatusAssinatura.java"
git mv "$SRC/config/SubscriptionConfig.java"                                              "$SRC/assinatura/config/SubscriptionConfig.java"
git mv "$SRC/adapter/out/persistence/postgres/AssinaturaJpaAdapter.java"                  "$SRC/assinatura/persistence/AssinaturaJpaAdapter.java"
git mv "$SRC/adapter/out/persistence/postgres/entity/AssinaturaEntity.java"               "$SRC/assinatura/persistence/entity/AssinaturaEntity.java"
git mv "$SRC/adapter/out/persistence/postgres/mapper/AssinaturaMapper.java"               "$SRC/assinatura/persistence/mapper/AssinaturaMapper.java"
git mv "$SRC/adapter/out/persistence/postgres/repository/AssinaturaJpaRepository.java"    "$SRC/assinatura/persistence/repository/AssinaturaJpaRepository.java"

# === PERFIL ===
git mv "$SRC/adapter/in/web/controller/PerfilController.java"                             "$SRC/perfil/web/PerfilController.java"
git mv "$SRC/adapter/in/web/dto/request/AtualizarPerfilRequest.java"                      "$SRC/perfil/web/dto/request/AtualizarPerfilRequest.java"
git mv "$SRC/adapter/in/web/dto/response/PerfilResponse.java"                             "$SRC/perfil/web/dto/response/PerfilResponse.java"
git mv "$SRC/adapter/in/web/dto/response/PerfilPublicoResponse.java"                      "$SRC/perfil/web/dto/response/PerfilPublicoResponse.java"
git mv "$SRC/application/ports/in/GerenciarPerfilUseCase.java"                            "$SRC/perfil/application/ports/in/GerenciarPerfilUseCase.java"
git mv "$SRC/application/ports/out/PerfilRepositoryPort.java"                             "$SRC/perfil/application/ports/out/PerfilRepositoryPort.java"
git mv "$SRC/application/usecase/GerenciarPerfilUseCaseImpl.java"                         "$SRC/perfil/application/usecase/GerenciarPerfilUseCaseImpl.java"
git mv "$SRC/domain/model/Perfil.java"                                                    "$SRC/perfil/domain/Perfil.java"
git mv "$SRC/adapter/out/persistence/postgres/PerfilJpaAdapter.java"                      "$SRC/perfil/persistence/PerfilJpaAdapter.java"
git mv "$SRC/adapter/out/persistence/postgres/entity/PerfilEntity.java"                   "$SRC/perfil/persistence/entity/PerfilEntity.java"
git mv "$SRC/adapter/out/persistence/postgres/mapper/PerfilMapper.java"                   "$SRC/perfil/persistence/mapper/PerfilMapper.java"
git mv "$SRC/adapter/out/persistence/postgres/repository/PerfilJpaRepository.java"        "$SRC/perfil/persistence/repository/PerfilJpaRepository.java"

# === LEGAL ===
git mv "$SRC/adapter/in/web/controller/LegalController.java"                              "$SRC/legal/web/LegalController.java"

echo "=== MOVES DONE ==="
