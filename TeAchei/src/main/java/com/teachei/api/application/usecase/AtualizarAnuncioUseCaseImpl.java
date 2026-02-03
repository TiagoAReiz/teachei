package com.teachei.api.application.usecase;

import com.teachei.api.application.ports.in.AtualizarAnuncioUseCase;
import com.teachei.api.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.domain.exception.AcessoNegadoException;
import com.teachei.api.domain.exception.AnuncioNaoEncontradoException;
import com.teachei.api.domain.model.Anuncio;
import com.teachei.api.domain.model.VersaoInfo;

import java.util.List;
import java.util.UUID;

/**
 * Implementation of the update intention use case.
 */
public class AtualizarAnuncioUseCaseImpl implements AtualizarAnuncioUseCase {

    private final AnuncioRepositoryPort anuncioRepository;

    public AtualizarAnuncioUseCaseImpl(AnuncioRepositoryPort anuncioRepository) {
        this.anuncioRepository = anuncioRepository;
    }

    @Override
    public Anuncio executar(UUID usuarioId, String anuncioId, AtualizarAnuncioCommand command) {
        Anuncio anuncio = anuncioRepository.buscarPorId(anuncioId)
            .orElseThrow(() -> new AnuncioNaoEncontradoException(anuncioId));

        // Check ownership
        if (!anuncio.getUsuarioId().equals(usuarioId)) {
            throw new AcessoNegadoException("Você não pode editar este anúncio");
        }

        // Map version commands to domain objects
        List<VersaoInfo> versoes = command.versoes() != null
            ? command.versoes().stream()
                .map(v -> new VersaoInfo(v.codigo(), v.nome()))
                .toList()
            : List.of();

        // Update vehicle info (brand/model remain unchanged)
        anuncio.getVeiculoInfo().atualizar(
            versoes,
            command.todasVersoes(),
            command.anos(),
            command.cores(),
            command.precoMaximo(),
            command.quilometragemMinima(),
            command.quilometragemMaxima(),
            command.opcionais()
        );

        // Update observations
        anuncio.setObservacoes(command.observacoes());

        // Update location in contact info
        if (command.cidade() != null) {
            anuncio.getContatoInfo().setCidade(command.cidade());
        }
        if (command.estado() != null) {
            anuncio.getContatoInfo().setEstado(command.estado());
        }

        return anuncioRepository.salvar(anuncio);
    }
}
