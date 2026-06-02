package com.teachei.api.anuncio.persistence.mapper;

import com.teachei.api.anuncio.persistence.document.AnuncioDocument;
import com.teachei.api.anuncio.domain.Anuncio;
import com.teachei.api.anuncio.domain.ContatoInfo;
import com.teachei.api.anuncio.domain.VeiculoInfo;
import com.teachei.api.anuncio.domain.VersaoInfo;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class AnuncioDocumentMapper {

    public Anuncio toDomain(AnuncioDocument document) {
        if (document == null) {
            return null;
        }

        Anuncio anuncio = new Anuncio();
        anuncio.setId(document.getId());
        anuncio.setUsuarioId(UUID.fromString(document.getUsuarioId()));
        anuncio.setNicho(document.getNicho());
        anuncio.setTipo(document.getTipo());
        anuncio.setStatus(document.getStatus());
        anuncio.setObservacoes(document.getObservacoes());
        anuncio.setTransacaoId(document.getTransacaoId());
        anuncio.setCriadoEm(document.getCriadoEm());
        anuncio.setExpiraEm(document.getExpiraEm());

        if (document.getDetalhes() != null) {
            anuncio.setVeiculoInfo(toVeiculoInfo(document.getDetalhes()));
        }

        if (document.getContato() != null) {
            anuncio.setContatoInfo(toContatoInfo(document.getContato()));
        }

        return anuncio;
    }

    public AnuncioDocument toDocument(Anuncio domain) {
        if (domain == null) {
            return null;
        }

        AnuncioDocument document = new AnuncioDocument();
        document.setId(domain.getId());
        document.setUsuarioId(domain.getUsuarioId().toString());
        document.setNicho(domain.getNicho());
        document.setTipo(domain.getTipo());
        document.setStatus(domain.getStatus());
        document.setObservacoes(domain.getObservacoes());
        document.setTransacaoId(domain.getTransacaoId());
        document.setCriadoEm(domain.getCriadoEm());
        document.setExpiraEm(domain.getExpiraEm());

        if (domain.getVeiculoInfo() != null) {
            document.setDetalhes(toVeiculoDocument(domain.getVeiculoInfo()));
        }

        if (domain.getContatoInfo() != null) {
            document.setContato(toContatoDocument(domain.getContatoInfo()));
        }

        return document;
    }

    private VeiculoInfo toVeiculoInfo(AnuncioDocument.VeiculoInfoDocument doc) {
        VeiculoInfo info = new VeiculoInfo();
        info.setMarcaCodigo(doc.getMarcaCodigo());
        info.setMarcaNome(doc.getMarcaNome());
        info.setModeloCodigo(doc.getModeloCodigo());
        info.setModeloNome(doc.getModeloNome());
        info.setModeloBaseNome(doc.getModeloBaseNome());
        info.setTodasVersoes(doc.isTodasVersoes());
        
        // Map versoes
        if (doc.getVersoes() != null) {
            List<VersaoInfo> versoes = doc.getVersoes().stream()
                .map(v -> new VersaoInfo(v.getCodigo(), v.getNome()))
                .collect(Collectors.toList());
            info.setVersoes(versoes);
        }
        
        info.setAnos(doc.getAnos() != null ? new ArrayList<>(doc.getAnos()) : new ArrayList<>());
        info.setCores(doc.getCores() != null ? new ArrayList<>(doc.getCores()) : new ArrayList<>());
        info.setPrecoMaximo(doc.getPrecoMaximo());
        info.setPrecoFipeReferencia(doc.getPrecoFipeReferencia());
        info.setQuilometragemMinima(doc.getQuilometragemMinima());
        info.setQuilometragemMaxima(doc.getQuilometragemMaxima());
        info.setOpcionais(doc.getOpcionais() != null ? new ArrayList<>(doc.getOpcionais()) : new ArrayList<>());
        info.setDadosManuais(doc.isDadosManuais());
        info.setFotoReferenciaUrl(doc.getFotoReferenciaUrl());
        return info;
    }

    private AnuncioDocument.VeiculoInfoDocument toVeiculoDocument(VeiculoInfo info) {
        AnuncioDocument.VeiculoInfoDocument doc = new AnuncioDocument.VeiculoInfoDocument();
        doc.setMarcaCodigo(info.getMarcaCodigo());
        doc.setMarcaNome(info.getMarcaNome());
        doc.setModeloCodigo(info.getModeloCodigo());
        doc.setModeloNome(info.getModeloNome());
        doc.setModeloBaseNome(info.getModeloBaseNome());
        doc.setTodasVersoes(info.isTodasVersoes());
        
        // Map versoes
        if (info.getVersoes() != null && !info.getVersoes().isEmpty()) {
            List<AnuncioDocument.VersaoInfoDocument> versoes = info.getVersoes().stream()
                .map(v -> new AnuncioDocument.VersaoInfoDocument(v.getCodigo(), v.getNome()))
                .collect(Collectors.toList());
            doc.setVersoes(versoes);
        }
        
        doc.setAnos(new ArrayList<>(info.getAnos()));
        doc.setCores(new ArrayList<>(info.getCores()));
        doc.setPrecoMaximo(info.getPrecoMaximo());
        doc.setPrecoFipeReferencia(info.getPrecoFipeReferencia());
        doc.setQuilometragemMinima(info.getQuilometragemMinima());
        doc.setQuilometragemMaxima(info.getQuilometragemMaxima());
        doc.setOpcionais(info.getOpcionais() != null ? new ArrayList<>(info.getOpcionais()) : new ArrayList<>());
        doc.setDadosManuais(info.isDadosManuais());
        doc.setFotoReferenciaUrl(info.getFotoReferenciaUrl());
        return doc;
    }

    private ContatoInfo toContatoInfo(AnuncioDocument.ContatoInfoDocument doc) {
        return new ContatoInfo(
            doc.getWhatsapp(),
            doc.getInstagram(),
            doc.getCidade(),
            doc.getEstado()
        );
    }

    private AnuncioDocument.ContatoInfoDocument toContatoDocument(ContatoInfo info) {
        AnuncioDocument.ContatoInfoDocument doc = new AnuncioDocument.ContatoInfoDocument();
        doc.setWhatsapp(info.getWhatsapp());
        doc.setInstagram(info.getInstagram());
        doc.setCidade(info.getCidade());
        doc.setEstado(info.getEstado());
        return doc;
    }
}



