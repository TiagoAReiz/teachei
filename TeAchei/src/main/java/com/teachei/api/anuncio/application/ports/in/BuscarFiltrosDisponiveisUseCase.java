package com.teachei.api.anuncio.application.ports.in;

import com.teachei.api.shared.domain.TipoVeiculo;

import java.util.List;

/**
 * Inbound port for retrieving available filter options based on existing intentions.
 */
public interface BuscarFiltrosDisponiveisUseCase {

    /**
     * Gets available filter options.
     *
     * @param tipo optional type filter - if provided, filters brands/models for this type
     * @param marcaCodigo optional brand filter - if provided, filters models for this brand
     * @return available filter options
     */
    FiltrosDisponiveis buscar(TipoVeiculo tipo, String marcaCodigo);

    /**
     * Available filter options.
     */
    record FiltrosDisponiveis(
        List<TipoVeiculo> tipos,
        List<MarcaOption> marcas,
        List<ModeloOption> modelos,
        List<OpcionalOption> opcionais,
        List<LocalizacaoOption> localizacoes
    ) {
        public record MarcaOption(String codigo, String nome) {}
        public record ModeloOption(String codigo, String nome, String baseNome) {}
        public record OpcionalOption(String codigo, String label) {}
        public record LocalizacaoOption(String cidade, String estado) {}
    }
}
