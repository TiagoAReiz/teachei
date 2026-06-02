package com.teachei.api.assinatura.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain entity for seller subscription.
 */
public class Assinatura {

    private UUID id;
    private UUID usuarioId;
    private PlanoAssinatura plano;
    private StatusAssinatura status;
    private LocalDateTime dataInicio;
    private LocalDateTime dataFim;
    private String transacaoId;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Assinatura() {
    }

    public Assinatura(UUID id, UUID usuarioId, PlanoAssinatura plano, StatusAssinatura status,
                      LocalDateTime dataInicio, LocalDateTime dataFim, String transacaoId,
                      LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.plano = plano;
        this.status = status;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.transacaoId = transacaoId;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    /**
     * Check if subscription is currently active.
     */
    public boolean isAtiva() {
        return status == StatusAssinatura.ATIVO && 
               dataFim != null && 
               LocalDateTime.now().isBefore(dataFim);
    }

    /**
     * Activate the subscription after payment confirmation.
     */
    public void ativar(String transacaoId) {
        this.status = StatusAssinatura.ATIVO;
        this.transacaoId = transacaoId;
        this.dataInicio = LocalDateTime.now();
        this.dataFim = this.dataInicio.plusDays(plano.getDuracaoDias());
        this.atualizadoEm = LocalDateTime.now();
    }

    /**
     * Cancel the subscription.
     */
    public void cancelar() {
        this.status = StatusAssinatura.CANCELADO;
        this.atualizadoEm = LocalDateTime.now();
    }

    /**
     * Mark as expired.
     */
    public void expirar() {
        this.status = StatusAssinatura.EXPIRADO;
        this.atualizadoEm = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

    public PlanoAssinatura getPlano() {
        return plano;
    }

    public void setPlano(PlanoAssinatura plano) {
        this.plano = plano;
    }

    public StatusAssinatura getStatus() {
        return status;
    }

    public void setStatus(StatusAssinatura status) {
        this.status = status;
    }

    public LocalDateTime getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDateTime getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDateTime dataFim) {
        this.dataFim = dataFim;
    }

    public String getTransacaoId() {
        return transacaoId;
    }

    public void setTransacaoId(String transacaoId) {
        this.transacaoId = transacaoId;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Assinatura assinatura = new Assinatura();

        public Builder id(UUID id) {
            assinatura.id = id;
            return this;
        }

        public Builder usuarioId(UUID usuarioId) {
            assinatura.usuarioId = usuarioId;
            return this;
        }

        public Builder plano(PlanoAssinatura plano) {
            assinatura.plano = plano;
            return this;
        }

        public Builder status(StatusAssinatura status) {
            assinatura.status = status;
            return this;
        }

        public Builder dataInicio(LocalDateTime dataInicio) {
            assinatura.dataInicio = dataInicio;
            return this;
        }

        public Builder dataFim(LocalDateTime dataFim) {
            assinatura.dataFim = dataFim;
            return this;
        }

        public Builder transacaoId(String transacaoId) {
            assinatura.transacaoId = transacaoId;
            return this;
        }

        public Builder criadoEm(LocalDateTime criadoEm) {
            assinatura.criadoEm = criadoEm;
            return this;
        }

        public Builder atualizadoEm(LocalDateTime atualizadoEm) {
            assinatura.atualizadoEm = atualizadoEm;
            return this;
        }

        public Assinatura build() {
            return assinatura;
        }
    }
}
