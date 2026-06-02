package com.teachei.api.pagamento.application.ports.in;

/**
 * Inbound port for payment processing.
 * Now handles only subscription payment webhooks (intentions are free).
 */
public interface ProcessarPagamentoUseCase {

    /**
     * Processes a payment webhook notification.
     *
     * @param payload the webhook payload
     */
    void processarWebhook(WebhookPayload payload);

    /**
     * Webhook payload from Mercado Pago.
     */
    record WebhookPayload(
        String type,
        String action,
        Long id,
        String externalReference,
        String status
    ) {}
}
