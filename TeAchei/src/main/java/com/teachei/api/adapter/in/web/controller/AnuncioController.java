package com.teachei.api.adapter.in.web.controller;

import com.teachei.api.adapter.in.web.dto.request.AtualizarAnuncioRequest;
import com.teachei.api.adapter.in.web.dto.request.CriarAnuncioRequest;
import com.teachei.api.adapter.in.web.dto.request.FiltroAnuncioQuery;
import com.teachei.api.adapter.in.web.dto.response.AnuncioResponse;
import com.teachei.api.adapter.in.web.dto.response.FiltrosDisponiveisResponse;
import com.teachei.api.adapter.in.web.dto.response.PaginaResponse;
import com.teachei.api.application.ports.in.*;
import com.teachei.api.shared.security.CurrentUser;
import com.teachei.api.domain.model.TipoVeiculo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/anuncios")
public class AnuncioController {

        private final CriarAnuncioUseCase criarAnuncioUseCase;
        private final BuscarAnunciosUseCase buscarAnunciosUseCase;
        private final BuscarFiltrosDisponiveisUseCase buscarFiltrosDisponiveisUseCase;
        private final AtualizarAnuncioUseCase atualizarAnuncioUseCase;
        private final ExcluirAnuncioUseCase excluirAnuncioUseCase;
        private final FinalizarAnuncioUseCase finalizarAnuncioUseCase;
        private final VerificarAssinaturaUseCase verificarAssinaturaUseCase;

        // Feature flag: quando false (default), o app é gratuito e o contato fica
        // sempre visível. Quando true, aplica a verificação real de assinatura.
        @Value("${app.subscription.enabled:false}")
        private boolean subscriptionEnabled;

        public AnuncioController(CriarAnuncioUseCase criarAnuncioUseCase,
                        BuscarAnunciosUseCase buscarAnunciosUseCase,
                        BuscarFiltrosDisponiveisUseCase buscarFiltrosDisponiveisUseCase,
                        AtualizarAnuncioUseCase atualizarAnuncioUseCase,
                        ExcluirAnuncioUseCase excluirAnuncioUseCase,
                        FinalizarAnuncioUseCase finalizarAnuncioUseCase,
                        VerificarAssinaturaUseCase verificarAssinaturaUseCase) {
                this.criarAnuncioUseCase = criarAnuncioUseCase;
                this.buscarAnunciosUseCase = buscarAnunciosUseCase;
                this.buscarFiltrosDisponiveisUseCase = buscarFiltrosDisponiveisUseCase;
                this.atualizarAnuncioUseCase = atualizarAnuncioUseCase;
                this.excluirAnuncioUseCase = excluirAnuncioUseCase;
                this.finalizarAnuncioUseCase = finalizarAnuncioUseCase;
                this.verificarAssinaturaUseCase = verificarAssinaturaUseCase;
        }

        @PostMapping
        public ResponseEntity<AnuncioResponse> criar(
                        @AuthenticationPrincipal CurrentUser currentUser,
                        @Valid @RequestBody CriarAnuncioRequest request) {

                // Map version requests to commands
                var versoesCommand = request.versoes() != null
                                ? request.versoes().stream()
                                                .map(v -> new CriarAnuncioUseCase.VersaoCommand(v.codigo(), v.nome()))
                                                .toList()
                                : List.<CriarAnuncioUseCase.VersaoCommand>of();

                var command = new CriarAnuncioUseCase.CriarAnuncioCommand(
                                request.tipo(),
                                request.marcaCodigo(),
                                request.marcaNome(),
                                request.modeloCodigo(),
                                request.modeloNome(),
                                request.modeloBaseNome(),
                                versoesCommand,
                                request.todasVersoes(),
                                request.anos(),
                                request.cores(),
                                request.precoMaximo(),
                                request.quilometragemMinima(),
                                request.quilometragemMaxima(),
                                request.opcionais(),
                                request.observacoes(),
                                request.dadosManuais(),
                                request.cidade(),
                                request.estado(),
                                request.fotoReferenciaBase64());

                var anuncio = criarAnuncioUseCase.executar(currentUser.getId(), command);
                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(AnuncioResponse.fromDomain(anuncio));
        }

