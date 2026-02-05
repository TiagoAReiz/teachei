package com.teachei.api.adapter.in.web.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public record AtualizarAnuncioRequest(
    // Versions - editable
    List<VersaoRequest> versoes,
    boolean todasVersoes,

    // Years - required
    @NotEmpty(message = "Pelo menos um ano deve ser selecionado")
    List<Integer> anos,

    // Colors - optional (empty = any color)
    List<String> cores,

    // Price - required
    @Positive(message = "Preço máximo deve ser maior que zero")
    BigDecimal precoMaximo,

    // Mileage - optional
    Integer quilometragemMinima,
    Integer quilometragemMaxima,

    // Optionals - optional
    List<String> opcionais,

    // Observations - optional
    String observacoes,

    // Location - optional
    String cidade,
    
    @Pattern(regexp = "^$|^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$", 
             message = "Estado deve ser uma UF brasileira válida (ex: SP, RJ)")
    String estado,

    // Reference photo - optional (Base64 encoded)
    String fotoReferenciaBase64
) {
    public record VersaoRequest(
        String codigo,
        String nome
    ) {}
}
