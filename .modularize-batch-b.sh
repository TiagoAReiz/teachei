#!/bin/bash
set -e
cd "$(dirname "$0")"
SRC="TeAchei/src/main/java/com/teachei/api"
TST="TeAchei/src/test/java/com/teachei/api"

mkdir -p \
  "$SRC/anuncio/web/dto/request" \
  "$SRC/anuncio/web/dto/response" \
  "$SRC/anuncio/application/ports/in" \
  "$SRC/anuncio/application/ports/out" \
  "$SRC/anuncio/application/usecase" \
  "$SRC/anuncio/domain" \
  "$SRC/anuncio/domain/exception" \
  "$SRC/anuncio/persistence/document" \
  "$SRC/anuncio/persistence/mapper" \
  "$SRC/anuncio/persistence/repository" \
  "$SRC/usuario/web/dto/request" \
  "$SRC/usuario/web/dto/response" \
  "$SRC/usuario/application/ports/in" \
  "$SRC/usuario/application/ports/out" \
  "$SRC/usuario/application/usecase" \
  "$SRC/usuario/domain" \
  "$SRC/usuario/domain/exception" \
  "$SRC/usuario/external/google" \
  "$SRC/usuario/persistence/entity" \
  "$SRC/usuario/persistence/mapper" \
  "$SRC/usuario/persistence/repository" \
  "$TST/anuncio/web" \
  "$TST/anuncio/persistence"

