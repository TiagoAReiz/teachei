package com.teachei.api.anuncio.application.usecase;

import com.teachei.api.anuncio.application.ports.in.FinalizarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.shared.domain.exception.AcessoNegadoException;
import com.teachei.api.anuncio.domain.exception.AnuncioInvalidoException;
import com.teachei.api.anuncio.domain.exception.AnuncioNaoEncontradoException;
import com.teachei.api.anuncio.domain.model.Anuncio;
import com.teachei.api.anuncio.domain.model.StatusAnuncio;

import java.util.UUID;

/**
 * Implementation of the finalize intention use case.
 */
public class FinalizarAnuncioUseCaseImpl implements FinalizarAnuncioUseCase {

    private final AnuncioRepositoryPort anuncioRepository;

    public FinalizarAnuncioUseCaseImpl(AnuncioRepositoryPort anuncioRepository) {
        this.anuncioRepository = anuncioRepository;
    }

    @Override
    public Anuncio executar(UUID usuarioId, String anuncioId) {
        Anuncio anuncio = anuncioRepository.buscarPorId(anuncioId)
            .orElseThrow(() -> new AnuncioNaoEncontradoException(anuncioId));

        // Check ownership
        if (!anuncio.getUsuarioId().equals(usuarioId)) {
            throw new AcessoNegadoException("Você não pode finalizar este anúncio");
        }

        // Check status - can only finalize when active
        if (anuncio.getStatus() != StatusAnuncio.ATIVO) {
            throw new AnuncioInvalidoException(
                "Apenas anúncios ativos podem ser finalizados"
            );
        }

        anuncio.finalizar();

        return anuncioRepository.salvar(anuncio);
    }
}
