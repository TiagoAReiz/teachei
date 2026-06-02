package com.teachei.api.pagamento.external.mercadopago;

import com.teachei.api.pagamento.application.ports.out.PagamentoPort;
import com.teachei.api.pagamento.domain.StatusPagamento;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class MercadoPagoAdapter implements PagamentoPort {

    private final MercadoPagoClient mercadoPagoClient;

    public MercadoPagoAdapter(MercadoPagoClient mercadoPagoClient) {
        this.mercadoPagoClient = mercadoPagoClient;
    }

    @Override
    public PreferenciaPagamento criarPreferencia(String anuncioId, String descricao,
                                                  BigDecimal valor, String successUrl,
                                                  String failureUrl, String pendingUrl,
                                                  String notificationUrl) {
        var result = mercadoPagoClient.createPreference(
            anuncioId, descricao, valor, successUrl, failureUrl, pendingUrl, notificationUrl);

        return new PreferenciaPagamento(
            result.id(),
            result.initPoint(),
            result.sandboxInitPoint()
        );
    }

    @Override
    public StatusPagamentoInfo consultarStatus(Long paymentId) {
        var payment = mercadoPagoClient.getPayment(paymentId);

        return new StatusPagamentoInfo(
            payment.id(),
            payment.externalReference(),
            StatusPagamento.fromMercadoPago(payment.status()),
            payment.amount(),
            payment.paymentMethod()
        );
    }
}



