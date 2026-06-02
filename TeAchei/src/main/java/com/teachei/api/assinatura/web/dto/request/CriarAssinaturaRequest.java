package com.teachei.api.assinatura.web.dto.request;

import com.teachei.api.assinatura.domain.PlanoAssinatura;
import jakarta.validation.constraints.NotNull;

/**
 * Request to create a new subscription.
 */
public record CriarAssinaturaRequest(
    @NotNull(message = "Plano é obrigatório")
    PlanoAssinatura plano
) {}
