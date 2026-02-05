package com.teachei.api.adapter.in.web.controller;

import com.teachei.api.application.ports.in.*;
import com.teachei.api.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis;
import com.teachei.api.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.MarcaOption;
import com.teachei.api.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.ModeloOption;
import com.teachei.api.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.OpcionalOption;
import com.teachei.api.config.StringToTipoVeiculoConverter;
import com.teachei.api.config.WebMvcConfig;
import com.teachei.api.domain.model.TipoVeiculo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AnuncioController.class)
@Import({WebMvcConfig.class, StringToTipoVeiculoConverter.class})
@DisplayName("AnuncioController - Filtros Disponíveis")
class AnuncioControllerFiltrosTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CriarAnuncioUseCase criarAnuncioUseCase;

    @MockBean
    private BuscarAnunciosUseCase buscarAnunciosUseCase;

    @MockBean
    private BuscarFiltrosDisponiveisUseCase buscarFiltrosDisponiveisUseCase;

    @MockBean
    private AtualizarAnuncioUseCase atualizarAnuncioUseCase;

    @MockBean
    private ExcluirAnuncioUseCase excluirAnuncioUseCase;

    @MockBean
    private FinalizarAnuncioUseCase finalizarAnuncioUseCase;

    @MockBean
    private VerificarAssinaturaUseCase verificarAssinaturaUseCase;

    @Test
    @DisplayName("should return available filters without parameters")
    void shouldReturnFiltersWithoutParams() throws Exception {
        var filtros = new FiltrosDisponiveis(
            List.of(TipoVeiculo.CARRO, TipoVeiculo.MOTO),
            List.of(new MarcaOption("23", "Chevrolet"), new MarcaOption("59", "Volkswagen")),
            List.of(new ModeloOption("123", "Onix 1.0 LT", "Onix")),
            List.of(new OpcionalOption("ar", "Ar-condicionado"))
        );

        when(buscarFiltrosDisponiveisUseCase.buscar(null, null))
            .thenReturn(filtros);

        mockMvc.perform(get("/v1/anuncios/filtros"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.tipos").isArray())
            .andExpect(jsonPath("$.tipos.length()").value(2))
            .andExpect(jsonPath("$.tipos[0]").value("CARRO"))
            .andExpect(jsonPath("$.marcas").isArray())
            .andExpect(jsonPath("$.marcas.length()").value(2))
            .andExpect(jsonPath("$.marcas[0].codigo").value("23"))
            .andExpect(jsonPath("$.marcas[0].nome").value("Chevrolet"))
            .andExpect(jsonPath("$.modelos").isArray())
            .andExpect(jsonPath("$.modelos[0].codigo").value("123"))
            .andExpect(jsonPath("$.modelos[0].baseNome").value("Onix"));
    }

    @Test
    @DisplayName("should filter by tipo parameter")
    void shouldFilterByTipo() throws Exception {
        var filtros = new FiltrosDisponiveis(
            List.of(TipoVeiculo.CARRO),
            List.of(new MarcaOption("23", "Chevrolet")),
            List.of(),
            List.of()
        );

        when(buscarFiltrosDisponiveisUseCase.buscar(TipoVeiculo.CARRO, null))
            .thenReturn(filtros);

        mockMvc.perform(get("/v1/anuncios/filtros")
                .param("tipo", "CARRO"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.tipos.length()").value(1))
            .andExpect(jsonPath("$.tipos[0]").value("CARRO"))
            .andExpect(jsonPath("$.marcas.length()").value(1))
            .andExpect(jsonPath("$.marcas[0].nome").value("Chevrolet"));
    }

    @Test
    @DisplayName("should filter by tipo and marcaCodigo parameters")
    void shouldFilterByTipoAndMarca() throws Exception {
        var filtros = new FiltrosDisponiveis(
            List.of(TipoVeiculo.CARRO),
            List.of(new MarcaOption("23", "Chevrolet")),
            List.of(
                new ModeloOption("123", "Onix 1.0 LT", "Onix"),
                new ModeloOption("124", "Onix 1.0 LTZ", "Onix")
            ),
            List.of()
        );

        when(buscarFiltrosDisponiveisUseCase.buscar(TipoVeiculo.CARRO, "23"))
            .thenReturn(filtros);

        mockMvc.perform(get("/v1/anuncios/filtros")
                .param("tipo", "CARRO")
                .param("marcaCodigo", "23"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.modelos.length()").value(2))
            .andExpect(jsonPath("$.modelos[0].baseNome").value("Onix"));
    }

    @Test
    @DisplayName("should return empty arrays when no intentions exist")
    void shouldReturnEmptyWhenNoIntentions() throws Exception {
        var filtros = new FiltrosDisponiveis(
            List.of(),
            List.of(),
            List.of(),
            List.of()
        );

        when(buscarFiltrosDisponiveisUseCase.buscar(any(), any()))
            .thenReturn(filtros);

        mockMvc.perform(get("/v1/anuncios/filtros"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.tipos").isArray())
            .andExpect(jsonPath("$.tipos").isEmpty())
            .andExpect(jsonPath("$.marcas").isArray())
            .andExpect(jsonPath("$.marcas").isEmpty())
            .andExpect(jsonPath("$.modelos").isArray())
            .andExpect(jsonPath("$.modelos").isEmpty());
    }
}
