package com.teachei.api.adapter.in.web.dto.response;

import com.teachei.api.domain.model.Perfil;

import java.time.LocalDateTime;

public record PerfilResponse(
    String id,
    String usuarioId,
    String nome,
    String bio,
    String fotoUrl,
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
            sanitizeUrl(perfil.getFotoUrl()),
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

    private static String sanitizeUrl(String url) {
        if (url == null || url.isEmpty()) return url;
        int p = url.indexOf("://");
        if (p < 0) return url;
        String protocol = url.substring(0, p + 3);
        String path = url.substring(p + 3);
        while (path.contains("//")) {
            path = path.replace("//", "/");
        }
        return protocol + path;
    }
}



