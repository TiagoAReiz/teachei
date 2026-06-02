package com.teachei.api.usuario.application.ports.in;

import java.util.UUID;

/**
 * Inbound port for account deletion use case (LGPD compliance).
 */
public interface ExcluirContaUseCase {

    /**
     * Deletes a user account and all associated data.
     *
     * @param usuarioId the user ID requesting deletion
     */
    void executar(UUID usuarioId);
}
