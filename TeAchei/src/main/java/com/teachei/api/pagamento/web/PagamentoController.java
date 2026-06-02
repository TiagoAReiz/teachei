package com.teachei.api.pagamento.web;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.teachei.api.pagamento.external.mercadopago.MercadoPagoWebhookValidator;
import com.teachei.api.pagamento.application.ports.in.ProcessarPagamentoUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for payment webhooks.
 * Now handles only subscription payment webhooks (intentions are free).
 */
@RestController
@RequestMapping("/v1/pagamentos")
public class PagamentoController {

    private static final Logger log = LoggerFactory.getLogger(PagamentoController.class);

    private final ProcessarPagamentoUseCase processarPagamentoUseCase;
    private final MercadoPagoWebhookValidator webhookValidator;

    public PagamentoController(ProcessarPagamentoUseCase processarPagamentoUseCase,
                               MercadoPagoWebhookValidator webhookValidator) {
        this.processarPagamentoUseCase = processarPagamentoUseCase;
        this.webhookValidator = webhookValidator;
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestHeader(value = "x-signature", required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String topic,
            @RequestParam(required = false, name = "data.id") Long dataId,
            @RequestParam(required = false) Long id,
            @RequestBody(required = false) WebhookBody body) {

        // Mercado Pago webhook payloads may contain payment metadata; never log
        // the body at INFO. Headers/query params are non-sensitive identifiers.
        log.debug("Mercado Pago webhook received: signature={}, requestId={}, type={}, topic={}, dataId={}, id={}",
                 xSignature != null ? "[PRESENT]" : "[MISSING]",
                 xRequestId != null ? xRequestId : "[MISSING]",
                 type, topic, dataId, id);
        log.trace("Webhook body: {}", body);

        // Support both IPN v1 format (topic/id) and Webhook v2 format (type/data.id)
        // IPN v1: ?topic=payment&id=123456
        // Webhook v2: ?type=payment&data.id=123456 or in body

        // Normalize IPN v1 format to v2 format
        if (topic != null && type == null) {
            type = topic;
            log.debug("IPN v1 format detected, using topic as type: {}", type);
        }
        if (id != null && dataId == null) {
            dataId = id;
            log.debug("IPN v1 format detected, using id as dataId: {}", dataId);
        }

        // Parse data from body if not in query params (Webhook v2 with JSON body)
        if (body != null) {
            if (type == null && body.type() != null) {
                type = body.type();
            }
            if (type == null && body.action() != null && body.action().contains("payment")) {
                type = "payment";
                log.debug("Extracted type from action: {}", body.action());
            }
            if (dataId == null && body.data() != null && body.data().id() != null) {
                try {
                    dataId = Long.valueOf(body.data().id());
                } catch (NumberFormatException e) {
                    log.warn("Could not parse data.id as Long: {}", body.data().id());
                }
            }
            // Fallback: some formats put the payment id at the top level
            if (dataId == null && body.id() != null) {
                Object bodyId = body.id();
                if (bodyId instanceof Number n) {
                    dataId = n.longValue();
                } else {
                    String idStr = bodyId.toString();
                    if (idStr.matches("\\d+")) {
                        dataId = Long.valueOf(idStr);
                    }
                }
            }
            log.debug("After body parsing: type={}, dataId={}", type, dataId);
        }

        // Validate webhook signature (security)
        String dataIdStr = dataId != null ? dataId.toString() : null;
        boolean signatureValid = webhookValidator.validateSignature(xSignature, xRequestId, dataIdStr);

        if (!signatureValid) {
            log.warn("Invalid webhook signature - rejecting request");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Process the webhook
        if (type != null && dataId != null) {
            log.debug("Processing webhook: type={}, dataId={}", type, dataId);
            try {
                var payload = new ProcessarPagamentoUseCase.WebhookPayload(
                    type,
                    null,
                    dataId,
                    null,
                    null
                );
                processarPagamentoUseCase.processarWebhook(payload);
            } catch (Exception e) {
                log.error("Error processing webhook for paymentId={}: {}", dataId, e.getMessage(), e);
                // Still return 200 to avoid Mercado Pago retries for application errors
            }
        } else {
            log.warn("Webhook ignored: type or dataId is null");
        }

        // Always return 200 quickly to acknowledge receipt
        return ResponseEntity.ok().build();
    }

    /**
     * Mercado Pago webhook body. Only the fields we actually consume are mapped;
     * the rest are ignored so the API can evolve without breaking us.
     * {@code id} stays {@code Object} because Mercado Pago has sent it as both
     * Number and String depending on the variant.
     */
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record WebhookBody(String type, String action, Object id, Data data) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Data(String id) {}
    }
}
