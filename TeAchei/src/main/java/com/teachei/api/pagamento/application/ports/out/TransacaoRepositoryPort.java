package com.teachei.api.pagamento.application.ports.out;

import com.teachei.api.pagamento.domain.StatusPagamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Outbound port for payment transaction persistence.
 */
public interface TransacaoRepositoryPort {

    /**
     * Saves a transaction.
     *
     * @param transacao the transaction to save
     * @return the saved transaction
     */
    Transacao salvar(Transacao transacao);

    /**
     * Finds a transaction by Mercado Pago payment ID.
     *
     * @param paymentId the payment ID
     * @return the transaction if found
     */
    Optional<Transacao> buscarPorPaymentId(Long paymentId);

    /**
     * Finds a transaction by intention ID.
     *
     * @param anuncioId the intention ID
     * @return the transaction if found
     */
    Optional<Transacao> buscarPorAnuncioId(String anuncioId);

    /**
     * Finds all transactions by user ID.
     *
     * @param usuarioId the user ID
     * @return list of transactions
     */
    List<Transacao> buscarPorUsuarioId(UUID usuarioId);

    /**
     * Transaction record.
     */
    record Transacao(
        UUID id,
        Long paymentId,
        UUID usuarioId,
        String anuncioId,
        BigDecimal valor,
        String metodoPagamento,
        StatusPagamento status,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
    ) {
        public static Transacao criar(Long paymentId, UUID usuarioId, String anuncioId,
                                       BigDecimal valor, String metodoPagamento, 
                                       StatusPagamento status) {
            LocalDateTime agora = LocalDateTime.now();
            return new Transacao(
                UUID.randomUUID(), paymentId, usuarioId, anuncioId,
                valor, metodoPagamento, status, agora, agora
            );
        }
    }
}



