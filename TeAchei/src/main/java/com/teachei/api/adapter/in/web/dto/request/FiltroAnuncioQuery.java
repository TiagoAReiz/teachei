package com.teachei.api.adapter.in.web.dto.request;

import com.teachei.api.domain.model.OrdemAnuncio;
import com.teachei.api.domain.model.TipoVeiculo;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Query parameters for {@code GET /v1/anuncios}.
 *
 * Carries every supported filter plus the legacy aliases the API still accepts
 * (e.g. {@code tipo}/{@code tipoVeiculo}, {@code page}/{@code pagina},
 * {@code precoMin}/{@code precoMinimo}, single {@code ano} used for both
 * range bounds). Resolver methods centralize the alias precedence rules so
 * the controller doesn't have to.
 *
 * <p>All fields are nullable so the controller can tell "not supplied" from
 * an explicit zero/empty value; defaults for pagination are applied in
 * {@link #resolvedPage()} / {@link #resolvedSize()}.
 */
public record FiltroAnuncioQuery(
        TipoVeiculo tipo,
        TipoVeiculo tipoVeiculo,
        String marcaCodigo,
        String modeloCodigo,
        String modelos,
        Integer ano,
        Integer anoMin,
        Integer anoMax,
        BigDecimal precoMinimo,
        BigDecimal precoMin,
        BigDecimal precoMax,
        Integer kmMin,
        Integer kmMax,
        String search,
        List<String> opcionais,
        String cidade,
        String estado,
        OrdemAnuncio ordenar,
        Integer page,
        Integer pagina,
        Integer size,
        Integer tamanho
) {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;

    public TipoVeiculo resolvedTipo() {
        return tipo != null ? tipo : tipoVeiculo;
    }

    public Integer resolvedAnoMin() {
        return anoMin != null ? anoMin : ano;
    }

    public Integer resolvedAnoMax() {
        return anoMax != null ? anoMax : ano;
    }

    public BigDecimal resolvedPrecoMin() {
        return precoMin != null ? precoMin : precoMinimo;
    }

    public int resolvedPage() {
        if (pagina != null) return pagina;
        if (page != null) return page;
        return DEFAULT_PAGE;
    }

    public int resolvedSize() {
        if (tamanho != null) return tamanho;
        if (size != null) return size;
        return DEFAULT_SIZE;
    }

    public List<String> modelosList() {
        if (modelos == null || modelos.isBlank()) {
            return null;
        }
        return Arrays.asList(modelos.split(","));
    }
}
