package com.teachei.api.anuncio.application.ports.in;

import java.util.UUID;

/**
 * Inbound port for deleting a purchase intention.
 */
public interface ExcluirAnuncioUseCase {

    /**
     * Deletes an existing intention.
     * Only the owner can delete, and only when status is PENDENTE_PAGAMENTO.
     *
     * @param usuarioId the ID of the user making the request
     * @param anuncioId the ID of the intention to delete
     */
    void executar(UUID usuarioId, String anuncioId);
}