# === ANUNCIO moves ===
git mv "$SRC/adapter/in/web/controller/AnuncioController.java"                              "$SRC/anuncio/web/AnuncioController.java"
git mv "$SRC/adapter/in/web/dto/request/CriarAnuncioRequest.java"                            "$SRC/anuncio/web/dto/request/CriarAnuncioRequest.java"
git mv "$SRC/adapter/in/web/dto/request/AtualizarAnuncioRequest.java"                        "$SRC/anuncio/web/dto/request/AtualizarAnuncioRequest.java"
git mv "$SRC/adapter/in/web/dto/request/FiltroAnuncioQuery.java"                             "$SRC/anuncio/web/dto/request/FiltroAnuncioQuery.java"
git mv "$SRC/adapter/in/web/dto/response/AnuncioResponse.java"                               "$SRC/anuncio/web/dto/response/AnuncioResponse.java"
git mv "$SRC/adapter/in/web/dto/response/FiltrosDisponiveisResponse.java"                    "$SRC/anuncio/web/dto/response/FiltrosDisponiveisResponse.java"
git mv "$SRC/application/ports/in/CriarAnuncioUseCase.java"                                  "$SRC/anuncio/application/ports/in/CriarAnuncioUseCase.java"
git mv "$SRC/application/ports/in/AtualizarAnuncioUseCase.java"                              "$SRC/anuncio/application/ports/in/AtualizarAnuncioUseCase.java"
git mv "$SRC/application/ports/in/ExcluirAnuncioUseCase.java"                                "$SRC/anuncio/application/ports/in/ExcluirAnuncioUseCase.java"
git mv "$SRC/application/ports/in/FinalizarAnuncioUseCase.java"                              "$SRC/anuncio/application/ports/in/FinalizarAnuncioUseCase.java"
git mv "$SRC/application/ports/in/BuscarAnunciosUseCase.java"                                "$SRC/anuncio/application/ports/in/BuscarAnunciosUseCase.java"
git mv "$SRC/application/ports/in/BuscarFiltrosDisponiveisUseCase.java"                      "$SRC/anuncio/application/ports/in/BuscarFiltrosDisponiveisUseCase.java"
git mv "$SRC/application/ports/out/AnuncioRepositoryPort.java"                               "$SRC/anuncio/application/ports/out/AnuncioRepositoryPort.java"
git mv "$SRC/application/usecase/CriarAnuncioUseCaseImpl.java"                               "$SRC/anuncio/application/usecase/CriarAnuncioUseCaseImpl.java"
git mv "$SRC/application/usecase/AtualizarAnuncioUseCaseImpl.java"                           "$SRC/anuncio/application/usecase/AtualizarAnuncioUseCaseImpl.java"
git mv "$SRC/application/usecase/ExcluirAnuncioUseCaseImpl.java"                             "$SRC/anuncio/application/usecase/ExcluirAnuncioUseCaseImpl.java"
git mv "$SRC/application/usecase/FinalizarAnuncioUseCaseImpl.java"                           "$SRC/anuncio/application/usecase/FinalizarAnuncioUseCaseImpl.java"
git mv "$SRC/application/usecase/BuscarAnunciosUseCaseImpl.java"                             "$SRC/anuncio/application/usecase/BuscarAnunciosUseCaseImpl.java"
git mv "$SRC/application/usecase/BuscarFiltrosDisponiveisUseCaseImpl.java"                   "$SRC/anuncio/application/usecase/BuscarFiltrosDisponiveisUseCaseImpl.java"
git mv "$SRC/domain/service/AnuncioService.java"                                             "$SRC/anuncio/domain/AnuncioService.java"
git mv "$SRC/domain/model/Anuncio.java"                                                      "$SRC/anuncio/domain/Anuncio.java"
git mv "$SRC/domain/model/VeiculoInfo.java"                                                  "$SRC/anuncio/domain/VeiculoInfo.java"
git mv "$SRC/domain/model/ContatoInfo.java"                                                  "$SRC/anuncio/domain/ContatoInfo.java"
git mv "$SRC/domain/model/OpcionalVeiculo.java"                                              "$SRC/anuncio/domain/OpcionalVeiculo.java"
git mv "$SRC/domain/model/VersaoInfo.java"                                                   "$SRC/anuncio/domain/VersaoInfo.java"
git mv "$SRC/domain/model/Nicho.java"                                                        "$SRC/anuncio/domain/Nicho.java"
git mv "$SRC/domain/model/StatusAnuncio.java"                                                "$SRC/anuncio/domain/StatusAnuncio.java"
git mv "$SRC/domain/model/OrdemAnuncio.java"                                                 "$SRC/anuncio/domain/OrdemAnuncio.java"
git mv "$SRC/domain/exception/AnuncioInvalidoException.java"                                 "$SRC/anuncio/domain/exception/AnuncioInvalidoException.java"
git mv "$SRC/domain/exception/AnuncioNaoEncontradoException.java"                            "$SRC/anuncio/domain/exception/AnuncioNaoEncontradoException.java"
git mv "$SRC/adapter/out/persistence/cosmosdb/AnuncioCosmosAdapter.java"                     "$SRC/anuncio/persistence/AnuncioCosmosAdapter.java"
git mv "$SRC/adapter/out/persistence/cosmosdb/document/AnuncioDocument.java"                 "$SRC/anuncio/persistence/document/AnuncioDocument.java"
git mv "$SRC/adapter/out/persistence/cosmosdb/mapper/AnuncioDocumentMapper.java"             "$SRC/anuncio/persistence/mapper/AnuncioDocumentMapper.java"
git mv "$SRC/adapter/out/persistence/cosmosdb/repository/AnuncioCosmosRepository.java"       "$SRC/anuncio/persistence/repository/AnuncioCosmosRepository.java"
git mv "$TST/adapter/in/web/controller/AnuncioControllerFiltrosTest.java"                    "$TST/anuncio/web/AnuncioControllerFiltrosTest.java"
git mv "$TST/adapter/out/persistence/cosmosdb/AnuncioCosmosAdapterPaginacaoTest.java"        "$TST/anuncio/persistence/AnuncioCosmosAdapterPaginacaoTest.java"

