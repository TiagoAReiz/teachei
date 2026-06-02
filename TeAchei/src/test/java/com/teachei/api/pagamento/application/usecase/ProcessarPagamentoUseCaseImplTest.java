package com.teachei.api.pagamento.application.usecase;

import com.teachei.api.pagamento.application.ports.in.ProcessarPagamentoUseCase.WebhookPayload;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.pagamento.application.ports.out.PagamentoPort;
import com.teachei.api.pagamento.application.ports.out.PagamentoPort.StatusPagamentoInfo;
import com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort;
import com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort.Transacao;
import com.teachei.api.assinatura.domain.model.Assinatura;
import com.teachei.api.assinatura.domain.model.PlanoAssinatura;
import com.teachei.api.assinatura.domain.model.StatusAssinatura;
import com.teachei.api.pagamento.domain.model.StatusPagamento;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Regression tests for P0.1 — webhook idempotency.
 * The guard {@code transacaoRepository.buscarPorPaymentId} is only effective if
 * the use case ALSO persists a transaction; this test pins both halves of the
 * contract.
 */
@DisplayName("ProcessarPagamentoUseCaseImpl - idempotência do webhook (P0.1)")
class ProcessarPagamentoUseCaseImplTest {

    private static final Long PAYMENT_ID = 123456L;

    private PagamentoPort pagamentoPort;
    private TransacaoRepositoryPort transacaoRepository;
    private AssinaturaRepositoryPort assinaturaRepository;
    private ProcessarPagamentoUseCaseImpl useCase;

    private UUID assinaturaId;
    private UUID usuarioId;

    @BeforeEach
    void setUp() {
        pagamentoPort = mock(PagamentoPort.class);
        transacaoRepository = mock(TransacaoRepositoryPort.class);
        assinaturaRepository = mock(AssinaturaRepositoryPort.class);
        useCase = new ProcessarPagamentoUseCaseImpl(pagamentoPort, transacaoRepository, assinaturaRepository);

        assinaturaId = UUID.randomUUID();
        usuarioId = UUID.randomUUID();
    }

    @Test
    @DisplayName("primeira chamada APROVADO: persiste transação e ativa assinatura")
    void firstApprovedWebhook_persistsTransactionAndActivatesSubscription() {
        when(transacaoRepository.buscarPorPaymentId(PAYMENT_ID)).thenReturn(Optional.empty());
        when(pagamentoPort.consultarStatus(PAYMENT_ID)).thenReturn(new StatusPagamentoInfo(
            PAYMENT_ID, "sub_" + assinaturaId, StatusPagamento.APROVADO,
            new BigDecimal("30.00"), "credit_card"));

        Assinatura assinatura = Assinatura.builder()
            .id(assinaturaId)
            .usuarioId(usuarioId)
            .plano(PlanoAssinatura.TRIMESTRAL)
            .status(StatusAssinatura.PENDENTE)
            .build();
        when(assinaturaRepository.buscarPorId(assinaturaId)).thenReturn(Optional.of(assinatura));

        useCase.processarWebhook(new WebhookPayload("payment", null, PAYMENT_ID, null, null));

        ArgumentCaptor<Transacao> captor = ArgumentCaptor.forClass(Transacao.class);
        verify(transacaoRepository).salvar(captor.capture());
        assertThat(captor.getValue().paymentId()).isEqualTo(PAYMENT_ID);
        assertThat(captor.getValue().usuarioId()).isEqualTo(usuarioId);
        assertThat(captor.getValue().status()).isEqualTo(StatusPagamento.APROVADO);

        verify(assinaturaRepository).salvar(assinatura);
        assertThat(assinatura.getStatus()).isEqualTo(StatusAssinatura.ATIVO);
    }

    @Test
    @DisplayName("reenvio do mesmo paymentId: NÃO consulta MP nem persiste nada")
    void duplicateWebhook_isIdempotent() {
        Transacao existing = Transacao.criar(PAYMENT_ID, usuarioId, null,
            new BigDecimal("30.00"), "credit_card", StatusPagamento.APROVADO);
        when(transacaoRepository.buscarPorPaymentId(PAYMENT_ID)).thenReturn(Optional.of(existing));

        useCase.processarWebhook(new WebhookPayload("payment", null, PAYMENT_ID, null, null));

        verify(pagamentoPort, never()).consultarStatus(any());
        verify(transacaoRepository, never()).salvar(any());
        verify(assinaturaRepository, never()).buscarPorId(any());
        verify(assinaturaRepository, never()).salvar(any());
    }

    @Test
    @DisplayName("status NÃO aprovado: ainda persiste transação (dedupe) mas não ativa")
    void nonApprovedPayment_recordsTransactionWithoutActivating() {
        when(transacaoRepository.buscarPorPaymentId(PAYMENT_ID)).thenReturn(Optional.empty());
        when(pagamentoPort.consultarStatus(PAYMENT_ID)).thenReturn(new StatusPagamentoInfo(
            PAYMENT_ID, "sub_" + assinaturaId, StatusPagamento.REJEITADO,
            new BigDecimal("30.00"), "credit_card"));

        Assinatura assinatura = Assinatura.builder()
            .id(assinaturaId)
            .usuarioId(usuarioId)
            .plano(PlanoAssinatura.TRIMESTRAL)
            .status(StatusAssinatura.PENDENTE)
            .build();
        when(assinaturaRepository.buscarPorId(assinaturaId)).thenReturn(Optional.of(assinatura));

        useCase.processarWebhook(new WebhookPayload("payment", null, PAYMENT_ID, null, null));

        verify(transacaoRepository).salvar(any(Transacao.class));
        verify(assinaturaRepository, never()).salvar(any());
        assertThat(assinatura.getStatus()).isEqualTo(StatusAssinatura.PENDENTE);
    }
}
