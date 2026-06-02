package com.teachei.api.assinatura.domain.model;

/**
 * Subscription plan types for seller access to buyer contact information.
 */
public enum PlanoAssinatura {
    INDIVIDUAL("Plano Individual", 30, false),
    TRIMESTRAL("Plano Trimestral", 90, true),
    ANUAL("Plano Anual", 365, true);

    private final String nome;
    private final int duracaoDias;
    private final boolean recorrente;

    PlanoAssinatura(String nome, int duracaoDias, boolean recorrente) {
        this.nome = nome;
        this.duracaoDias = duracaoDias;
        this.recorrente = recorrente;
    }

    public String getNome() {
        return nome;
    }

    public int getDuracaoDias() {
        return duracaoDias;
    }

    public boolean isRecorrente() {
        return recorrente;
    }
}