# === USUARIO moves ===
git mv "$SRC/adapter/in/web/controller/AuthController.java"                                  "$SRC/usuario/web/AuthController.java"
git mv "$SRC/adapter/in/web/dto/request/AlterarSenhaRequest.java"                            "$SRC/usuario/web/dto/request/AlterarSenhaRequest.java"
git mv "$SRC/adapter/in/web/dto/request/RegistroRequest.java"                                "$SRC/usuario/web/dto/request/RegistroRequest.java"
git mv "$SRC/adapter/in/web/dto/request/LoginRequest.java"                                   "$SRC/usuario/web/dto/request/LoginRequest.java"
git mv "$SRC/adapter/in/web/dto/request/GoogleAuthRequest.java"                              "$SRC/usuario/web/dto/request/GoogleAuthRequest.java"
git mv "$SRC/adapter/in/web/dto/response/AuthResponse.java"                                  "$SRC/usuario/web/dto/response/AuthResponse.java"
git mv "$SRC/application/ports/in/RegistrarUsuarioUseCase.java"                              "$SRC/usuario/application/ports/in/RegistrarUsuarioUseCase.java"
git mv "$SRC/application/ports/in/AutenticarUsuarioUseCase.java"                             "$SRC/usuario/application/ports/in/AutenticarUsuarioUseCase.java"
git mv "$SRC/application/ports/in/AutenticarGoogleUseCase.java"                              "$SRC/usuario/application/ports/in/AutenticarGoogleUseCase.java"
git mv "$SRC/application/ports/in/AlterarSenhaUseCase.java"                                  "$SRC/usuario/application/ports/in/AlterarSenhaUseCase.java"
git mv "$SRC/application/ports/in/ExcluirContaUseCase.java"                                  "$SRC/usuario/application/ports/in/ExcluirContaUseCase.java"
git mv "$SRC/application/ports/out/UsuarioRepositoryPort.java"                               "$SRC/usuario/application/ports/out/UsuarioRepositoryPort.java"
git mv "$SRC/application/ports/out/GoogleAuthPort.java"                                      "$SRC/usuario/application/ports/out/GoogleAuthPort.java"
git mv "$SRC/application/usecase/RegistrarUsuarioUseCaseImpl.java"                           "$SRC/usuario/application/usecase/RegistrarUsuarioUseCaseImpl.java"
git mv "$SRC/application/usecase/AutenticarUsuarioUseCaseImpl.java"                          "$SRC/usuario/application/usecase/AutenticarUsuarioUseCaseImpl.java"
git mv "$SRC/application/usecase/AutenticarGoogleUseCaseImpl.java"                           "$SRC/usuario/application/usecase/AutenticarGoogleUseCaseImpl.java"
git mv "$SRC/application/usecase/AlterarSenhaUseCaseImpl.java"                               "$SRC/usuario/application/usecase/AlterarSenhaUseCaseImpl.java"
git mv "$SRC/application/usecase/ExcluirContaUseCaseImpl.java"                               "$SRC/usuario/application/usecase/ExcluirContaUseCaseImpl.java"
git mv "$SRC/domain/model/Usuario.java"                                                      "$SRC/usuario/domain/Usuario.java"
git mv "$SRC/domain/exception/EmailJaCadastradoException.java"                               "$SRC/usuario/domain/exception/EmailJaCadastradoException.java"
git mv "$SRC/domain/exception/CredenciaisInvalidasException.java"                            "$SRC/usuario/domain/exception/CredenciaisInvalidasException.java"
git mv "$SRC/domain/exception/UsuarioNaoEncontradoException.java"                            "$SRC/usuario/domain/exception/UsuarioNaoEncontradoException.java"
git mv "$SRC/adapter/out/persistence/postgres/UsuarioJpaAdapter.java"                        "$SRC/usuario/persistence/UsuarioJpaAdapter.java"
git mv "$SRC/adapter/out/persistence/postgres/entity/UsuarioEntity.java"                     "$SRC/usuario/persistence/entity/UsuarioEntity.java"
git mv "$SRC/adapter/out/persistence/postgres/mapper/UsuarioMapper.java"                     "$SRC/usuario/persistence/mapper/UsuarioMapper.java"
git mv "$SRC/adapter/out/persistence/postgres/repository/UsuarioJpaRepository.java"          "$SRC/usuario/persistence/repository/UsuarioJpaRepository.java"
git mv "$SRC/adapter/out/external/google/GoogleAuthAdapter.java"                             "$SRC/usuario/external/google/GoogleAuthAdapter.java"

echo "=== MOVES DONE ==="

# === Package updates ===
setpkg() {
  local file="$1"; local new="$2"
  sed -i "1,/^package /{s|^package .*;|package ${new};|;}" "$file"
}

