package com.teachei.api.pagamento.application.ports.out;

import com.teachei.api.pagamento.domain.model.StatusPagamento;

import java.math.BigDecimal;

/**
 * Outbound port for payment processing (Mercado Pago).
 */
public interface PagamentoPort {

    /**
     * Creates a payment preference.
     *
     * @param anuncioId the intention ID (used as external reference)
     * @param descricao the item description
     * @param valor the amount
     * @param successUrl the success redirect URL
     * @param failureUrl the failure redirect URL
     * @param pendingUrl the pending redirect URL
     * @param notificationUrl the webhook notification URL (optional)
     * @return the created preference
     */
    PreferenciaPagamento criarPreferencia(
        String anuncioId,
        String descricao,
        BigDecimal valor,
        String successUrl,
        String failureUrl,
        String pendingUrl,
        String notificationUrl
    );

    /**
     * Gets the payment status by payment ID.
     *
     * @param paymentId the Mercado Pago payment ID
     * @return the payment status details
     */
    StatusPagamentoInfo consultarStatus(Long paymentId);

    /**
     * Payment preference result.
     */
    record PreferenciaPagamento(
        String id,
        String initPoint,
        String sandboxInitPoint
    ) {}

    /**
     * Payment status information.
     */
    record StatusPagamentoInfo(
        Long paymentId,
        String externalReference,
        StatusPagamento status,
        BigDecimal valor,
        String metodoPagamento
    ) {}
}



