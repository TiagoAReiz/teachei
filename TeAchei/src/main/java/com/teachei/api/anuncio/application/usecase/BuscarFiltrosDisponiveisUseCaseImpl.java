package com.teachei.api.anuncio.application.usecase;

import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.LocalizacaoOption;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.MarcaOption;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.ModeloOption;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase.FiltrosDisponiveis.OpcionalOption;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.anuncio.domain.model.Anuncio;
import com.teachei.api.anuncio.domain.model.OpcionalVeiculo;
import com.teachei.api.shared.domain.model.TipoVeiculo;
import com.teachei.api.anuncio.domain.model.VeiculoInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of the available filters use case.
 * Aggregates distinct vehicle types, brands, and models from active intentions.
 * Optionals come from the OpcionalVeiculo enum and are always available regardless of database state.
 */
public class BuscarFiltrosDisponiveisUseCaseImpl implements BuscarFiltrosDisponiveisUseCase {

    private static final Logger log = LoggerFactory.getLogger(BuscarFiltrosDisponiveisUseCaseImpl.class);

    private final AnuncioRepositoryPort anuncioRepository;

    public BuscarFiltrosDisponiveisUseCaseImpl(AnuncioRepositoryPort anuncioRepository) {
        this.anuncioRepository = anuncioRepository;
    }

    @Override
    public FiltrosDisponiveis buscar(TipoVeiculo tipo, String marcaCodigo) {
        // Get optionals from enum (does NOT depend on database)
        List<OpcionalOption> opcionais;
        if (tipo != null) {
            opcionais = OpcionalVeiculo.getOpcionaisPorTipo(tipo).stream()
                .map(op -> new OpcionalOption(op.name(), op.getLabel()))
                .sorted(Comparator.comparing(OpcionalOption::label))
                .toList();
        } else {
            // Return all unique optionals from all types when no type is specified
            opcionais = Arrays.stream(OpcionalVeiculo.values())
                .map(op -> new OpcionalOption(op.name(), op.getLabel()))
                .sorted(Comparator.comparing(OpcionalOption::label))
                .toList();
        }
        log.debug("Returning {} opcionais for tipo={}", opcionais.size(), tipo);

        // Fetch active announcements from database for types, brands, and models
        List<Anuncio> ativos;
        try {
            ativos = anuncioRepository.buscarAtivos();
        } catch (Exception e) {
            log.warn("Failed to fetch active announcements for filters: {}. Returning opcionais only.", e.getMessage());
            // Return opcionais even if database query fails
            return new FiltrosDisponiveis(
                tipo != null ? List.of(tipo) : List.of(),
                List.of(),
                List.of(),
                opcionais,
                List.of()
            );
        }

        // Extract distinct vehicle types
        Set<TipoVeiculo> tiposSet = ativos.stream()
            .map(Anuncio::getTipo)
            .filter(Objects::nonNull)
            .collect(Collectors.toCollection(TreeSet::new));

        // Filter by type if specified
        List<Anuncio> filtradosPorTipo = tipo != null
            ? ativos.stream().filter(a -> a.getTipo() == tipo).toList()
            : ativos;

        // Extract distinct brands
        Map<String, String> marcasMap = new LinkedHashMap<>();
        for (Anuncio anuncio : filtradosPorTipo) {
            VeiculoInfo veiculo = anuncio.getVeiculoInfo();
            if (veiculo != null && veiculo.getMarcaCodigo() != null && veiculo.getMarcaNome() != null) {
                marcasMap.putIfAbsent(veiculo.getMarcaCodigo(), veiculo.getMarcaNome());
            }
        }

        List<MarcaOption> marcas = marcasMap.entrySet().stream()
            .sorted(Map.Entry.comparingByValue())
            .map(e -> new MarcaOption(e.getKey(), e.getValue()))
            .toList();

        // Filter by brand if specified
        List<Anuncio> filtradosPorMarca = marcaCodigo != null
            ? filtradosPorTipo.stream()
                .filter(a -> a.getVeiculoInfo() != null && 
                             marcaCodigo.equals(a.getVeiculoInfo().getMarcaCodigo()))
                .toList()
            : filtradosPorTipo;

        // Extract distinct models - include versions from each intention
        Map<String, ModeloOption> modelosMap = new LinkedHashMap<>();
        for (Anuncio anuncio : filtradosPorMarca) {
            VeiculoInfo veiculo = anuncio.getVeiculoInfo();
            if (veiculo == null) continue;
            
            String baseNome = veiculo.getModeloBaseNome() != null 
                ? veiculo.getModeloBaseNome() 
                : extractBaseName(veiculo.getModeloNome());
            
            // Add the base model if it has a code
            if (veiculo.getModeloCodigo() != null && veiculo.getModeloNome() != null) {
                modelosMap.putIfAbsent(veiculo.getModeloCodigo(), 
                    new ModeloOption(veiculo.getModeloCodigo(), veiculo.getModeloNome(), baseNome));
            }
            
            // Also add specific versions if the intention has them
            if (veiculo.getVersoes() != null && !veiculo.getVersoes().isEmpty()) {
                for (var versao : veiculo.getVersoes()) {
                    if (versao.getCodigo() != null && versao.getNome() != null) {
                        modelosMap.putIfAbsent(versao.getCodigo(), 
                            new ModeloOption(versao.getCodigo(), versao.getNome(), baseNome));
                    }
                }
            }
        }

        List<ModeloOption> modelos = modelosMap.values().stream()
            .sorted(Comparator.comparing(ModeloOption::nome))
            .toList();

        // Extract distinct city/state pairs from active intentions
        List<LocalizacaoOption> localizacoes = ativos.stream()
            .map(Anuncio::getContatoInfo)
            .filter(Objects::nonNull)
            .filter(c -> c.getCidade() != null && !c.getCidade().isBlank()
                      && c.getEstado() != null && !c.getEstado().isBlank())
            .map(c -> new LocalizacaoOption(c.getCidade(), c.getEstado()))
            .distinct()
            .sorted(Comparator.comparing(LocalizacaoOption::estado)
                .thenComparing(LocalizacaoOption::cidade))
            .toList();

        return new FiltrosDisponiveis(
            new ArrayList<>(tiposSet),
            marcas,
            modelos,
            opcionais,
            localizacoes
        );
    }

    /**
     * Extracts the base model name (first word) from a full model name.
     */
    private String extractBaseName(String modeloNome) {
        if (modeloNome == null || modeloNome.isBlank()) return modeloNome;
        String[] parts = modeloNome.split("\\s+");
        return parts[0];
    }
}
