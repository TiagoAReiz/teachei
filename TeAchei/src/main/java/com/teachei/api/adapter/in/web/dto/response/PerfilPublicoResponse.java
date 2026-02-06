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
    String fotoUrl,
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
            sanitizeUrl(perfil.getFotoUrl()),
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
