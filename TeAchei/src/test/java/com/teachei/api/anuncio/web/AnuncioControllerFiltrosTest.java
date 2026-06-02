package com.teachei.api.anuncio.web;

import com.teachei.api.shared.web.GlobalExceptionHandler;
import com.teachei.api.anuncio.application.ports.in.AtualizarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarAnunciosUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase;
import com.teachei.api.anuncio.application.ports.in.CriarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.ExcluirAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.FinalizarAnuncioUseCase;
import com.teachei.api.assinatura.application.ports.in.VerificarAssinaturaUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.MarcaOption;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.ModeloOption;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.OpcionalOption;
import com.teachei.api.shared.web.StringToTipoVeiculoConverter;
import com.teachei.api.shared.domain.TipoVeiculo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.format.support.DefaultFormattingConversionService;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("AnuncioController - Filtros Disponíveis")
class AnuncioControllerFiltrosTest {

    private MockMvc mockMvc;

    private CriarAnuncioUseCase criarAnuncioUseCase;

    private BuscarAnunciosUseCase buscarAnunciosUseCase;

    private BuscarFiltrosDisponiveisUseCase buscarFiltrosDisponiveisUseCase;

    private AtualizarAnuncioUseCase atualizarAnuncioUseCase;

    private ExcluirAnuncioUseCase excluirAnuncioUseCase;

    private FinalizarAnuncioUseCase finalizarAnuncioUseCase;

    private VerificarAssinaturaUseCase verificarAssinaturaUseCase;

    @BeforeEach
    void setUp() {
        criarAnuncioUseCase = org.mockito.Mockito.mock(CriarAnuncioUseCase.class);
        buscarAnunciosUseCase = org.mockito.Mockito.mock(BuscarAnunciosUseCase.class);
        buscarFiltrosDisponiveisUseCase = org.mockito.Mockito.mock(BuscarFiltrosDisponiveisUseCase.class);
        atualizarAnuncioUseCase = org.mockito.Mockito.mock(AtualizarAnuncioUseCase.class);
        excluirAnuncioUseCase = org.mockito.Mockito.mock(ExcluirAnuncioUseCase.class);
        finalizarAnuncioUseCase = org.mockito.Mockito.mock(FinalizarAnuncioUseCase.class);
        verificarAssinaturaUseCase = org.mockito.Mockito.mock(VerificarAssinaturaUseCase.class);

        var controller = new AnuncioController(
            criarAnuncioUseCase,
            buscarAnunciosUseCase,
            buscarFiltrosDisponiveisUseCase,
            atualizarAnuncioUseCase,
            excluirAnuncioUseCase,
            finalizarAnuncioUseCase,
            verificarAssinaturaUseCase
        );

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
    @DisplayName("should return available filters without parameters")
    void shouldReturnFiltersWithoutParams() throws Exception {
        var filtros = new FiltrosDisponiveis(
            List.of(TipoVeiculo.CARRO, TipoVeiculo.MOTO),
            List.of(new MarcaOption("23", "Chevrolet"), new MarcaOption("59", "Volkswagen")),
            List.of(new ModeloOption("123", "Onix 1.0 LT", "Onix")),
            List.of(new OpcionalOption("ar", "Ar-condicionado")),
            List.of()
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
            List.of(),
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
