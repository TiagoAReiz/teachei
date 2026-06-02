package com.teachei.api.anuncio.persistence.document;

import com.azure.spring.data.cosmos.core.mapping.Container;
import com.azure.spring.data.cosmos.core.mapping.PartitionKey;
import com.teachei.api.anuncio.domain.model.Nicho;
import com.teachei.api.anuncio.domain.model.StatusAnuncio;
import com.teachei.api.shared.domain.model.TipoVeiculo;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Container(containerName = "anuncios")
public class AnuncioDocument {

    @Id
    private String id;

    @PartitionKey
    private String usuarioId;

    private Nicho nicho;
    private TipoVeiculo tipo;
    private StatusAnuncio status;
    private VeiculoInfoDocument detalhes;
    private ContatoInfoDocument contato;
    private String observacoes;
    private String transacaoId;
    private LocalDateTime criadoEm;
    private LocalDateTime expiraEm;

    public AnuncioDocument() {
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(String usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Nicho getNicho() {
        return nicho;
    }

    public void setNicho(Nicho nicho) {
        this.nicho = nicho;
    }

    public TipoVeiculo getTipo() {
        return tipo;
    }

    public void setTipo(TipoVeiculo tipo) {
        this.tipo = tipo;
    }

    public StatusAnuncio getStatus() {
        return status;
    }

    public void setStatus(StatusAnuncio status) {
        this.status = status;
    }

    public VeiculoInfoDocument getDetalhes() {
        return detalhes;
    }

    public void setDetalhes(VeiculoInfoDocument detalhes) {
        this.detalhes = detalhes;
    }

    public ContatoInfoDocument getContato() {
        return contato;
    }

    public void setContato(ContatoInfoDocument contato) {
        this.contato = contato;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public String getTransacaoId() {
        return transacaoId;
    }

    public void setTransacaoId(String transacaoId) {
        this.transacaoId = transacaoId;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getExpiraEm() {
        return expiraEm;
    }

    public void setExpiraEm(LocalDateTime expiraEm) {
        this.expiraEm = expiraEm;
    }

    // Nested document classes
    public static class VeiculoInfoDocument {
        private String marcaCodigo;
        private String marcaNome;
        private String modeloCodigo;
        private String modeloNome;
        private String modeloBaseNome;
        private List<VersaoInfoDocument> versoes;
        private boolean todasVersoes;
        private List<Integer> anos;
        private List<String> cores;
        private BigDecimal precoMaximo;
        private BigDecimal precoFipeReferencia;
        private Integer quilometragemMinima;
        private Integer quilometragemMaxima;
        private List<String> opcionais;
        private boolean dadosManuais;
        private String fotoReferenciaUrl;

        // Getters and Setters
        public String getMarcaCodigo() {
            return marcaCodigo;
        }

        public void setMarcaCodigo(String marcaCodigo) {
            this.marcaCodigo = marcaCodigo;
        }

        public String getMarcaNome() {
            return marcaNome;
        }

        public void setMarcaNome(String marcaNome) {
            this.marcaNome = marcaNome;
        }

        public String getModeloCodigo() {
            return modeloCodigo;
        }

        public void setModeloCodigo(String modeloCodigo) {
            this.modeloCodigo = modeloCodigo;
        }

        public String getModeloNome() {
            return modeloNome;
        }

        public void setModeloNome(String modeloNome) {
            this.modeloNome = modeloNome;
        }

        public List<Integer> getAnos() {
            return anos;
        }

        public void setAnos(List<Integer> anos) {
            this.anos = anos;
        }

        public List<String> getCores() {
            return cores;
        }

        public void setCores(List<String> cores) {
            this.cores = cores;
        }

        public BigDecimal getPrecoMaximo() {
            return precoMaximo;
        }

        public void setPrecoMaximo(BigDecimal precoMaximo) {
            this.precoMaximo = precoMaximo;
        }

        public BigDecimal getPrecoFipeReferencia() {
            return precoFipeReferencia;
        }

        public void setPrecoFipeReferencia(BigDecimal precoFipeReferencia) {
            this.precoFipeReferencia = precoFipeReferencia;
        }

        public boolean isDadosManuais() {
            return dadosManuais;
        }

        public void setDadosManuais(boolean dadosManuais) {
            this.dadosManuais = dadosManuais;
        }

        public Integer getQuilometragemMinima() {
            return quilometragemMinima;
        }

        public void setQuilometragemMinima(Integer quilometragemMinima) {
            this.quilometragemMinima = quilometragemMinima;
        }

        public Integer getQuilometragemMaxima() {
            return quilometragemMaxima;
        }

        public void setQuilometragemMaxima(Integer quilometragemMaxima) {
            this.quilometragemMaxima = quilometragemMaxima;
        }

        public List<String> getOpcionais() {
            return opcionais;
        }

        public void setOpcionais(List<String> opcionais) {
            this.opcionais = opcionais;
        }

        public String getModeloBaseNome() {
            return modeloBaseNome;
        }

        public void setModeloBaseNome(String modeloBaseNome) {
            this.modeloBaseNome = modeloBaseNome;
        }

        public List<VersaoInfoDocument> getVersoes() {
            return versoes;
        }

        public void setVersoes(List<VersaoInfoDocument> versoes) {
            this.versoes = versoes;
        }

        public boolean isTodasVersoes() {
            return todasVersoes;
        }

        public void setTodasVersoes(boolean todasVersoes) {
            this.todasVersoes = todasVersoes;
        }

        public String getFotoReferenciaUrl() {
            return fotoReferenciaUrl;
        }

        public void setFotoReferenciaUrl(String fotoReferenciaUrl) {
            this.fotoReferenciaUrl = fotoReferenciaUrl;
        }
    }

    public static class VersaoInfoDocument {
        private String codigo;
        private String nome;

        public VersaoInfoDocument() {}

        public VersaoInfoDocument(String codigo, String nome) {
            this.codigo = codigo;
            this.nome = nome;
        }

        public String getCodigo() {
            return codigo;
        }

        public void setCodigo(String codigo) {
            this.codigo = codigo;
        }

        public String getNome() {
            return nome;
        }

        public void setNome(String nome) {
            this.nome = nome;
        }
    }

    public static class ContatoInfoDocument {
        private String whatsapp;
        private String instagram;
        private String cidade;
        private String estado;

        // Getters and Setters
        public String getWhatsapp() {
            return whatsapp;
        }

        public void setWhatsapp(String whatsapp) {
            this.whatsapp = whatsapp;
        }

        public String getInstagram() {
            return instagram;
        }

        public void setInstagram(String instagram) {
            this.instagram = instagram;
        }

        public String getCidade() {
            return cidade;
        }

        public void setCidade(String cidade) {
            this.cidade = cidade;
        }

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }
    }
}



