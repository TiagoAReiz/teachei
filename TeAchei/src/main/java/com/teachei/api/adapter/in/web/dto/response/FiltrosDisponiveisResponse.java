package com.teachei.api.adapter.in.web.dto.response;

import com.teachei.api.shared.domain.TipoVeiculo;

import java.util.List;

/**
 * Response with available filter options based on existing active intentions.
 */
public record FiltrosDisponiveisResponse(
    List<TipoVeiculo> tipos,
    List<MarcaOption> marcas,
    List<ModeloOption> modelos,
    List<OpcionalOption> opcionais,
    List<LocalizacaoOption> localizacoes
) {
    /**
     * Optional feature option with code and label.
     */
    public record OpcionalOption(
        String codigo,
        String label
    ) {}
    /**
     * Brand option with code and name.
     */
    public record MarcaOption(
        String codigo,
        String nome
    ) {}

    /**
     * Model option with code, name, and base name.
     */
    public record ModeloOption(
        String codigo,
        String nome,
        String baseNome
    ) {}

    /**
     * Location option with city and state.
     */
    public record LocalizacaoOption(
        String cidade,
        String estado
    ) {}

    /**
     * Creates an empty response.
     */
    public static FiltrosDisponiveisResponse empty() {
        return new FiltrosDisponiveisResponse(List.of(), List.of(), List.of(), List.of(), List.of());
    }
}
