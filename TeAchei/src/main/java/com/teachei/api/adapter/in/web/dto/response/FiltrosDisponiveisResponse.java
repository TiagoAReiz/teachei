package com.teachei.api.adapter.in.web.dto.response;

import com.teachei.api.domain.model.TipoVeiculo;

import java.util.List;

/**
 * Response with available filter options based on existing active intentions.
 */
public record FiltrosDisponiveisResponse(
    List<TipoVeiculo> tipos,
    List<MarcaOption> marcas,
    List<ModeloOption> modelos,
    List<OpcionalOption> opcionais
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
     * Creates an empty response.
     */
    public static FiltrosDisponiveisResponse empty() {
        return new FiltrosDisponiveisResponse(List.of(), List.of(), List.of(), List.of());
    }
}
