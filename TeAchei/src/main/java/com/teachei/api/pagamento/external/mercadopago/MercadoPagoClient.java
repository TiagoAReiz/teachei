package com.teachei.api.pagamento.external.mercadopago;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.teachei.api.pagamento.domain.exception.PagamentoException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class MercadoPagoClient {

    private static final Logger log = LoggerFactory.getLogger(MercadoPagoClient.class);

    @Value("${mercadopago.access-token}")
    private String accessToken;

    private PreferenceClient preferenceClient;
    private PaymentClient paymentClient;

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
        this.preferenceClient = new PreferenceClient();
        this.paymentClient = new PaymentClient();
    }

    public PreferenceResult createPreference(String externalReference, String description,
                                              BigDecimal amount, String successUrl,
                                              String failureUrl, String pendingUrl,
                                              String notificationUrl) {
        try {
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                .id(externalReference)
                .title(description)
                .quantity(1)
                .unitPrice(amount)
                .currencyId("BRL")
                .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(successUrl)
                .failure(failureUrl)
                .pending(pendingUrl)
                .build();

            PreferenceRequest.PreferenceRequestBuilder requestBuilder = PreferenceRequest.builder()
                .items(List.of(itemRequest))
                .externalReference(externalReference)
                .backUrls(backUrls)
                .autoReturn("approved");

            // Add notification URL if provided (for webhook notifications)
            if (notificationUrl != null && !notificationUrl.isBlank()) {
                requestBuilder.notificationUrl(notificationUrl);
                log.debug("Setting notification URL: {}", notificationUrl);
            }

            Preference preference = preferenceClient.create(requestBuilder.build());

            log.info("Created Mercado Pago preference: id={}, externalRef={}", 
                     preference.getId(), externalReference);

            return new PreferenceResult(
                preference.getId(),
                preference.getInitPoint(),
                preference.getSandboxInitPoint()
            );
        } catch (Exception e) {
            log.error("Failed to create Mercado Pago preference", e);
            throw new PagamentoException("Falha ao criar preferência de pagamento", e);
        }
    }

    public PaymentInfo getPayment(Long paymentId) {
        try {
            Payment payment = paymentClient.get(paymentId);
            
            return new PaymentInfo(
                payment.getId(),
                payment.getExternalReference(),
                payment.getStatus(),
                payment.getTransactionAmount(),
                payment.getPaymentTypeId()
            );
        } catch (Exception e) {
            log.error("Failed to get Mercado Pago payment: {}", paymentId, e);
            throw new PagamentoException("Falha ao consultar pagamento", e);
        }
    }

    public record PreferenceResult(
        String id,
        String initPoint,
        String sandboxInitPoint
    ) {}

    public record PaymentInfo(
        Long id,
        String externalReference,
        String status,
        BigDecimal amount,
        String paymentMethod
    ) {}
}