        @GetMapping
        public ResponseEntity<PaginaResponse<AnuncioResponse>> listar(
                        @AuthenticationPrincipal CurrentUser currentUser,
                        @ModelAttribute FiltroAnuncioQuery query) {

                var filtro = new BuscarAnunciosUseCase.FiltroAnuncio(
                                query.resolvedTipo(), query.marcaCodigo(),
                                query.modeloCodigo(), query.modelosList(),
                                query.resolvedAnoMin(), query.resolvedAnoMax(),
                                query.resolvedPrecoMin(), query.precoMax(),
                                query.kmMin(), query.kmMax(),
                                query.search(), query.opcionais(),
                                query.cidade(), query.estado(),
                                query.ordenar());

                var resultado = buscarAnunciosUseCase.buscar(
                                filtro, query.resolvedPage(), query.resolvedSize());

                // Quando a cobrança está desativada (default), contato sempre visível.
                boolean assinaturaAtiva = !subscriptionEnabled
                                || (currentUser != null
                                                && verificarAssinaturaUseCase.temAssinaturaAtiva(currentUser.getId()));

                List<AnuncioResponse> content = resultado.items().stream()
                                .map(anuncio -> {
                                        boolean isOwner = currentUser != null
                                                        && anuncio.getUsuarioId().equals(currentUser.getId());
                                        boolean ocultarContato = subscriptionEnabled && !isOwner && !assinaturaAtiva;
                                        return AnuncioResponse.fromDomain(anuncio, ocultarContato, assinaturaAtiva);
                                })
                                .toList();

                return ResponseEntity.ok(PaginaResponse.of(
                                content,
                                resultado.pagina(),
                                resultado.tamanho(),
                                resultado.total(),
                                resultado.totalPaginas()));
        }

        @GetMapping("/filtros")
        public ResponseEntity<FiltrosDisponiveisResponse> filtrosDisponiveis(
                        @RequestParam(required = false) TipoVeiculo tipo,
                        @RequestParam(required = false) String marcaCodigo) {

                var filtros = buscarFiltrosDisponiveisUseCase.buscar(tipo, marcaCodigo);

                var response = new FiltrosDisponiveisResponse(
                                filtros.tipos(),
                                filtros.marcas().stream()
                                                .map(m -> new FiltrosDisponiveisResponse.MarcaOption(m.codigo(),
                                                                m.nome()))
                                                .toList(),
                                filtros.modelos().stream()
                                                .map(m -> new FiltrosDisponiveisResponse.ModeloOption(m.codigo(),
                                                                m.nome(), m.baseNome()))
                                                .toList(),
                                filtros.opcionais().stream()
                                                .map(op -> new FiltrosDisponiveisResponse.OpcionalOption(op.codigo(),
                                                                op.label()))
                                                .toList(),
                                filtros.localizacoes().stream()
                                                .map(loc -> new FiltrosDisponiveisResponse.LocalizacaoOption(
                                                                loc.cidade(), loc.estado()))
                                                .toList());

                return ResponseEntity.ok(response);
        }

        @GetMapping("/{id}")
        public ResponseEntity<AnuncioResponse> buscarPorId(
                        @AuthenticationPrincipal CurrentUser currentUser,
                        @PathVariable String id) {
                var anuncio = buscarAnunciosUseCase.buscarPorId(id);

                // Quando a cobrança está desativada (default), contato sempre visível.
                boolean assinaturaAtiva = !subscriptionEnabled
                                || (currentUser != null
                                                && verificarAssinaturaUseCase.temAssinaturaAtiva(currentUser.getId()));
                boolean isOwner = currentUser != null
                                && anuncio.getUsuarioId().equals(currentUser.getId());
                boolean ocultarContato = subscriptionEnabled && !isOwner && !assinaturaAtiva;

                return ResponseEntity.ok(AnuncioResponse.fromDomain(anuncio, ocultarContato, assinaturaAtiva));
        }