# Anuncio
setpkg "$SRC/anuncio/web/AnuncioController.java"                                             "com.teachei.api.anuncio.web"
setpkg "$SRC/anuncio/web/dto/request/CriarAnuncioRequest.java"                                "com.teachei.api.anuncio.web.dto.request"
setpkg "$SRC/anuncio/web/dto/request/AtualizarAnuncioRequest.java"                            "com.teachei.api.anuncio.web.dto.request"
setpkg "$SRC/anuncio/web/dto/request/FiltroAnuncioQuery.java"                                 "com.teachei.api.anuncio.web.dto.request"
setpkg "$SRC/anuncio/web/dto/response/AnuncioResponse.java"                                   "com.teachei.api.anuncio.web.dto.response"
setpkg "$SRC/anuncio/web/dto/response/FiltrosDisponiveisResponse.java"                        "com.teachei.api.anuncio.web.dto.response"
setpkg "$SRC/anuncio/application/ports/in/CriarAnuncioUseCase.java"                            "com.teachei.api.anuncio.application.ports.in"
setpkg "$SRC/anuncio/application/ports/in/AtualizarAnuncioUseCase.java"                        "com.teachei.api.anuncio.application.ports.in"
setpkg "$SRC/anuncio/application/ports/in/ExcluirAnuncioUseCase.java"                          "com.teachei.api.anuncio.application.ports.in"
setpkg "$SRC/anuncio/application/ports/in/FinalizarAnuncioUseCase.java"                        "com.teachei.api.anuncio.application.ports.in"
setpkg "$SRC/anuncio/application/ports/in/BuscarAnunciosUseCase.java"                          "com.teachei.api.anuncio.application.ports.in"
setpkg "$SRC/anuncio/application/ports/in/BuscarFiltrosDisponiveisUseCase.java"                "com.teachei.api.anuncio.application.ports.in"
setpkg "$SRC/anuncio/application/ports/out/AnuncioRepositoryPort.java"                         "com.teachei.api.anuncio.application.ports.out"
setpkg "$SRC/anuncio/application/usecase/CriarAnuncioUseCaseImpl.java"                         "com.teachei.api.anuncio.application.usecase"
setpkg "$SRC/anuncio/application/usecase/AtualizarAnuncioUseCaseImpl.java"                     "com.teachei.api.anuncio.application.usecase"
setpkg "$SRC/anuncio/application/usecase/ExcluirAnuncioUseCaseImpl.java"                       "com.teachei.api.anuncio.application.usecase"
setpkg "$SRC/anuncio/application/usecase/FinalizarAnuncioUseCaseImpl.java"                     "com.teachei.api.anuncio.application.usecase"
setpkg "$SRC/anuncio/application/usecase/BuscarAnunciosUseCaseImpl.java"                       "com.teachei.api.anuncio.application.usecase"
setpkg "$SRC/anuncio/application/usecase/BuscarFiltrosDisponiveisUseCaseImpl.java"             "com.teachei.api.anuncio.application.usecase"
setpkg "$SRC/anuncio/domain/AnuncioService.java"                                               "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/Anuncio.java"                                                      "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/VeiculoInfo.java"                                                  "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/ContatoInfo.java"                                                  "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/OpcionalVeiculo.java"                                              "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/VersaoInfo.java"                                                   "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/Nicho.java"                                                        "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/StatusAnuncio.java"                                                "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/OrdemAnuncio.java"                                                 "com.teachei.api.anuncio.domain"
setpkg "$SRC/anuncio/domain/exception/AnuncioInvalidoException.java"                           "com.teachei.api.anuncio.domain.exception"
setpkg "$SRC/anuncio/domain/exception/AnuncioNaoEncontradoException.java"                      "com.teachei.api.anuncio.domain.exception"
setpkg "$SRC/anuncio/persistence/AnuncioCosmosAdapter.java"                                    "com.teachei.api.anuncio.persistence"
setpkg "$SRC/anuncio/persistence/document/AnuncioDocument.java"                                "com.teachei.api.anuncio.persistence.document"
setpkg "$SRC/anuncio/persistence/mapper/AnuncioDocumentMapper.java"                            "com.teachei.api.anuncio.persistence.mapper"
setpkg "$SRC/anuncio/persistence/repository/AnuncioCosmosRepository.java"                      "com.teachei.api.anuncio.persistence.repository"
setpkg "$TST/anuncio/web/AnuncioControllerFiltrosTest.java"                                    "com.teachei.api.anuncio.web"
setpkg "$TST/anuncio/persistence/AnuncioCosmosAdapterPaginacaoTest.java"                       "com.teachei.api.anuncio.persistence"

