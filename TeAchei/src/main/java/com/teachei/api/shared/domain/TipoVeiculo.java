package com.teachei.api.shared.domain;

/**
 * Enum representing vehicle types.
 */
public enum TipoVeiculo {
    CARRO("Carro", "carros"),
    MOTO("Moto", "motos"),
    CAMINHAO("Caminhão", "caminhoes");

    private final String descricao;
    private final String fipeEndpoint;

    TipoVeiculo(String descricao, String fipeEndpoint) {
        this.descricao = descricao;
        this.fipeEndpoint = fipeEndpoint;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getFipeEndpoint() {
        return fipeEndpoint;
    }
}



