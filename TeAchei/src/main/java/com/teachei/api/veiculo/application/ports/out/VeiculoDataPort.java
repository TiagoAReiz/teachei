package com.teachei.api.veiculo.application.ports.out;

import com.teachei.api.shared.domain.TipoVeiculo;

import java.math.BigDecimal;
import java.util.List;

/**
 * Outbound port for vehicle data access (FIPE API).
 */
public interface VeiculoDataPort {

    /**
     * Gets all brands for a vehicle type.
     *
     * @param tipo the vehicle type
     * @return list of brands
     */
    List<Marca> getMarcas(TipoVeiculo tipo);

    /**
     * Gets all models for a brand.
     *
     * @param tipo the vehicle type
     * @param marcaCodigo the brand code
     * @return list of models
     */
    List<Modelo> getModelos(TipoVeiculo tipo, String marcaCodigo);

    /**
     * Gets all years for a model.
     *
     * @param tipo the vehicle type
     * @param marcaCodigo the brand code
     * @param modeloCodigo the model code
     * @return list of years
     */
    List<Ano> getAnos(TipoVeiculo tipo, String marcaCodigo, String modeloCodigo);

    /**
     * Gets the FIPE reference price.
     *
     * @param tipo the vehicle type
     * @param marcaCodigo the brand code
     * @param modeloCodigo the model code
     * @param anoCodigo the year code
     * @return the price details
     */
    PrecoFipe getPrecoFipe(TipoVeiculo tipo, String marcaCodigo, 
                           String modeloCodigo, String anoCodigo);

    record Marca(String codigo, String nome) {}
    record Modelo(String codigo, String nome) {}
    record Ano(String codigo, String nome) {}
    record PrecoFipe(
        BigDecimal valor,
        String marca,
        String modelo,
        int anoModelo,
        String combustivel,
        String codigoFipe,
        String mesReferencia
    ) {}
}



