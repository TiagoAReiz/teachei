package com.teachei.api.application.usecase;

import com.teachei.api.application.ports.in.ExcluirAnuncioUseCase;
import com.teachei.api.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.application.ports.out.BlobStoragePort;
import com.teachei.api.domain.exception.AcessoNegadoException;
import com.teachei.api.domain.exception.AnuncioInvalidoException;
import com.teachei.api.domain.exception.AnuncioNaoEncontradoException;
import com.teachei.api.domain.model.Anuncio;
import com.teachei.api.domain.model.StatusAnuncio;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

/**
 * Implementation of the delete intention use case.
 */
public class ExcluirAnuncioUseCaseImpl implements ExcluirAnuncioUseCase {

    private static final Logger log = LoggerFactory.getLogger(ExcluirAnuncioUseCaseImpl.class);

    private final AnuncioRepositoryPort anuncioRepository;
    private final BlobStoragePort blobStorage;

    public ExcluirAnuncioUseCaseImpl(AnuncioRepositoryPort anuncioRepository, BlobStoragePort blobStorage) {
        this.anuncioRepository = anuncioRepository;
        this.blobStorage = blobStorage;
    }

    @Override
    public void executar(UUID usuarioId, String anuncioId) {
        Anuncio anuncio = anuncioRepository.buscarPorId(anuncioId)
            .orElseThrow(() -> new AnuncioNaoEncontradoException(anuncioId));

        // Check ownership
        if (!anuncio.getUsuarioId().equals(usuarioId)) {
            throw new AcessoNegadoException("Você não pode excluir este anúncio");
        }

        // Check status - can only delete when active
        if (anuncio.getStatus() != StatusAnuncio.ATIVO) {
            throw new AnuncioInvalidoException(
                "Não é possível excluir uma intenção que não está ativa"
            );
        }

        // Delete reference photo from Blob Storage if exists
        if (anuncio.getVeiculoInfo() != null && 
            anuncio.getVeiculoInfo().getFotoReferenciaUrl() != null) {
            try {
                blobStorage.deleteIntentionPhoto(anuncioId);
            } catch (Exception e) {
                log.warn("Failed to delete reference photo for intention {}: {}", anuncioId, e.getMessage());
                // Continue with deletion even if photo deletion fails
            }
        }

        anuncioRepository.deletar(anuncioId);
    }
}
