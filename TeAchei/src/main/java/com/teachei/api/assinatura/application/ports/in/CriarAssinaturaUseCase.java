package com.teachei.api.assinatura.application.ports.in;

import com.teachei.api.assinatura.domain.PlanoAssinatura;

import java.util.UUID;

/**
 * Use case for creating a new subscription.
 */
public interface CriarAssinaturaUseCase {

    /**
     * Create a subscription payment preference.
     * 
     * @param usuarioId the user ID
     * @param plano the plan type
     * @return payment preference with checkout URL
     */
    AssinaturaPreferencia executar(UUID usuarioId, PlanoAssinatura plano);

    /**
     * Payment preference result.
     */
    record AssinaturaPreferencia(
        String assinaturaId,
        String preferenceId,
        String initPoint,
        String sandboxInitPoint,
        int valorCentavos
    ) {}
}
