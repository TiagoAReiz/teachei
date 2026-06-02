package com.teachei.api.anuncio.persistence;

import com.teachei.api.anuncio.persistence.document.AnuncioDocument;
import com.teachei.api.anuncio.persistence.mapper.AnuncioDocumentMapper;
import com.teachei.api.anuncio.persistence.repository.AnuncioCosmosRepository;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort.ResultadoBusca;
import com.teachei.api.anuncio.domain.model.Anuncio;
import com.teachei.api.anuncio.domain.model.StatusAnuncio;
import com.teachei.api.shared.domain.model.TipoVeiculo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Regression tests for P0.2 — search pagination must apply filters BEFORE
 * counting/paginating. Before the fix, {@code total} came from
 * {@code countByStatus} (unfiltered) and pages were sliced before filtering.
 */
@DisplayName("AnuncioCosmosAdapter - paginação com filtros (P0.2)")
class AnuncioCosmosAdapterPaginacaoTest {

    private AnuncioCosmosRepository repository;
    private AnuncioDocumentMapper mapper;
    private AnuncioCosmosAdapter adapter;

    @BeforeEach
    void setUp() {
        repository = mock(AnuncioCosmosRepository.class);
        mapper = mock(AnuncioDocumentMapper.class);
        adapter = new AnuncioCosmosAdapter(repository, mapper);
    }

    @Test
    @DisplayName("total reflete o conjunto FILTRADO, não countByStatus")
    void totalReflectsFilteredCount() {
        // 3 CARRO + 2 MOTO -> filtro tipo=CARRO deve devolver total=3
        stubRepositoryWith(
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.MOTO),
            anuncioOfTipo(TipoVeiculo.MOTO)
        );

        ResultadoBusca resultado = buscar(TipoVeiculo.CARRO, 0, 10);

        assertThat(resultado.total()).isEqualTo(3);
        assertThat(resultado.anuncios()).hasSize(3);
        verify(repository, never()).countByStatus(any());
    }

    @Test
    @DisplayName("pagina sobre o conjunto filtrado: page 0 size 2 retorna 2 itens")
    void firstPageSlicesFilteredSet() {
        stubRepositoryWith(
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO)
        );

        ResultadoBusca resultado = buscar(TipoVeiculo.CARRO, 0, 2);

        assertThat(resultado.anuncios()).hasSize(2);
        assertThat(resultado.total()).isEqualTo(3);
    }

    @Test
    @DisplayName("última página parcial: page 1 size 2 com 3 itens retorna 1 item")
    void lastPagePartial() {
        stubRepositoryWith(
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO)
        );

        ResultadoBusca resultado = buscar(TipoVeiculo.CARRO, 1, 2);

        assertThat(resultado.anuncios()).hasSize(1);
        assertThat(resultado.total()).isEqualTo(3);
    }

    @Test
    @DisplayName("offset além do fim: retorna lista vazia sem exceção, total preservado")
    void offsetBeyondEndReturnsEmpty() {
        stubRepositoryWith(
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO)
        );

        ResultadoBusca resultado = buscar(TipoVeiculo.CARRO, 5, 10);

        assertThat(resultado.anuncios()).isEmpty();
        assertThat(resultado.total()).isEqualTo(2);
    }

    @Test
    @DisplayName("nenhum item bate no filtro: total=0 e items vazio (não usa countByStatus)")
    void noMatchReturnsZero() {
        stubRepositoryWith(
            anuncioOfTipo(TipoVeiculo.CARRO),
            anuncioOfTipo(TipoVeiculo.CARRO)
        );

        ResultadoBusca resultado = buscar(TipoVeiculo.MOTO, 0, 10);

        assertThat(resultado.anuncios()).isEmpty();
        assertThat(resultado.total()).isZero();
        verify(repository, never()).countByStatus(any());
    }

    // ---- helpers ----

    private void stubRepositoryWith(Anuncio... anuncios) {
        // The adapter calls repository.findByStatus(...) then mapper.toDomain on each.
        // We bypass document fixtures: stub one synthetic document per anuncio and
        // wire the mapper to return the matching domain object.
        AnuncioDocument[] docs = new AnuncioDocument[anuncios.length];
        for (int i = 0; i < anuncios.length; i++) {
            docs[i] = new AnuncioDocument();
            when(mapper.toDomain(docs[i])).thenReturn(anuncios[i]);
        }
        when(repository.findByStatus(StatusAnuncio.ATIVO)).thenReturn(List.of(docs));
    }

    private Anuncio anuncioOfTipo(TipoVeiculo tipo) {
        Anuncio a = new Anuncio();
        a.setTipo(tipo);
        a.setStatus(StatusAnuncio.ATIVO);
        a.setCriadoEm(LocalDateTime.now());
        return a;
    }

    private ResultadoBusca buscar(TipoVeiculo tipo, int pagina, int tamanho) {
        return adapter.buscar(
            StatusAnuncio.ATIVO, tipo,
            null, null, null,           // marcaCodigo, modeloCodigo, modelos
            null, null,                 // anoMin, anoMax
            null, null,                 // precoMin, precoMax
            null, null,                 // kmMin, kmMax
            null, null,                 // search, opcionais
            null, null,                 // cidade, estado
            null,                       // ordenar
            pagina, tamanho
        );
    }
}
