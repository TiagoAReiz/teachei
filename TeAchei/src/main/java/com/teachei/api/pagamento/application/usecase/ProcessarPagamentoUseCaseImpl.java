package com.teachei.api.pagamento.application.usecase;

import com.teachei.api.pagamento.application.ports.in.ProcessarPagamentoUseCase;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.pagamento.application.ports.out.PagamentoPort;
import com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort;
import com.teachei.api.assinatura.domain.Assinatura;
import com.teachei.api.pagamento.domain.StatusPagamento;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

/**
 * Implementation of the payment processing use case.
 * Now handles only subscription payments (intentions are free).
 */
public class ProcessarPagamentoUseCaseImpl implements ProcessarPagamentoUseCase {

    private static final Logger log = LoggerFactory.getLogger(ProcessarPagamentoUseCaseImpl.class);

    private final PagamentoPort pagamentoPort;
    private final TransacaoRepositoryPort transacaoRepository;
    private final AssinaturaRepositoryPort assinaturaRepository;

    public ProcessarPagamentoUseCaseImpl(
            PagamentoPort pagamentoPort,
            TransacaoRepositoryPort transacaoRepository,
            AssinaturaRepositoryPort assinaturaRepository) {
        this.pagamentoPort = pagamentoPort;
        this.transacaoRepository = transacaoRepository;
        this.assinaturaRepository = assinaturaRepository;
    }

    @Override
    public void processarWebhook(WebhookPayload payload) {
        log.info("=== PROCESSING WEBHOOK ===");
        log.info("Webhook data: type={}, action={}, id={}", 
            payload.type(), payload.action(), payload.id());

        if (!"payment".equals(payload.type())) {
            log.info("Ignoring non-payment webhook type: {}", payload.type());
            return;
        }

        if (payload.id() == null) {
            log.warn("Webhook missing payment ID");
            return;
        }

        // Check for idempotency
        if (transacaoRepository.buscarPorPaymentId(payload.id()).isPresent()) {
            log.info("Payment {} already processed, skipping", payload.id());
            return;
        }

        // Get payment status from Mercado Pago
        PagamentoPort.StatusPagamentoInfo statusInfo;
        try {
            log.info("Fetching payment info from Mercado Pago API: paymentId={}", payload.id());
            statusInfo = pagamentoPort.consultarStatus(payload.id());
            log.info("Payment info received: status={}, externalRef={}, amount={}, method={}", 
                statusInfo.status(), statusInfo.externalReference(), 
                statusInfo.valor(), statusInfo.metodoPagamento());
        } catch (Exception e) {
            log.error("Failed to fetch payment {} from Mercado Pago API: {} - {}", 
                payload.id(), e.getClass().getSimpleName(), e.getMessage());
            // This is expected for test webhooks with fake IDs
            // Check if this might be a production/test token mismatch
            if (e.getMessage() != null && e.getMessage().contains("404")) {
                log.warn("Payment {} not found - possible causes: " +
                    "1) Test webhook with fake ID, " +
                    "2) Token mismatch (test payment with production token or vice-versa), " +
                    "3) Payment was cancelled/refunded", payload.id());
            }
            return;
        }

        String externalReference = statusInfo.externalReference();
        if (externalReference == null) {
            log.warn("Payment {} has no external reference", payload.id());
            return;
        }

        // Only process subscription payments (prefix "sub_")
        if (externalReference.startsWith("sub_")) {
            log.info("Processing subscription payment: {}", externalReference);
            processarPagamentoAssinatura(payload, statusInfo, externalReference);
        } else {
            // Legacy intention payments are no longer processed
            log.warn("Ignoring non-subscription payment: {}", externalReference);
        }
        
        log.info("=== WEBHOOK PROCESSING COMPLETE ===");
    }

    private void processarPagamentoAssinatura(WebhookPayload payload, 
                                               PagamentoPort.StatusPagamentoInfo statusInfo,
                                               String externalReference) {
        // Extract subscription ID from external reference (format: sub_<uuid>)
        String assinaturaIdStr = externalReference.substring(4);
        UUID assinaturaId;
        try {
            assinaturaId = UUID.fromString(assinaturaIdStr);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid subscription ID in external reference: {}", externalReference);
            return;
        }

        Assinatura assinatura = assinaturaRepository.buscarPorId(assinaturaId)
            .orElse(null);
        
        if (assinatura == null) {
            log.warn("Subscription not found for payment {}: {}", payload.id(), assinaturaId);
            return;
        }

        // Persist transaction first so the idempotency guard (buscarPorPaymentId)
        // works on webhook resends, even if activation repeats.
        TransacaoRepositoryPort.Transacao transacao = TransacaoRepositoryPort.Transacao.criar(
            payload.id(),
            assinatura.getUsuarioId(),
            null,
            statusInfo.valor(),
            statusInfo.metodoPagamento(),
            statusInfo.status()
        );
        transacaoRepository.salvar(transacao);
        log.info("Transaction persisted for payment {}: status={}", payload.id(), statusInfo.status());

        // Activate subscription if payment approved
        if (statusInfo.status() == StatusPagamento.APROVADO) {
            assinatura.ativar(payload.id().toString());
            assinaturaRepository.salvar(assinatura);
            log.info("Subscription {} activated after payment {}", assinaturaId, payload.id());
        }
    }
}
