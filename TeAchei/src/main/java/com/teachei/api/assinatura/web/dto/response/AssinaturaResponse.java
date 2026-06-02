package com.teachei.api.assinatura.web.dto.response;

import com.teachei.api.assinatura.domain.Assinatura;
import com.teachei.api.assinatura.domain.PlanoAssinatura;
import com.teachei.api.assinatura.domain.StatusAssinatura;

import java.time.LocalDateTime;

/**
 * Response DTO for subscription info.
 */
public record AssinaturaResponse(
    String id,
    PlanoAssinatura plano,
    String planoNome,
    StatusAssinatura status,
    LocalDateTime dataInicio,
    LocalDateTime dataFim,
    boolean assinaturaAtiva,
    int diasRestantes
) {
    public static AssinaturaResponse from(Assinatura assinatura) {
        if (assinatura == null) {
            return null;
        }

        int diasRestantes = 0;
        if (assinatura.getDataFim() != null) {
            long dias = java.time.temporal.ChronoUnit.DAYS.between(
                LocalDateTime.now(), assinatura.getDataFim());
            diasRestantes = Math.max(0, (int) dias);
        }

        return new AssinaturaResponse(
            assinatura.getId().toString(),
            assinatura.getPlano(),
            assinatura.getPlano().getNome(),
            assinatura.getStatus(),
            assinatura.getDataInicio(),
            assinatura.getDataFim(),
            assinatura.isAtiva(),
            diasRestantes
        );
    }
}
