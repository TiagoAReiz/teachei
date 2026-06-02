package com.teachei.api.usuario.persistence.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@EntityListeners(AuditingEntityListener.class)
public class UsuarioEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(name = "aceitou_termos", nullable = false)
    private boolean aceitouTermos = false;

    @Column(name = "aceitou_termos_em")
    private LocalDateTime aceitouTermosEm;

    @CreatedDate
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @LastModifiedDate
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    public UsuarioEntity() {
    }

    public UsuarioEntity(UUID id, String email, String senha, boolean ativo,
                         boolean aceitouTermos, LocalDateTime aceitouTermosEm,
                         LocalDateTime criadoEm, LocalDateTime atualizadoEm) {
        this.id = id;
        this.email = email;
        this.senha = senha;
        this.ativo = ativo;
        this.aceitouTermos = aceitouTermos;
        this.aceitouTermosEm = aceitouTermosEm;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public boolean isAceitouTermos() {
        return aceitouTermos;
    }

    public void setAceitouTermos(boolean aceitouTermos) {
        this.aceitouTermos = aceitouTermos;
    }

    public LocalDateTime getAceitouTermosEm() {
        return aceitouTermosEm;
    }

    public void setAceitouTermosEm(LocalDateTime aceitouTermosEm) {
        this.aceitouTermosEm = aceitouTermosEm;
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
}



