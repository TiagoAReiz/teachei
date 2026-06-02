package com.teachei.api.anuncio.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Value Object for Vehicle Information.
 * Contains brand, model, years, colors, and maximum price.
 */
public class VeiculoInfo {

    private String marcaCodigo;
    private String marcaNome;
    private String modeloCodigo;
    private String modeloNome;
    private String modeloBaseNome;      // Base model name (e.g., "Onix")
    private List<VersaoInfo> versoes;   // Selected versions [{codigo, nome}]
    private boolean todasVersoes;       // True if "accept any version"
    private List<Integer> anos;
    private List<String> cores;
    private BigDecimal precoMaximo;
    private BigDecimal precoFipeReferencia;
    private Integer quilometragemMinima;
    private Integer quilometragemMaxima;
    private List<String> opcionais;
    private boolean dadosManuais;
    private String fotoReferenciaUrl;

    public VeiculoInfo() {
        this.anos = new ArrayList<>();
        this.cores = new ArrayList<>();
        this.opcionais = new ArrayList<>();
        this.versoes = new ArrayList<>();
        this.todasVersoes = false;
    }

    public VeiculoInfo(String marcaCodigo, String marcaNome, String modeloCodigo, String modeloNome,
                       List<Integer> anos, List<String> cores, BigDecimal precoMaximo) {
        this.marcaCodigo = marcaCodigo;
        this.marcaNome = marcaNome;
        this.modeloCodigo = modeloCodigo;
        this.modeloNome = modeloNome;
        this.anos = anos != null ? new ArrayList<>(anos) : new ArrayList<>();
        this.cores = cores != null ? new ArrayList<>(cores) : new ArrayList<>();
        this.precoMaximo = precoMaximo;
        this.dadosManuais = false;
    }

    public static VeiculoInfo criarManual(String marcaNome, String modeloNome,
                                           List<Integer> anos, List<String> cores, 
                                           BigDecimal precoMaximo) {
        VeiculoInfo info = new VeiculoInfo();
        info.marcaNome = marcaNome;
        info.modeloNome = modeloNome;
        info.anos = anos != null ? new ArrayList<>(anos) : new ArrayList<>();
        info.cores = cores != null ? new ArrayList<>(cores) : new ArrayList<>();
        info.precoMaximo = precoMaximo;
        info.dadosManuais = true;
        return info;
    }

    public void validar() {
        if (marcaNome == null || marcaNome.isBlank()) {
            throw new IllegalArgumentException("Marca é obrigatória");
        }
        if (modeloNome == null || modeloNome.isBlank()) {
            throw new IllegalArgumentException("Modelo é obrigatório");
        }
        if (anos == null || anos.isEmpty()) {
            throw new IllegalArgumentException("Pelo menos um ano deve ser selecionado");
        }
        // cores is optional - empty means "any color"
        if (precoMaximo == null || precoMaximo.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço máximo deve ser maior que zero");
        }
    }

    public String getDescricaoCompleta() {
        return String.format("%s %s (%s)", marcaNome, modeloNome, 
            anos.size() == 1 ? anos.get(0).toString() : anos.get(0) + "-" + anos.get(anos.size() - 1));
    }

    /**
     * Updates the editable fields of the vehicle info.
     * Brand and model are immutable.
     */
    public void atualizar(List<VersaoInfo> versoes, boolean todasVersoes,
                          List<Integer> anos, List<String> cores, BigDecimal precoMaximo,
                          Integer quilometragemMinima, Integer quilometragemMaxima,
                          List<String> opcionais) {
        // Update versions
        this.versoes = versoes != null ? new ArrayList<>(versoes) : new ArrayList<>();
        this.todasVersoes = todasVersoes;
        
        // Update years
        if (anos != null && !anos.isEmpty()) {
            this.anos = new ArrayList<>(anos);
        }
        
        // Update colors (empty list is valid - means "any color")
        if (cores != null) {
            this.cores = new ArrayList<>(cores);
        }
        
        // Update max price
        if (precoMaximo != null && precoMaximo.compareTo(BigDecimal.ZERO) > 0) {
            this.precoMaximo = precoMaximo;
        }
        
        // Update mileage
        this.quilometragemMinima = quilometragemMinima;
        this.quilometragemMaxima = quilometragemMaxima;
        
        // Update optionals
        if (opcionais != null) {
            this.opcionais = new ArrayList<>(opcionais);
        }
    }

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
        return Collections.unmodifiableList(anos);
    }

    public void setAnos(List<Integer> anos) {
        this.anos = anos != null ? new ArrayList<>(anos) : new ArrayList<>();
    }

    public List<String> getCores() {
        return Collections.unmodifiableList(cores);
    }

    public void setCores(List<String> cores) {
        this.cores = cores != null ? new ArrayList<>(cores) : new ArrayList<>();
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
        return opcionais != null ? Collections.unmodifiableList(opcionais) : Collections.emptyList();
    }

    public void setOpcionais(List<String> opcionais) {
        this.opcionais = opcionais != null ? new ArrayList<>(opcionais) : new ArrayList<>();
    }

    public String getModeloBaseNome() {
        return modeloBaseNome;
    }

    public void setModeloBaseNome(String modeloBaseNome) {
        this.modeloBaseNome = modeloBaseNome;
    }

    public List<VersaoInfo> getVersoes() {
        return versoes != null ? Collections.unmodifiableList(versoes) : Collections.emptyList();
    }

    public void setVersoes(List<VersaoInfo> versoes) {
        this.versoes = versoes != null ? new ArrayList<>(versoes) : new ArrayList<>();
    }

    public boolean isTodasVersoes() {
        return todasVersoes;
    }

    public void setTodasVersoes(boolean todasVersoes) {
        this.todasVersoes = todasVersoes;
    }

    public String getFotoReferenciaUrl() {
        return sanitizeBlobUrl(fotoReferenciaUrl);
    }

    /**
     * Fix any double-slash issues in blob storage URLs from older uploads.
     * e.g. https://host.net//container -> https://host.net/container
     */
    private static String sanitizeBlobUrl(String url) {
        if (url == null || url.isEmpty()) return url;
        int protocolEnd = url.indexOf("://");
        if (protocolEnd < 0) return url;
        String protocol = url.substring(0, protocolEnd + 3); // e.g. "https://"
        String path = url.substring(protocolEnd + 3);
        while (path.contains("//")) {
            path = path.replace("//", "/");
        }
        return protocol + path;
    }

    public void setFotoReferenciaUrl(String fotoReferenciaUrl) {
        this.fotoReferenciaUrl = fotoReferenciaUrl;
    }
}



