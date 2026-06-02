package com.teachei.api.pagamento.domain;

/**
 * Enum representing payment status from Mercado Pago.
 */
public enum StatusPagamento {
    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    REJEITADO("Rejeitado"),
    CANCELADO("Cancelado"),
    REEMBOLSADO("Reembolsado");

    private final String descricao;

    StatusPagamento(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }

    public static StatusPagamento fromMercadoPago(String status) {
        if (status == null) {
            return PENDENTE;
        }
        return switch (status.toLowerCase()) {
            case "approved" -> APROVADO;
            case "pending", "in_process", "authorized", "in_mediation" -> PENDENTE;
            case "rejected" -> REJEITADO;
            case "cancelled" -> CANCELADO;
            case "refunded", "charged_back" -> REEMBOLSADO;
            default -> PENDENTE;
        };
    }
}



