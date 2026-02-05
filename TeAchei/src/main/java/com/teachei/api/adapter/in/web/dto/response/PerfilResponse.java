package com.teachei.api.adapter.in.web.dto.response;

import com.teachei.api.domain.model.Perfil;

import java.time.LocalDateTime;

public record PerfilResponse(
    String id,
    String usuarioId,
    String nome,
    String bio,
    String fotoUrl,
    String fotoBase64,
    String whatsapp,
    String whatsappLink,
    String instagram,
    String facebook,
    String cidade,
    String estado,
    String role,
    double avaliacaoMedia,
    int totalAvaliacoes,
    LocalDateTime criadoEm
) {
    public static PerfilResponse fromDomain(Perfil perfil) {
        return new PerfilResponse(
            perfil.getId().toString(),
            perfil.getUsuarioId().toString(),
            perfil.getNome(),
            perfil.getBio(),
            perfil.getFotoUrl(),
            perfil.getFotoBase64(),
            perfil.getWhatsapp(),
            perfil.getWhatsappLink(),
            perfil.getInstagram(),
            perfil.getFacebook(),
            perfil.getCidade(),
            perfil.getEstado(),
            perfil.getRole(),
            perfil.getAvaliacaoMedia(),
            perfil.getTotalAvaliacoes(),
            perfil.getCriadoEm()
        );
    }
}