# Usuario
setpkg "$SRC/usuario/web/AuthController.java"                                                  "com.teachei.api.usuario.web"
setpkg "$SRC/usuario/web/dto/request/AlterarSenhaRequest.java"                                  "com.teachei.api.usuario.web.dto.request"
setpkg "$SRC/usuario/web/dto/request/RegistroRequest.java"                                      "com.teachei.api.usuario.web.dto.request"
setpkg "$SRC/usuario/web/dto/request/LoginRequest.java"                                         "com.teachei.api.usuario.web.dto.request"
setpkg "$SRC/usuario/web/dto/request/GoogleAuthRequest.java"                                    "com.teachei.api.usuario.web.dto.request"
setpkg "$SRC/usuario/web/dto/response/AuthResponse.java"                                        "com.teachei.api.usuario.web.dto.response"
setpkg "$SRC/usuario/application/ports/in/RegistrarUsuarioUseCase.java"                          "com.teachei.api.usuario.application.ports.in"
setpkg "$SRC/usuario/application/ports/in/AutenticarUsuarioUseCase.java"                         "com.teachei.api.usuario.application.ports.in"
setpkg "$SRC/usuario/application/ports/in/AutenticarGoogleUseCase.java"                          "com.teachei.api.usuario.application.ports.in"
setpkg "$SRC/usuario/application/ports/in/AlterarSenhaUseCase.java"                              "com.teachei.api.usuario.application.ports.in"
setpkg "$SRC/usuario/application/ports/in/ExcluirContaUseCase.java"                              "com.teachei.api.usuario.application.ports.in"
setpkg "$SRC/usuario/application/ports/out/UsuarioRepositoryPort.java"                           "com.teachei.api.usuario.application.ports.out"
setpkg "$SRC/usuario/application/ports/out/GoogleAuthPort.java"                                  "com.teachei.api.usuario.application.ports.out"
setpkg "$SRC/usuario/application/usecase/RegistrarUsuarioUseCaseImpl.java"                       "com.teachei.api.usuario.application.usecase"
setpkg "$SRC/usuario/application/usecase/AutenticarUsuarioUseCaseImpl.java"                      "com.teachei.api.usuario.application.usecase"
setpkg "$SRC/usuario/application/usecase/AutenticarGoogleUseCaseImpl.java"                       "com.teachei.api.usuario.application.usecase"
setpkg "$SRC/usuario/application/usecase/AlterarSenhaUseCaseImpl.java"                           "com.teachei.api.usuario.application.usecase"
setpkg "$SRC/usuario/application/usecase/ExcluirContaUseCaseImpl.java"                           "com.teachei.api.usuario.application.usecase"
setpkg "$SRC/usuario/domain/Usuario.java"                                                        "com.teachei.api.usuario.domain"
setpkg "$SRC/usuario/domain/exception/EmailJaCadastradoException.java"                           "com.teachei.api.usuario.domain.exception"
setpkg "$SRC/usuario/domain/exception/CredenciaisInvalidasException.java"                        "com.teachei.api.usuario.domain.exception"
setpkg "$SRC/usuario/domain/exception/UsuarioNaoEncontradoException.java"                        "com.teachei.api.usuario.domain.exception"
setpkg "$SRC/usuario/persistence/UsuarioJpaAdapter.java"                                         "com.teachei.api.usuario.persistence"
setpkg "$SRC/usuario/persistence/entity/UsuarioEntity.java"                                      "com.teachei.api.usuario.persistence.entity"
setpkg "$SRC/usuario/persistence/mapper/UsuarioMapper.java"                                      "com.teachei.api.usuario.persistence.mapper"
setpkg "$SRC/usuario/persistence/repository/UsuarioJpaRepository.java"                           "com.teachei.api.usuario.persistence.repository"
setpkg "$SRC/usuario/external/google/GoogleAuthAdapter.java"                                     "com.teachei.api.usuario.external.google"

