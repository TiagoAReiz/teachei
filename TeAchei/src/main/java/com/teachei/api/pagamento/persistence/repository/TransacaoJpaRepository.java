package com.teachei.api.pagamento.persistence.repository;

import com.teachei.api.pagamento.persistence.entity.TransacaoPagamentoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransacaoJpaRepository extends JpaRepository<TransacaoPagamentoEntity, UUID> {

    Optional<TransacaoPagamentoEntity> findByPaymentId(Long paymentId);

    Optional<TransacaoPagamentoEntity> findByAnuncioId(String anuncioId);

    List<TransacaoPagamentoEntity> findByUsuarioIdOrderByCriadoEmDesc(UUID usuarioId);
}



