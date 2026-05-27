package com.teachei.api.adapter.out.persistence.cosmosdb.repository;

import com.azure.spring.data.cosmos.repository.CosmosRepository;
import com.teachei.api.adapter.out.persistence.cosmosdb.document.AnuncioDocument;
import com.teachei.api.domain.model.StatusAnuncio;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnuncioCosmosRepository extends CosmosRepository<AnuncioDocument, String> {

    List<AnuncioDocument> findByUsuarioId(String usuarioId);

    List<AnuncioDocument> findByStatus(StatusAnuncio status);

    long countByStatus(StatusAnuncio status);
}



