package com.teachei.api.assinatura.application.ports.in;

import java.util.UUID;

/**
 * Use case for cancelling a subscription.
 */
public interface CancelarAssinaturaUseCase {

    /**
     * Cancel a subscription.
     * 
     * @param usuarioId the user requesting cancellation
     * @param assinaturaId the subscription to cancel
     */
    void executar(UUID usuarioId, UUID assinaturaId);
}
