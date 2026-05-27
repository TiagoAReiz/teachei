package com.teachei.api.adapter.in.web.controller;

import com.teachei.api.adapter.in.web.dto.request.AtualizarAnuncioRequest;
import com.teachei.api.adapter.in.web.dto.request.CriarAnuncioRequest;
import com.teachei.api.adapter.in.web.dto.response.AnuncioResponse;
import com.teachei.api.adapter.in.web.dto.response.FiltrosDisponiveisResponse;
import com.teachei.api.adapter.in.web.dto.response.PaginaResponse;
import com.teachei.api.application.ports.in.*;
import com.teachei.api.config.security.CurrentUser;
import com.teachei.api.domain.model.OrdemAnuncio;
import com.teachei.api.domain.model.TipoVeiculo;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
                        // Accept both 'tipo' and 'tipoVeiculo' parameter names
                        @RequestParam(required = false) TipoVeiculo tipo,
                        @RequestParam(required = false) TipoVeiculo tipoVeiculo,
                        @RequestParam(required = false) String marcaCodigo,
                        @RequestParam(required = false) String modeloCodigo,
                        @RequestParam(required = false) String modelos, // Comma-separated model codes
                        // Year range filters (also accept legacy 'ano' for backwards compatibility)
                        @RequestParam(required = false) Integer ano,
                        @RequestParam(required = false) Integer anoMin,
                        @RequestParam(required = false) Integer anoMax,
                        // Price range filters (also accept legacy 'precoMinimo' for backwards
                        // compatibility)
                        @RequestParam(required = false) BigDecimal precoMinimo,
                        @RequestParam(required = false) BigDecimal precoMin,
                        @RequestParam(required = false) BigDecimal precoMax,
                        // Mileage range filters
                        @RequestParam(required = false) Integer kmMin,
                        @RequestParam(required = false) Integer kmMax,
                        // Text search
                        @RequestParam(required = false) String search,
                        // Optionals filter (comma-separated)
                        @RequestParam(required = false) List<String> opcionais,
                        @RequestParam(required = false) String cidade,
                        @RequestParam(required = false) String estado,
                        // Sort order
                        @RequestParam(required = false) OrdemAnuncio ordenar,
                        // Accept both 'page'/'pagina' and 'size'/'tamanho' parameter names
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(required = false) Integer pagina,
                        @RequestParam(defaultValue = "20") int size,
                        @RequestParam(required = false) Integer tamanho) {

                // Use first non-null value for each parameter
                TipoVeiculo tipoFinal = tipo != null ? tipo : tipoVeiculo;
                int pageFinal = pagina != null ? pagina : page;
                int sizeFinal = tamanho != null ? tamanho : size;

                // Handle legacy 'ano' parameter - treat as both min and max
                Integer anoMinFinal = anoMin != null ? anoMin : ano;
                Integer anoMaxFinal = anoMax != null ? anoMax : ano;

                // Handle legacy 'precoMinimo' parameter
                BigDecimal precoMinFinal = precoMin != null ? precoMin : precoMinimo;

                // Parse comma-separated modelos into a list
                List<String> modelosList = modelos != null && !modelos.isBlank()
                                ? java.util.Arrays.asList(modelos.split(","))
                                : null;

                var filtro = new BuscarAnunciosUseCase.FiltroAnuncio(
                                tipoFinal, marcaCodigo, modeloCodigo, modelosList,
                                anoMinFinal, anoMaxFinal,
                                precoMinFinal, precoMax,
                                kmMin, kmMax,
                                search, opcionais,
                                cidade, estado,
                                ordenar);

                var resultado = buscarAnunciosUseCase.buscar(filtro, pageFinal, sizeFinal);

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
