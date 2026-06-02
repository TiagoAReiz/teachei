package com.teachei.api.assinatura.persistence.repository;

import com.teachei.api.assinatura.persistence.entity.AssinaturaEntity;
import com.teachei.api.assinatura.domain.model.StatusAssinatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for subscription persistence.
 */
@Repository
public interface AssinaturaJpaRepository extends JpaRepository<AssinaturaEntity, UUID> {

    /**
     * Find all subscriptions for a user.
     */
    List<AssinaturaEntity> findByUsuarioIdOrderByDataFimDesc(UUID usuarioId);

    /**
     * Find active subscription for a user.
     */
    @Query("SELECT a FROM AssinaturaEntity a WHERE a.usuarioId = :usuarioId " +
           "AND a.status = :status AND a.dataFim > :now ORDER BY a.dataFim DESC")
    List<AssinaturaEntity> findActiveByUsuarioId(
        @Param("usuarioId") UUID usuarioId,
        @Param("status") StatusAssinatura status,
        @Param("now") LocalDateTime now
    );

    /**
     * Find the most recent subscription for a user.
     */
    Optional<AssinaturaEntity> findFirstByUsuarioIdOrderByDataFimDesc(UUID usuarioId);

    /**
     * Find subscription by transaction ID (from payment gateway).
     */
    Optional<AssinaturaEntity> findByTransacaoId(String transacaoId);

    /**
     * Check if user has any active subscription.
     */
    @Query("SELECT COUNT(a) > 0 FROM AssinaturaEntity a WHERE a.usuarioId = :usuarioId " +
           "AND a.status = 'ATIVO' AND a.dataFim > :now")
    boolean hasActiveSubscription(@Param("usuarioId") UUID usuarioId, @Param("now") LocalDateTime now);

    /**
     * Find expired subscriptions that need status update.
     */
    @Query("SELECT a FROM AssinaturaEntity a WHERE a.status = 'ATIVO' AND a.dataFim < :now")
    List<AssinaturaEntity> findExpiredSubscriptions(@Param("now") LocalDateTime now);

    void deleteByUsuarioId(UUID usuarioId);
}
