package com.teachei.api.usuario.web.dto.response;

public record AuthResponse(
    String token,
    String usuarioId,
    String email,
    long expiresIn,
    String tokenType
) {
    public AuthResponse(String token, String usuarioId, String email, long expiresIn) {
        this(token, usuarioId, email, expiresIn, "Bearer");
    }
}



