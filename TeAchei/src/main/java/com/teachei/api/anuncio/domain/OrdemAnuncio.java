package com.teachei.api.anuncio.domain;

/**
 * Sort order options for intention listings.
 */
public enum OrdemAnuncio {
    RECENTE,      // Most recent first (default)
    PRECO_ASC,    // Lowest price first
    PRECO_DESC,   // Highest price first
    KM_ASC,       // Lowest km first
    ANO_DESC,     // Newest year first
    NOME_ASC      // Alphabetical by model name
}