echo "=== PACKAGES DONE ==="

# === IMPORTS across codebase ===
find TeAchei/src -name "*.java" -type f -exec sed -i \
  `# anuncio` \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.controller\.AnuncioController|com.teachei.api.anuncio.web.AnuncioController|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.CriarAnuncioRequest|com.teachei.api.anuncio.web.dto.request.CriarAnuncioRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.AtualizarAnuncioRequest|com.teachei.api.anuncio.web.dto.request.AtualizarAnuncioRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.FiltroAnuncioQuery|com.teachei.api.anuncio.web.dto.request.FiltroAnuncioQuery|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.AnuncioResponse|com.teachei.api.anuncio.web.dto.response.AnuncioResponse|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.FiltrosDisponiveisResponse|com.teachei.api.anuncio.web.dto.response.FiltrosDisponiveisResponse|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.CriarAnuncioUseCase|com.teachei.api.anuncio.application.ports.in.CriarAnuncioUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.AtualizarAnuncioUseCase|com.teachei.api.anuncio.application.ports.in.AtualizarAnuncioUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.ExcluirAnuncioUseCase|com.teachei.api.anuncio.application.ports.in.ExcluirAnuncioUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.FinalizarAnuncioUseCase|com.teachei.api.anuncio.application.ports.in.FinalizarAnuncioUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.BuscarAnunciosUseCase|com.teachei.api.anuncio.application.ports.in.BuscarAnunciosUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.BuscarFiltrosDisponiveisUseCase|com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.out\.AnuncioRepositoryPort|com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.CriarAnuncioUseCaseImpl|com.teachei.api.anuncio.application.usecase.CriarAnuncioUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.AtualizarAnuncioUseCaseImpl|com.teachei.api.anuncio.application.usecase.AtualizarAnuncioUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.ExcluirAnuncioUseCaseImpl|com.teachei.api.anuncio.application.usecase.ExcluirAnuncioUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.FinalizarAnuncioUseCaseImpl|com.teachei.api.anuncio.application.usecase.FinalizarAnuncioUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.BuscarAnunciosUseCaseImpl|com.teachei.api.anuncio.application.usecase.BuscarAnunciosUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.BuscarFiltrosDisponiveisUseCaseImpl|com.teachei.api.anuncio.application.usecase.BuscarFiltrosDisponiveisUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.domain\.service\.AnuncioService|com.teachei.api.anuncio.domain.AnuncioService|g' \
  -e 's|com\.teachei\.api\.domain\.model\.Anuncio\b|com.teachei.api.anuncio.domain.Anuncio|g' \
  -e 's|com\.teachei\.api\.domain\.model\.VeiculoInfo|com.teachei.api.anuncio.domain.VeiculoInfo|g' \
  -e 's|com\.teachei\.api\.domain\.model\.ContatoInfo|com.teachei.api.anuncio.domain.ContatoInfo|g' \
  -e 's|com\.teachei\.api\.domain\.model\.OpcionalVeiculo|com.teachei.api.anuncio.domain.OpcionalVeiculo|g' \
  -e 's|com\.teachei\.api\.domain\.model\.VersaoInfo|com.teachei.api.anuncio.domain.VersaoInfo|g' \
  -e 's|com\.teachei\.api\.domain\.model\.Nicho|com.teachei.api.anuncio.domain.Nicho|g' \
  -e 's|com\.teachei\.api\.domain\.model\.StatusAnuncio|com.teachei.api.anuncio.domain.StatusAnuncio|g' \
  -e 's|com\.teachei\.api\.domain\.model\.OrdemAnuncio|com.teachei.api.anuncio.domain.OrdemAnuncio|g' \
  -e 's|com\.teachei\.api\.domain\.exception\.AnuncioInvalidoException|com.teachei.api.anuncio.domain.exception.AnuncioInvalidoException|g' \
  -e 's|com\.teachei\.api\.domain\.exception\.AnuncioNaoEncontradoException|com.teachei.api.anuncio.domain.exception.AnuncioNaoEncontradoException|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.cosmosdb\.AnuncioCosmosAdapter|com.teachei.api.anuncio.persistence.AnuncioCosmosAdapter|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.cosmosdb\.document\.AnuncioDocument|com.teachei.api.anuncio.persistence.document.AnuncioDocument|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.cosmosdb\.mapper\.AnuncioDocumentMapper|com.teachei.api.anuncio.persistence.mapper.AnuncioDocumentMapper|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.cosmosdb\.repository\.AnuncioCosmosRepository|com.teachei.api.anuncio.persistence.repository.AnuncioCosmosRepository|g' \
  `# usuario` \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.controller\.AuthController|com.teachei.api.usuario.web.AuthController|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.AlterarSenhaRequest|com.teachei.api.usuario.web.dto.request.AlterarSenhaRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.RegistroRequest|com.teachei.api.usuario.web.dto.request.RegistroRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.LoginRequest|com.teachei.api.usuario.web.dto.request.LoginRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.request\.GoogleAuthRequest|com.teachei.api.usuario.web.dto.request.GoogleAuthRequest|g' \
  -e 's|com\.teachei\.api\.adapter\.in\.web\.dto\.response\.AuthResponse|com.teachei.api.usuario.web.dto.response.AuthResponse|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.RegistrarUsuarioUseCase|com.teachei.api.usuario.application.ports.in.RegistrarUsuarioUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.AutenticarUsuarioUseCase|com.teachei.api.usuario.application.ports.in.AutenticarUsuarioUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.AutenticarGoogleUseCase|com.teachei.api.usuario.application.ports.in.AutenticarGoogleUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.AlterarSenhaUseCase|com.teachei.api.usuario.application.ports.in.AlterarSenhaUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.in\.ExcluirContaUseCase|com.teachei.api.usuario.application.ports.in.ExcluirContaUseCase|g' \
  -e 's|com\.teachei\.api\.application\.ports\.out\.UsuarioRepositoryPort|com.teachei.api.usuario.application.ports.out.UsuarioRepositoryPort|g' \
  -e 's|com\.teachei\.api\.application\.ports\.out\.GoogleAuthPort|com.teachei.api.usuario.application.ports.out.GoogleAuthPort|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.RegistrarUsuarioUseCaseImpl|com.teachei.api.usuario.application.usecase.RegistrarUsuarioUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.AutenticarUsuarioUseCaseImpl|com.teachei.api.usuario.application.usecase.AutenticarUsuarioUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.AutenticarGoogleUseCaseImpl|com.teachei.api.usuario.application.usecase.AutenticarGoogleUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.AlterarSenhaUseCaseImpl|com.teachei.api.usuario.application.usecase.AlterarSenhaUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.application\.usecase\.ExcluirContaUseCaseImpl|com.teachei.api.usuario.application.usecase.ExcluirContaUseCaseImpl|g' \
  -e 's|com\.teachei\.api\.domain\.model\.Usuario\b|com.teachei.api.usuario.domain.Usuario|g' \
  -e 's|com\.teachei\.api\.domain\.exception\.EmailJaCadastradoException|com.teachei.api.usuario.domain.exception.EmailJaCadastradoException|g' \
  -e 's|com\.teachei\.api\.domain\.exception\.CredenciaisInvalidasException|com.teachei.api.usuario.domain.exception.CredenciaisInvalidasException|g' \
  -e 's|com\.teachei\.api\.domain\.exception\.UsuarioNaoEncontradoException|com.teachei.api.usuario.domain.exception.UsuarioNaoEncontradoException|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.UsuarioJpaAdapter|com.teachei.api.usuario.persistence.UsuarioJpaAdapter|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.entity\.UsuarioEntity|com.teachei.api.usuario.persistence.entity.UsuarioEntity|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.mapper\.UsuarioMapper|com.teachei.api.usuario.persistence.mapper.UsuarioMapper|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.persistence\.postgres\.repository\.UsuarioJpaRepository|com.teachei.api.usuario.persistence.repository.UsuarioJpaRepository|g' \
  -e 's|com\.teachei\.api\.adapter\.out\.external\.google\.GoogleAuthAdapter|com.teachei.api.usuario.external.google.GoogleAuthAdapter|g' \
  {} \;

echo "=== IMPORTS DONE ==="
