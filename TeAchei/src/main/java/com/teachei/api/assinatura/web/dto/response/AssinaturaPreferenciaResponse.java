package com.teachei.api.assinatura.web.dto.response;

/**
 * Response DTO for subscription payment preference.
 */
public record AssinaturaPreferenciaResponse(
    String assinaturaId,
    String preferenceId,
    String initPoint,
    String sandboxInitPoint,
    int valorCentavos,
    String valorFormatado
) {
    public static AssinaturaPreferenciaResponse from(String assinaturaId, String preferenceId,
                                                      String initPoint, String sandboxInitPoint,
                                                      int valorCentavos) {
        String valorFormatado = String.format("R$ %.2f", valorCentavos / 100.0);
        return new AssinaturaPreferenciaResponse(
            assinaturaId, preferenceId, initPoint, sandboxInitPoint, valorCentavos, valorFormatado);
    }
}
