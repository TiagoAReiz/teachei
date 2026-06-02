package com.teachei.api.anuncio.domain;

/**
 * Enum representing the status of a purchase intention (anúncio).
 */
public enum StatusAnuncio {
    ATIVO("Ativo"),
    EXPIRADO("Expirado"),
    CANCELADO("Cancelado"),
    FINALIZADO("Finalizado");

    private final String descricao;

    StatusAnuncio(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public boolean isVisivel() {
        return this == ATIVO;
    }
}



