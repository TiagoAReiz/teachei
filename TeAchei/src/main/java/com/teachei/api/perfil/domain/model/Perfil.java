package com.teachei.api.perfil.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Domain model for User Profile (Perfil).
 * Contains contact information, social links, and reputation.
 */
public class Perfil {

    private UUID id;
    private UUID usuarioId;
    private String nome;
    private String bio;
    private String fotoUrl;
    private String whatsapp;
    private String instagram;
    private String facebook;
    private String cidade;
    private String estado;
    private String role;
    private double avaliacaoMedia;
    private int totalAvaliacoes;
    private LocalDateTime criadoEm;
    private LocalDateTime atualizadoEm;

    public Perfil() {
    }

    public static Perfil criarPadrao(UUID usuarioId) {
        Perfil perfil = new Perfil();
        perfil.id = UUID.randomUUID();
        perfil.usuarioId = usuarioId;
        perfil.avaliacaoMedia = 0.0;
        perfil.totalAvaliacoes = 0;
        perfil.criadoEm = LocalDateTime.now();
        perfil.atualizadoEm = LocalDateTime.now();
        return perfil;
    }

    public String getWhatsappLink() {
        if (whatsapp == null || whatsapp.isBlank()) {
            return null;
        }
        // Remove non-numeric characters
        String numero = whatsapp.replaceAll("[^0-9]", "");
        return "https://wa.me/" + numero;
    }

    public void adicionarAvaliacao(int estrelas) {
        if (estrelas < 1 || estrelas > 5) {
            throw new IllegalArgumentException("Avaliação deve ser entre 1 e 5 estrelas");
        }
        double totalPontos = avaliacaoMedia * totalAvaliacoes;
        totalAvaliacoes++;
        avaliacaoMedia = (totalPontos + estrelas) / totalAvaliacoes;
        atualizadoEm = LocalDateTime.now();
    }

    /**
     * Updates profile fields. Only non-null values are applied (partial update).
     * To explicitly clear a field, pass an empty string instead of null.
     */
    public void atualizar(String nome, String bio, String whatsapp, 
                         String instagram, String facebook, 
                         String cidade, String estado) {
        if (nome != null) {
            this.nome = nome;
        }
        if (bio != null) {
            this.bio = bio;
        }
        if (whatsapp != null) {
            this.whatsapp = whatsapp;
        }
        if (instagram != null) {
            this.instagram = instagram;
        }
        if (facebook != null) {
            this.facebook = facebook;
        }
        if (cidade != null) {
            this.cidade = cidade;
        }
        if (estado != null) {
            this.estado = estado;
        }
        this.atualizadoEm = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(UUID usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getFotoUrl() {
        return sanitizeBlobUrl(fotoUrl);
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

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

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

    public String getFacebook() {
        return facebook;
    }

    public void setFacebook(String facebook) {
        this.facebook = facebook;
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

    public double getAvaliacaoMedia() {
        return avaliacaoMedia;
    }

    public void setAvaliacaoMedia(double avaliacaoMedia) {
        this.avaliacaoMedia = avaliacaoMedia;
    }

    public int getTotalAvaliacoes() {
        return totalAvaliacoes;
    }

    public void setTotalAvaliacoes(int totalAvaliacoes) {
        this.totalAvaliacoes = totalAvaliacoes;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }

    public LocalDateTime getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(LocalDateTime atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}



