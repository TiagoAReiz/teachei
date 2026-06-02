package com.teachei.api.anuncio.domain.model;
import com.teachei.api.perfil.domain.model.Perfil;

/**
 * Value Object for Contact Information.
 * Contains WhatsApp, Instagram, and other contact methods.
 */
public class ContatoInfo {

    private String whatsapp;
    private String instagram;
    private String cidade;
    private String estado;

    public ContatoInfo() {
    }

    public ContatoInfo(String whatsapp, String instagram, String cidade, String estado) {
        this.whatsapp = whatsapp;
        this.instagram = instagram;
        this.cidade = cidade;
        this.estado = estado;
    }

    public static ContatoInfo fromPerfil(Perfil perfil) {
        return new ContatoInfo(
            perfil.getWhatsapp(),
            perfil.getInstagram(),
            perfil.getCidade(),
            perfil.getEstado()
        );
    }

    public String getWhatsappLink() {
        if (whatsapp == null || whatsapp.isBlank()) {
            return null;
        }
        String numero = whatsapp.replaceAll("[^0-9]", "");
        return "https://wa.me/" + numero;
    }

    public String getLocalizacao() {
        if (cidade != null && estado != null) {
            return cidade + ", " + estado;
        } else if (cidade != null) {
            return cidade;
        } else if (estado != null) {
            return estado;
        }
        return null;
    }

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



