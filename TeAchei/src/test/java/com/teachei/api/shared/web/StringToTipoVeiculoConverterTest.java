package com.teachei.api.shared.web;

import com.teachei.api.shared.domain.TipoVeiculo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("StringToTipoVeiculoConverter")
class StringToTipoVeiculoConverterTest {

    private StringToTipoVeiculoConverter converter;

    @BeforeEach
    void setUp() {
        converter = new StringToTipoVeiculoConverter();
    }

    @ParameterizedTest
    @ValueSource(strings = {"moto", "MOTO", "Moto", "MoTo", "mOtO"})
    @DisplayName("should convert MOTO in any case")
    void shouldConvertMotoInAnyCase(String input) {
        TipoVeiculo result = converter.convert(input);
        assertThat(result).isEqualTo(TipoVeiculo.MOTO);
    }

    @ParameterizedTest
    @ValueSource(strings = {"carro", "CARRO", "Carro", "CaRrO"})
    @DisplayName("should convert CARRO in any case")
    void shouldConvertCarroInAnyCase(String input) {
        TipoVeiculo result = converter.convert(input);
        assertThat(result).isEqualTo(TipoVeiculo.CARRO);
    }

    @ParameterizedTest
    @ValueSource(strings = {"caminhao", "CAMINHAO", "Caminhao", "CaMiNhAo"})
    @DisplayName("should convert CAMINHAO in any case")
    void shouldConvertCaminhaoInAnyCase(String input) {
        TipoVeiculo result = converter.convert(input);
        assertThat(result).isEqualTo(TipoVeiculo.CAMINHAO);
    }

    @Test
    @DisplayName("should throw exception for invalid value")
    void shouldThrowExceptionForInvalidValue() {
        assertThatThrownBy(() -> converter.convert("bicicleta"))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("Tipo de veículo inválido")
            .hasMessageContaining("bicicleta");
    }

    @Test
    @DisplayName("should throw exception for empty string")
    void shouldThrowExceptionForEmptyString() {
        assertThatThrownBy(() -> converter.convert(""))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("não pode ser vazio");
    }

    @Test
    @DisplayName("should throw exception for blank string")
    void shouldThrowExceptionForBlankString() {
        assertThatThrownBy(() -> converter.convert("   "))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("não pode ser vazio");
    }

    @Test
    @DisplayName("should throw exception for null")
    void shouldThrowExceptionForNull() {
        assertThatThrownBy(() -> converter.convert(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("não pode ser vazio");
    }
}
