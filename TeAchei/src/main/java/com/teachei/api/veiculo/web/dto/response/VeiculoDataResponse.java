package com.teachei.api.veiculo.web.dto.response;

import java.math.BigDecimal;
import java.util.List;

public class VeiculoDataResponse {

    public record MarcasResponse(List<MarcaItem> marcas) {}
    public record MarcaItem(String codigo, String nome) {}

    public record ModelosResponse(List<ModeloItem> modelos) {}
    public record ModeloItem(String codigo, String nome) {}

    public record AnosResponse(List<AnoItem> anos) {}
    public record AnoItem(String codigo, String nome) {}

    public record PrecoFipeResponse(
        BigDecimal valor,
        String marca,
        String modelo,
        int anoModelo,
        String combustivel,
        String codigoFipe,
        String mesReferencia
    ) {}
}



