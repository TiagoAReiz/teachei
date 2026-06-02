package com.teachei.api.assinatura.application.ports.out;

import com.teachei.api.assinatura.domain.model.Assinatura;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Outbound port for subscription persistence operations.
 */
public interface AssinaturaRepositoryPort {

    /**
     * Save a subscription.
     */
    Assinatura salvar(Assinatura assinatura);

    /**
     * Find subscription by ID.
     */
    Optional<Assinatura> buscarPorId(UUID id);

    /**
     * Find all subscriptions for a user.
     */
    List<Assinatura> buscarPorUsuarioId(UUID usuarioId);

    /**
     * Find the current active subscription for a user.
     */
    Optional<Assinatura> buscarAtivaPorUsuarioId(UUID usuarioId);

    /**
     * Check if user has an active subscription.
     */
    boolean temAssinaturaAtiva(UUID usuarioId);

    /**
     * Find subscription by payment transaction ID.
     */
    Optional<Assinatura> buscarPorTransacaoId(String transacaoId);

    /**
     * Find expired subscriptions that need status update.
     */
    List<Assinatura> buscarExpiradas();

    /**
     * Delete all subscriptions for a user.
     */
    void deletarPorUsuarioId(UUID usuarioId);
}
