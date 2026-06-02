package com.teachei.api.anuncio.web.dto.request;

import com.teachei.api.shared.domain.model.TipoVeiculo;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record CriarAnuncioRequest(
    @NotNull(message = "Tipo de veículo é obrigatório")
    TipoVeiculo tipo,

    String marcaCodigo,
    String marcaNome,
    String modeloCodigo,
    String modeloNome,
    String modeloBaseNome,           // Base model name (e.g., "Onix")
    List<VersaoRequest> versoes,     // Selected versions [{codigo, nome}]
    boolean todasVersoes,            // True if "accept any version"

    @NotEmpty(message = "Pelo menos um ano deve ser selecionado")
    List<Integer> anos,

    List<String> cores,  // Optional - empty means "any color"

    @NotNull(message = "Preço máximo é obrigatório")
    @Positive(message = "Preço máximo deve ser maior que zero")
    BigDecimal precoMaximo,

    Integer quilometragemMinima,
    Integer quilometragemMaxima,
    
    List<String> opcionais,

    String observacoes,
    boolean dadosManuais,
    
    String cidade,
    
    @Pattern(regexp = "^$|^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$", 
             message = "Estado deve ser uma UF brasileira válida (ex: SP, RJ)")
    String estado,
    
    @Size(max = 3000000, message = "Foto de referência deve ter no máximo 2MB")
    String fotoReferenciaBase64  // Optional reference photo for the vehicle
) {
    public record VersaoRequest(
        String codigo,
        String nome
    ) {}
}



