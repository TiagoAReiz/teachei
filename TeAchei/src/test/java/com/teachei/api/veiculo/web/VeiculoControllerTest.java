package com.teachei.api.veiculo.web;

import com.teachei.api.veiculo.application.ports.in.BuscarVeiculosUseCase;
import com.teachei.api.veiculo.application.ports.in.BuscarVeiculosUseCase.MarcaDTO;
import com.teachei.api.adapter.in.web.GlobalExceptionHandler;
import com.teachei.api.config.StringToTipoVeiculoConverter;
import com.teachei.api.domain.model.TipoVeiculo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.format.support.DefaultFormattingConversionService;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("VeiculoController - Case Insensitive Enum")
class VeiculoControllerTest {

    private MockMvc mockMvc;

    private BuscarVeiculosUseCase buscarVeiculosUseCase;

    @BeforeEach
    void setUp() {
        buscarVeiculosUseCase = org.mockito.Mockito.mock(BuscarVeiculosUseCase.class);
        var controller = new VeiculoController(buscarVeiculosUseCase);

        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
        conversionService.addConverter(new StringToTipoVeiculoConverter());

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setControllerAdvice(new GlobalExceptionHandler())
            .setConversionService(conversionService)
            .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
            .build();
    }

    @Test
    @DisplayName("should accept lowercase tipo in path variable")
    void shouldAcceptLowercaseTipo() throws Exception {
        when(buscarVeiculosUseCase.buscarMarcas(TipoVeiculo.MOTO))
            .thenReturn(List.of(new MarcaDTO("1", "Honda")));

        mockMvc.perform(get("/v1/veiculos/moto/marcas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.marcas[0].nome").value("Honda"));
    }

    @Test
    @DisplayName("should accept uppercase tipo in path variable")
    void shouldAcceptUppercaseTipo() throws Exception {
        when(buscarVeiculosUseCase.buscarMarcas(TipoVeiculo.CARRO))
            .thenReturn(List.of(new MarcaDTO("1", "Volkswagen")));

        mockMvc.perform(get("/v1/veiculos/CARRO/marcas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.marcas[0].nome").value("Volkswagen"));
    }

    @Test
    @DisplayName("should accept mixed case tipo in path variable")
    void shouldAcceptMixedCaseTipo() throws Exception {
        when(buscarVeiculosUseCase.buscarMarcas(TipoVeiculo.CAMINHAO))
            .thenReturn(List.of(new MarcaDTO("1", "Scania")));

        mockMvc.perform(get("/v1/veiculos/Caminhao/marcas"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.marcas[0].nome").value("Scania"));
    }

    @Test
    @DisplayName("should return 400 for invalid tipo value")
    void shouldReturn400ForInvalidTipo() throws Exception {
        mockMvc.perform(get("/v1/veiculos/bicicleta/marcas"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("INVALID_PARAMETER"));
    }
}
