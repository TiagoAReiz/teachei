package com.teachei.api.shared.web;

import com.teachei.api.shared.domain.model.TipoVeiculo;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

/**
 * Converter for case-insensitive TipoVeiculo conversion from path variables.
 * Allows URLs like /veiculos/carro/marcas to work with TipoVeiculo.CARRO.
 */
@Component
public class StringToTipoVeiculoConverter implements Converter<String, TipoVeiculo> {

    @Override
    public TipoVeiculo convert(String source) {
        if (source == null || source.isBlank()) {
            throw new IllegalArgumentException("Tipo de veículo não pode ser vazio");
        }
        try {
            return TipoVeiculo.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                String.format("Tipo de veículo inválido: '%s'. Valores válidos: carro, moto, caminhao", source)
            );
        }
    }
}
