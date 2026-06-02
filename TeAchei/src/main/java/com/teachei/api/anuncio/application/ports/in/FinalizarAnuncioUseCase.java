package com.teachei.api.anuncio.application.ports.in;

import com.teachei.api.anuncio.domain.model.Anuncio;

import java.util.UUID;

/**
 * Inbound port for marking a purchase intention as completed/sold.
 */
public interface FinalizarAnuncioUseCase {

    /**
     * Marks an intention as completed (the user found what they were looking for).
     * Only the owner can finalize, and only when status is ATIVO.
     *
     * @param usuarioId the ID of the user making the request
     * @param anuncioId the ID of the intention to finalize
     * @return the updated intention
     */
    Anuncio executar(UUID usuarioId, String anuncioId);
}
