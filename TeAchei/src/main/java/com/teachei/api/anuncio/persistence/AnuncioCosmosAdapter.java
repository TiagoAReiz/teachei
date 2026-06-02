package com.teachei.api.anuncio.persistence;

import com.teachei.api.anuncio.persistence.mapper.AnuncioDocumentMapper;
import com.teachei.api.anuncio.persistence.repository.AnuncioCosmosRepository;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.anuncio.domain.model.Anuncio;
import com.teachei.api.anuncio.domain.model.OrdemAnuncio;
import com.teachei.api.anuncio.domain.model.StatusAnuncio;
import com.teachei.api.shared.domain.model.TipoVeiculo;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class AnuncioCosmosAdapter implements AnuncioRepositoryPort {

    private final AnuncioCosmosRepository repository;
    private final AnuncioDocumentMapper mapper;

    public AnuncioCosmosAdapter(AnuncioCosmosRepository repository, 
                                 AnuncioDocumentMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Anuncio salvar(Anuncio anuncio) {
        var document = mapper.toDocument(anuncio);
        var saved = repository.save(document);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Anuncio> buscarPorId(String id) {
        return repository.findById(id)
            .map(mapper::toDomain);
    }

    @Override
    public List<Anuncio> buscarPorUsuarioId(UUID usuarioId) {
        return repository.findByUsuarioId(usuarioId.toString())
            .stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public ResultadoBusca buscar(StatusAnuncio status, TipoVeiculo tipo,
                                  String marcaCodigo, String modeloCodigo,
                                  List<String> modelos,
                                  Integer anoMin, Integer anoMax,
                                  BigDecimal precoMin, BigDecimal precoMax,
                                  Integer kmMin, Integer kmMax,
                                  String search, List<String> opcionais,
                                  String cidade, String estado,
                                  OrdemAnuncio ordenar,
                                  int pagina, int tamanho) {
        // In-memory filtering: loads ALL active intentions for the given status and
        // filters/sorts/paginates in memory. Filters must be applied BEFORE counting
        // and paginating so that 'total' reflects the filtered set and pages are
        // computed over the filtered set. Known MVP limitation: for future scale,
        // these filters should be pushed down into the Cosmos @Query.
        List<Anuncio> filtered = repository.findByStatus(status)
            .stream()
            .map(mapper::toDomain)
            .filter(a -> tipo == null || a.getTipo() == tipo)
            .filter(a -> marcaCodigo == null || 
                (a.getVeiculoInfo() != null && marcaCodigo.equals(a.getVeiculoInfo().getMarcaCodigo())))
            // Model filter: single modeloCodigo OR any of the modelos list
            .filter(a -> {
                if (modeloCodigo == null && (modelos == null || modelos.isEmpty())) return true;
                if (a.getVeiculoInfo() == null) return false;
                String adModeloCodigo = a.getVeiculoInfo().getModeloCodigo();
                if (adModeloCodigo == null) return false;
                // Check single model code
                if (modeloCodigo != null && modeloCodigo.equals(adModeloCodigo)) return true;
                // Check if any of the modelos list matches
                if (modelos != null && modelos.contains(adModeloCodigo)) return true;
                return false;
            })
            // Year range filter: matches if any year in the ad is within the range
            .filter(a -> {
                if (anoMin == null && anoMax == null) return true;
                if (a.getVeiculoInfo() == null || a.getVeiculoInfo().getAnos() == null) return false;
                return a.getVeiculoInfo().getAnos().stream().anyMatch(ano ->
                    (anoMin == null || ano >= anoMin) && (anoMax == null || ano <= anoMax)
                );
            })
            // Price range filter: matches if precoMaximo is within the range
            .filter(a -> {
                if (precoMin == null && precoMax == null) return true;
                if (a.getVeiculoInfo() == null || a.getVeiculoInfo().getPrecoMaximo() == null) return false;
                var preco = a.getVeiculoInfo().getPrecoMaximo();
                if (precoMin != null && preco.compareTo(precoMin) < 0) return false;
                if (precoMax != null && preco.compareTo(precoMax) > 0) return false;
                return true;
            })
            // Mileage range filter: matches if the intention's km range overlaps with the filter range
            .filter(a -> {
                if (kmMin == null && kmMax == null) return true;
                if (a.getVeiculoInfo() == null) return false;
                Integer adKmMax = a.getVeiculoInfo().getQuilometragemMaxima();
                Integer adKmMin = a.getVeiculoInfo().getQuilometragemMinima();
                // If intention has no km data, include it (don't filter out)
                if (adKmMax == null && adKmMin == null) return true;
                // Filter by km range overlap
                if (kmMin != null && adKmMax != null && adKmMax < kmMin) return false;
                if (kmMax != null && adKmMin != null && adKmMin > kmMax) return false;
                return true;
            })
            // Text search filter: case-insensitive search in marca, modelo, modeloBase, observacoes
            .filter(a -> {
                if (search == null || search.isBlank()) return true;
                String searchLower = search.toLowerCase();
                return containsIgnoreCase(a.getVeiculoInfo() != null ? a.getVeiculoInfo().getMarcaNome() : null, searchLower) ||
                       containsIgnoreCase(a.getVeiculoInfo() != null ? a.getVeiculoInfo().getModeloNome() : null, searchLower) ||
                       containsIgnoreCase(a.getVeiculoInfo() != null ? a.getVeiculoInfo().getModeloBaseNome() : null, searchLower) ||
                       containsIgnoreCase(a.getObservacoes(), searchLower);
            })
            // Optionals filter: matches if ad contains all requested optionals
            .filter(a -> {
                if (opcionais == null || opcionais.isEmpty()) return true;
                if (a.getVeiculoInfo() == null || a.getVeiculoInfo().getOpcionais() == null) return false;
                return a.getVeiculoInfo().getOpcionais().containsAll(opcionais);
            })
            .filter(a -> cidade == null || 
                (a.getContatoInfo() != null && cidade.equals(a.getContatoInfo().getCidade())))
            .filter(a -> estado == null || 
                (a.getContatoInfo() != null && estado.equals(a.getContatoInfo().getEstado())))
            .sorted(getComparator(ordenar))
            .collect(Collectors.toList());

        long total = filtered.size();

        // Paginate in memory over the filtered set; offset beyond the end yields empty.
        int offset = pagina * tamanho;
        List<Anuncio> paginaFiltrada = offset >= filtered.size()
            ? List.of()
            : filtered.subList(offset, Math.min(offset + tamanho, filtered.size()));

        return new ResultadoBusca(paginaFiltrada, total);
    }

    private Comparator<Anuncio> getComparator(OrdemAnuncio ordenar) {
        if (ordenar == null) ordenar = OrdemAnuncio.RECENTE;
        
        return switch (ordenar) {
            case RECENTE -> Comparator.comparing(Anuncio::getCriadoEm, Comparator.nullsLast(Comparator.reverseOrder()));
            case PRECO_ASC -> Comparator.comparing(
                a -> a.getVeiculoInfo() != null ? a.getVeiculoInfo().getPrecoMaximo() : null,
                Comparator.nullsLast(Comparator.naturalOrder())
            );
            case PRECO_DESC -> Comparator.comparing(
                a -> a.getVeiculoInfo() != null ? a.getVeiculoInfo().getPrecoMaximo() : null,
                Comparator.nullsLast(Comparator.reverseOrder())
            );
            case KM_ASC -> Comparator.comparing(
                a -> a.getVeiculoInfo() != null ? a.getVeiculoInfo().getQuilometragemMaxima() : null,
                Comparator.nullsLast(Comparator.naturalOrder())
            );
            case ANO_DESC -> Comparator.comparing(
                a -> a.getVeiculoInfo() != null && a.getVeiculoInfo().getAnos() != null && !a.getVeiculoInfo().getAnos().isEmpty()
                    ? a.getVeiculoInfo().getAnos().stream().max(Integer::compareTo).orElse(0)
                    : 0,
                Comparator.reverseOrder()
            );
            case NOME_ASC -> Comparator.comparing(
                a -> a.getVeiculoInfo() != null ? a.getVeiculoInfo().getModeloNome() : "",
                Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)
            );
        };
    }

    private boolean containsIgnoreCase(String text, String search) {
        if (text == null || search == null) return false;
        return text.toLowerCase().contains(search);
    }

    @Override
    public long contarPorStatus(StatusAnuncio status) {
        return repository.countByStatus(status);
    }

    @Override
    public List<Anuncio> buscarAtivos() {
        return repository.findByStatus(StatusAnuncio.ATIVO)
            .stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public void deletar(String id) {
        // Cosmos DB requires partition key for delete operations.
        // We need to find the document first to get the usuarioId (partition key)
        repository.findById(id).ifPresent(repository::delete);
    }

    @Override
    public void deletarPorUsuarioId(UUID usuarioId) {
        var documents = repository.findByUsuarioId(usuarioId.toString());
        repository.deleteAll(documents);
    }
}



