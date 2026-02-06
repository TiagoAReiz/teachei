package com.teachei.api.application.usecase;

import com.teachei.api.application.ports.in.BuscarAnunciosUseCase;
import com.teachei.api.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.domain.exception.AnuncioNaoEncontradoException;
import com.teachei.api.domain.model.Anuncio;
import com.teachei.api.domain.model.StatusAnuncio;

import java.util.List;
import java.util.UUID;

/**
 * Implementation of the search intentions use case.
 */
public class BuscarAnunciosUseCaseImpl implements BuscarAnunciosUseCase {

    private final AnuncioRepositoryPort anuncioRepository;

    public BuscarAnunciosUseCaseImpl(AnuncioRepositoryPort anuncioRepository) {
        this.anuncioRepository = anuncioRepository;
    }

    @Override
    public ResultadoPaginado<Anuncio> buscar(FiltroAnuncio filtro, int pagina, int tamanho) {
        AnuncioRepositoryPort.ResultadoBusca resultado = anuncioRepository.buscar(
            StatusAnuncio.ATIVO,
            filtro.tipo(),
            filtro.marcaCodigo(),
            filtro.modeloCodigo(),
            filtro.modelos(),
            filtro.anoMin(),
            filtro.anoMax(),
            filtro.precoMin(),
            filtro.precoMax(),
            filtro.kmMin(),
            filtro.kmMax(),
            filtro.search(),
            filtro.opcionais(),
            filtro.cidade(),
            filtro.estado(),
            filtro.ordenar(),
            pagina,
            tamanho
        );

        int totalPaginas = (int) Math.ceil((double) resultado.total() / tamanho);

        return new ResultadoPaginado<>(
            resultado.anuncios(),
            pagina,
            tamanho,
            resultado.total(),
            totalPaginas
        );
    }

    @Override
    public Anuncio buscarPorId(String id) {
        return anuncioRepository.buscarPorId(id)
            .orElseThrow(() -> new AnuncioNaoEncontradoException(id));
    }

    @Override
    public List<Anuncio> buscarPorUsuario(UUID usuarioId) {
        return anuncioRepository.buscarPorUsuarioId(usuarioId);
    }
}



