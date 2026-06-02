package com.teachei.api.anuncio.persistence.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.teachei.api.anuncio.persistence.document.AnuncioDocument;
import com.teachei.api.anuncio.domain.StatusAnuncio;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioCosmosRepository extends CosmosRepository<AnuncioDocument, String> {

    List<AnuncioDocument> findByUsuarioId(String usuarioId);

    List<AnuncioDocument> findByStatus(StatusAnuncio status);

    long countByStatus(StatusAnuncio status);
}



