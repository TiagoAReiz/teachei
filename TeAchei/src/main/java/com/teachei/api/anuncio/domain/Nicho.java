package com.teachei.api.anuncio.domain;

/**
 * Enum representing the marketplace niche.
 * Currently only VEICULO (vehicles) is supported.
 * Future niches: IMOVEL (real estate), ELETRONICO (electronics)
 */
public enum Nicho {
    VEICULO("Veículo");

    private final String descricao;

    Nicho(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
 

 
