package com.teachei.api.application.ports.in;

import com.teachei.api.domain.model.Anuncio;
import com.teachei.api.domain.model.OrdemAnuncio;
import com.teachei.api.domain.model.TipoVeiculo;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Inbound port for searching and listing purchase intentions.
 */
public interface BuscarAnunciosUseCase {

    /**
     * Searches for active intentions with filters.
     *
     * @param filtro  the search filters
     * @param pagina  the page number (0-based)
     * @param tamanho the page size
     * @return paginated results
     */
    ResultadoPaginado<Anuncio> buscar(FiltroAnuncio filtro, int pagina, int tamanho);

    /**
     * Gets a specific intention by ID.
     *
     * @param id the intention ID
     * @return the intention
     */
    Anuncio buscarPorId(String id);

    /**
     * Gets all intentions created by a user.
     *
     * @param usuarioId the user ID
     * @return list of intentions
     */
    List<Anuncio> buscarPorUsuario(UUID usuarioId);

    /**
     * Filter criteria for searching intentions.
     */
    record FiltroAnuncio(
            TipoVeiculo tipo,
            String marcaCodigo,
            String modeloCodigo,
            List<String> modelos, // Multiple model codes (alternative to single modeloCodigo)
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
            OrdemAnuncio ordenar // Sort order (default: RECENTE)
    ) {
        public static FiltroAnuncio vazio() {
            return new FiltroAnuncio(null, null, null, null, null, null, null, null, null, null, null, null, null, null,
                    null);
        }
    }

    /**
     * Paginated result wrapper.
     */
    record ResultadoPaginado<T>(
            List<T> items,
            int pagina,
            int tamanho,
            long total,
            int totalPaginas) {
    }
}
