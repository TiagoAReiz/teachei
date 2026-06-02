package com.teachei.api.assinatura.application.ports.in;

import com.teachei.api.assinatura.domain.Assinatura;

import java.util.Optional;
import java.util.UUID;

/**
 * Use case for checking subscription status.
 */
public interface VerificarAssinaturaUseCase {

    /**
     * Check if user has an active subscription.
     */
    boolean temAssinaturaAtiva(UUID usuarioId);

    /**
     * Get the current subscription for a user.
     */
    Optional<Assinatura> buscarAssinaturaAtual(UUID usuarioId);
}
