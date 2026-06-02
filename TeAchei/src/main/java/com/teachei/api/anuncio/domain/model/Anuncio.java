package com.teachei.api.anuncio.domain.model;
import com.teachei.api.shared.domain.model.TipoVeiculo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain model for Purchase Intention (Anúncio de Compra).
 * Pure POJO without framework dependencies.
 */
public class Anuncio {

    private String id;
    private UUID usuarioId;
    private Nicho nicho;
    private TipoVeiculo tipo;
    private StatusAnuncio status;
    private VeiculoInfo veiculoInfo;
    private ContatoInfo contatoInfo;
    private String observacoes;
    private String transacaoId;
    private LocalDateTime criadoEm;
    private LocalDateTime expiraEm;

    public Anuncio() {
    }

    private static final int DEFAULT_EXPIRY_DAYS = 60;

    /**
     * Creates a new intention with ATIVO status (free for buyers).
     * This is the new business model - intentions are free to create.
     */
    public static Anuncio criarAtivo(UUID usuarioId, TipoVeiculo tipo, VeiculoInfo veiculoInfo, 
                                      ContatoInfo contatoInfo, String observacoes) {
        Anuncio anuncio = new Anuncio();
        anuncio.id = UUID.randomUUID().toString();
        anuncio.usuarioId = usuarioId;
        anuncio.nicho = Nicho.VEICULO;
        anuncio.tipo = tipo;
        anuncio.status = StatusAnuncio.ATIVO;
        anuncio.veiculoInfo = veiculoInfo;
        anuncio.contatoInfo = contatoInfo;
        anuncio.observacoes = observacoes;
        anuncio.criadoEm = LocalDateTime.now();
        anuncio.expiraEm = LocalDateTime.now().plusDays(DEFAULT_EXPIRY_DAYS);
        return anuncio;
    }

    public void ativar(String transacaoId, int diasValidade) {
        this.status = StatusAnuncio.ATIVO;
        this.transacaoId = transacaoId;
        this.expiraEm = LocalDateTime.now().plusDays(diasValidade);
    }

    public void cancelar() {
        this.status = StatusAnuncio.CANCELADO;
    }

    public void expirar() {
        this.status = StatusAnuncio.EXPIRADO;
    }

    public void finalizar() {
        this.status = StatusAnuncio.FINALIZADO;
    }

    public boolean isExpirado() {
        return expiraEm != null && LocalDateTime.now().isAfter(expiraEm);
    }

    public boolean isPago() {
        return status == StatusAnuncio.ATIVO && transacaoId != null;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Nicho getNicho() {
        return nicho;
    }

    public void setNicho(Nicho nicho) {
        this.nicho = nicho;
    }

    public TipoVeiculo getTipo() {
        return tipo;
    }

    public void setTipo(TipoVeiculo tipo) {
        this.tipo = tipo;
    }

    public StatusAnuncio getStatus() {
        return status;
    }

    public void setStatus(StatusAnuncio status) {
        this.status = status;
    }

    public VeiculoInfo getVeiculoInfo() {
        return veiculoInfo;
    }

    public void setVeiculoInfo(VeiculoInfo veiculoInfo) {
        this.veiculoInfo = veiculoInfo;
    }

    public ContatoInfo getContatoInfo() {
        return contatoInfo;
    }

    public void setContatoInfo(ContatoInfo contatoInfo) {
        this.contatoInfo = contatoInfo;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
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

    public LocalDateTime getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(LocalDateTime expiraEm) {
        this.expiraEm = expiraEm;
    }
}



