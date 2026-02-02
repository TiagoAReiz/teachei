package com.teachei.api.adapter.in.web.dto.response;

import com.teachei.api.domain.model.Perfil;

import java.time.LocalDateTime;

/**
 * Public profile response with limited fields (no personal contact info).
 * Used when viewing other users' profiles.
 */
public record PerfilPublicoResponse(
    String id,
    String usuarioId,
    String nome,
    String bio,
    String cidade,
    String estado,
    String fotoBase64,
    double avaliacaoMedia,
    int totalAvaliacoes,
    LocalDateTime criadoEm
) {
    public static PerfilPublicoResponse fromDomain(Perfil perfil) {
        return new PerfilPublicoResponse(
            perfil.getId().toString(),
            perfil.getUsuarioId().toString(),
            perfil.getNome(),
            perfil.getBio(),
            perfil.getCidade(),
            perfil.getEstado(),
            perfil.getFotoBase64(),
            perfil.getAvaliacaoMedia(),
            perfil.getTotalAvaliacoes(),
            perfil.getCriadoEm()
        );
    }
}
