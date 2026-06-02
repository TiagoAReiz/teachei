package com.teachei.api.assinatura.web.dto.response;

import com.teachei.api.assinatura.domain.PlanoAssinatura;

/**
 * Response DTO for subscription plan info.
 */
public record PlanoResponse(
    PlanoAssinatura id,
    String nome,
    int precoCentavos,
    String precoFormatado,
    int duracaoDias,
    boolean recorrente
) {
    public static PlanoResponse from(PlanoAssinatura id, String nome, int precoCentavos, 
                                      int duracaoDias, boolean recorrente) {
        String precoFormatado = String.format("R$ %.2f", precoCentavos / 100.0);
        return new PlanoResponse(id, nome, precoCentavos, precoFormatado, duracaoDias, recorrente);
    }
}
