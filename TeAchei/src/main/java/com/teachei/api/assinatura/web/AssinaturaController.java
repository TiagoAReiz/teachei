package com.teachei.api.assinatura.web;

import com.teachei.api.assinatura.web.dto.request.CriarAssinaturaRequest;
import com.teachei.api.assinatura.web.dto.response.AssinaturaPreferenciaResponse;
import com.teachei.api.assinatura.web.dto.response.AssinaturaResponse;
import com.teachei.api.assinatura.web.dto.response.PlanoResponse;
import com.teachei.api.assinatura.application.ports.in.BuscarPlanosUseCase;
import com.teachei.api.assinatura.application.ports.in.CancelarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.in.CriarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.in.VerificarAssinaturaUseCase;
import com.teachei.api.shared.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST controller for subscription management.
 */
@RestController
@RequestMapping("/v1/assinaturas")
public class AssinaturaController {

    private final BuscarPlanosUseCase buscarPlanosUseCase;
    private final CriarAssinaturaUseCase criarAssinaturaUseCase;
    private final VerificarAssinaturaUseCase verificarAssinaturaUseCase;
    private final CancelarAssinaturaUseCase cancelarAssinaturaUseCase;

    public AssinaturaController(BuscarPlanosUseCase buscarPlanosUseCase,
                                 CriarAssinaturaUseCase criarAssinaturaUseCase,
                                 VerificarAssinaturaUseCase verificarAssinaturaUseCase,
                                 CancelarAssinaturaUseCase cancelarAssinaturaUseCase) {
        this.buscarPlanosUseCase = buscarPlanosUseCase;
        this.criarAssinaturaUseCase = criarAssinaturaUseCase;
        this.verificarAssinaturaUseCase = verificarAssinaturaUseCase;
        this.cancelarAssinaturaUseCase = cancelarAssinaturaUseCase;
    }

    /**
     * List available subscription plans with prices.
     * This endpoint is public (no auth required).
     */
    @GetMapping("/planos")
    public ResponseEntity<List<PlanoResponse>> listarPlanos() {
        var planos = buscarPlanosUseCase.executar();
        var response = planos.stream()
            .map(p -> PlanoResponse.from(
                p.id(), p.nome(), p.precoCentavos(), p.duracaoDias(), p.recorrente()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * Get current user's subscription status.
     */
    @GetMapping("/minha")
    public ResponseEntity<?> minhaAssinatura(
            @AuthenticationPrincipal CurrentUser currentUser) {
        var assinatura = verificarAssinaturaUseCase.buscarAssinaturaAtual(currentUser.getId());
        if (assinatura.isEmpty()) {
            // Return a meaningful response when no subscription exists
            return ResponseEntity.ok(new NoSubscriptionResponse(false, null, null));
        }
        return ResponseEntity.ok(AssinaturaResponse.from(assinatura.get()));
    }
    
    record NoSubscriptionResponse(
        boolean assinaturaAtiva,
        String planoNome,
        String status
    ) {}

    /**
     * Check if current user has an active subscription.
     */
    @GetMapping("/status")
    public ResponseEntity<StatusResponse> verificarStatus(
            @AuthenticationPrincipal CurrentUser currentUser) {
        boolean ativa = verificarAssinaturaUseCase.temAssinaturaAtiva(currentUser.getId());
        return ResponseEntity.ok(new StatusResponse(ativa));
    }

    /**
     * Create a new subscription (initiates payment).
     */
    @PostMapping
    public ResponseEntity<AssinaturaPreferenciaResponse> criarAssinatura(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody CriarAssinaturaRequest request) {
        var preferencia = criarAssinaturaUseCase.executar(currentUser.getId(), request.plano());
        return ResponseEntity.ok(AssinaturaPreferenciaResponse.from(
            preferencia.assinaturaId(),
            preferencia.preferenceId(),
            preferencia.initPoint(),
            preferencia.sandboxInitPoint(),
            preferencia.valorCentavos()
        ));
    }

    /**
     * Cancel a subscription.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarAssinatura(
            @AuthenticationPrincipal CurrentUser currentUser,
            @PathVariable UUID id) {
        cancelarAssinaturaUseCase.executar(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }

    record StatusResponse(boolean assinaturaAtiva) {}
}
