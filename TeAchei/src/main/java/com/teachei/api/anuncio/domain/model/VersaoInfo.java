package com.teachei.api.anuncio.domain.model;

/**
 * Value Object for Vehicle Version Information.
 * Represents a specific version/variant of a vehicle model.
 */
public class VersaoInfo {

    private String codigo;
    private String nome;

    public VersaoInfo() {
    }

    public VersaoInfo(String codigo, String nome) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VersaoInfo that = (VersaoInfo) o;
        return codigo != null && codigo.equals(that.codigo);
    }

    @Override
    public int hashCode() {
        return codigo != null ? codigo.hashCode() : 0;
    }
}
