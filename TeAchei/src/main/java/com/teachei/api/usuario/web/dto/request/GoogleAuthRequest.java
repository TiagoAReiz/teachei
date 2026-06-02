package com.teachei.api.usuario.web.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for Google OAuth authentication.
 * aceitouTermos is required for new users (first login).
 * Existing users logging in again can omit it.
 */
public record GoogleAuthRequest(
    @NotBlank(message = "Token de acesso do Google é obrigatório")
    String credential,

    Boolean aceitouTermos
) {}
