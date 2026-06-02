package com.teachei.api.veiculo.application.ports.in;

import com.teachei.api.domain.model.TipoVeiculo;

import java.math.BigDecimal;
import java.util.List;

/**
 * Inbound port for vehicle data queries (FIPE).
 */
public interface BuscarVeiculosUseCase {

    /**
     * Gets all brands for a vehicle type.
     *
     * @param tipo the vehicle type
     * @return list of brands
     */
    List<MarcaDTO> buscarMarcas(TipoVeiculo tipo);

    /**
     * Gets all models for a brand.
     *
     * @param tipo the vehicle type
     * @param marcaCodigo the brand code
     * @return list of models
     */
    List<ModeloDTO> buscarModelos(TipoVeiculo tipo, String marcaCodigo);

    /**
     * Gets all years for a model.
     *
     * @param tipo the vehicle type
     * @param marcaCodigo the brand code
     * @param modeloCodigo the model code
     * @return list of years
     */
    List<AnoDTO> buscarAnos(TipoVeiculo tipo, String marcaCodigo, String modeloCodigo);

    /**
     * Gets the FIPE reference price for a vehicle.
     *
     * @param tipo the vehicle type
     * @param marcaCodigo the brand code
     * @param modeloCodigo the model code
     * @param anoCodigo the year code
     * @return the price information
     */
    PrecoFipeDTO buscarPreco(TipoVeiculo tipo, String marcaCodigo, 
                              String modeloCodigo, String anoCodigo);

    record MarcaDTO(String codigo, String nome) {}
    record ModeloDTO(String codigo, String nome) {}
    record AnoDTO(String codigo, String nome) {}
    record PrecoFipeDTO(
        BigDecimal valor,
        String marca,
        String modelo,
        int anoModelo, 
        String combustivel,
        String codigoFipe,
        String mesReferencia
    ) {}
}



