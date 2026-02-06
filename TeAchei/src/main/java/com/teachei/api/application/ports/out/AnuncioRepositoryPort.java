package com.teachei.api.application.ports.out;

import com.teachei.api.domain.model.Anuncio;
import com.teachei.api.domain.model.OrdemAnuncio;
import com.teachei.api.domain.model.StatusAnuncio;
import com.teachei.api.domain.model.TipoVeiculo;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Outbound port for intention (anúncio) persistence operations.
 * Implemented by the Cosmos DB adapter.
 */
public interface AnuncioRepositoryPort {

    /**
     * Saves an intention.
     *
     * @param anuncio the intention to save
     * @return the saved intention
     */
    Anuncio salvar(Anuncio anuncio);

    /**
     * Finds an intention by ID.
     *
     * @param id the intention ID
     * @return the intention if found
     */
    Optional<Anuncio> buscarPorId(String id);

    /**
     * Finds all intentions by user ID.
     *
     * @param usuarioId the user ID
     * @return list of intentions
     */
    List<Anuncio> buscarPorUsuarioId(UUID usuarioId);

    /**
     * Searches intentions with filters.
     *
     * @param status the status filter
     * @param tipo the vehicle type filter
     * @param marcaCodigo the brand code filter
     * @param modeloCodigo the model code filter (single)
     * @param modelos the model codes filter (multiple, alternative to modeloCodigo)
     * @param anoMin the minimum year filter
     * @param anoMax the maximum year filter
     * @param precoMin the minimum price filter
     * @param precoMax the maximum price filter
     * @param kmMin the minimum mileage filter
     * @param kmMax the maximum mileage filter
     * @param search the text search filter
     * @param opcionais the optionals filter
     * @param cidade the city filter
     * @param estado the state filter
     * @param ordenar the sort order (null = RECENTE)
     * @param pagina the page number
     * @param tamanho the page size
     * @return paginated results
     */
    ResultadoBusca buscar(
        StatusAnuncio status,
        TipoVeiculo tipo,
        String marcaCodigo,
        String modeloCodigo,
        List<String> modelos,
        Integer anoMin,
        Integer anoMax,
        BigDecimal precoMin,
        BigDecimal precoMax,
        Integer kmMin,
        Integer kmMax,
        String search,
        List<String> opcionais,
        String cidade,
        String estado,
        OrdemAnuncio ordenar,
        int pagina,
        int tamanho
    );

    /**
     * Counts intentions by status.
     *
     * @param status the status
     * @return the count
     */
    long contarPorStatus(StatusAnuncio status);

    /**
     * Gets all active intentions for filter aggregation.
     * Used to extract distinct vehicle types, brands, and models.
     *
     * @return list of active intentions
     */
    List<Anuncio> buscarAtivos();

    /**
     * Deletes an intention by ID.
     *
     * @param id the intention ID
     */
    void deletar(String id);

    /**
     * Search result wrapper.
     */
    record ResultadoBusca(
        List<Anuncio> anuncios,
        long total
    ) {}
}