        @GetMapping("/meus")
        public ResponseEntity<List<AnuncioResponse>> meusAnuncios(
                        @AuthenticationPrincipal CurrentUser currentUser) {
                var anuncios = buscarAnunciosUseCase.buscarPorUsuario(currentUser.getId());
                var response = anuncios.stream()
                                .map(AnuncioResponse::fromDomain)
                                .toList();
                return ResponseEntity.ok(response);
        }

        @GetMapping("/usuario/{usuarioId}")
        public ResponseEntity<List<AnuncioResponse>> anunciosPorUsuario(
                        @AuthenticationPrincipal CurrentUser currentUser,
                        @PathVariable java.util.UUID usuarioId) {
                // Busca todas as intenções do usuário
                var anuncios = buscarAnunciosUseCase.buscarPorUsuario(usuarioId);

                // Quando a cobrança está desativada (default), contato sempre visível.
                boolean assinaturaAtiva = !subscriptionEnabled
                                || (currentUser != null
                                                && verificarAssinaturaUseCase.temAssinaturaAtiva(currentUser.getId()));

                // Filtra apenas intenções ATIVAS e aplica lógica de contato
                var response = anuncios.stream()
                                .filter(a -> a.getStatus() == com.teachei.api.domain.model.StatusAnuncio.ATIVO)
                                .map(a -> {
                                        boolean isOwner = currentUser != null
                                                        && a.getUsuarioId().equals(currentUser.getId());
                                        boolean ocultarContato = subscriptionEnabled && !isOwner && !assinaturaAtiva;
                                        return AnuncioResponse.fromDomain(a, ocultarContato, assinaturaAtiva);
                                })
                                .toList();
                return ResponseEntity.ok(response);
        }

        @PutMapping("/{id}")
        public ResponseEntity<AnuncioResponse> atualizar(
                        @AuthenticationPrincipal CurrentUser currentUser,
                        @PathVariable String id,
                        @Valid @RequestBody AtualizarAnuncioRequest request) {

                // Map version requests to commands
                var versoesCommand = request.versoes() != null
                                ? request.versoes().stream()
                                                .map(v -> new AtualizarAnuncioUseCase.VersaoCommand(v.codigo(),
                                                                v.nome()))
                                                .toList()
                                : List.<AtualizarAnuncioUseCase.VersaoCommand>of();

                var command = new AtualizarAnuncioUseCase.AtualizarAnuncioCommand(
                                versoesCommand,
                                request.todasVersoes(),
                                request.anos(),
                                request.cores(),
                                request.precoMaximo(),
                                request.quilometragemMinima(),
                                request.quilometragemMaxima(),
                                request.opcionais(),
                                request.observacoes(),
                                request.cidade(),
                                request.estado(),
                                request.fotoReferenciaBase64());

                var anuncio = atualizarAnuncioUseCase.executar(currentUser.getId(), id, command);
                return ResponseEntity.ok(AnuncioResponse.fromDomain(anuncio));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> excluir(
                        @AuthenticationPrincipal CurrentUser currentUser,
                        @PathVariable String id) {

                excluirAnuncioUseCase.executar(currentUser.getId(), id);
                return ResponseEntity.noContent().build();
        }

        @PostMapping("/{id}/finalizar")
        public ResponseEntity<AnuncioResponse> finalizar(
                        @AuthenticationPrincipal CurrentUser currentUser,
                        @PathVariable String id) {

                var anuncio = finalizarAnuncioUseCase.executar(currentUser.getId(), id);
                return ResponseEntity.ok(AnuncioResponse.fromDomain(anuncio));
        }
}
