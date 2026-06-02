package com.teachei.api.anuncio.domain;
import com.teachei.api.shared.domain.TipoVeiculo;

import com.teachei.api.anuncio.domain.exception.AnuncioInvalidoException;
import com.teachei.api.anuncio.domain.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Domain service for business rules related to purchase intentions.
 */
public class AnuncioService {

    private static final int DEFAULT_EXPIRY_DAYS = 60;

    /**
     * Creates a new purchase intention as ATIVO (free for buyers).
     * This is the new business model - intentions are free to create.
     */
    public Anuncio criarAnuncioAtivo(UUID usuarioId, TipoVeiculo tipo, 
                                      VeiculoInfo veiculoInfo, ContatoInfo contatoInfo,
                                      String observacoes) {
        validarVeiculoInfo(veiculoInfo);
        validarContatoInfoComLocalizacao(contatoInfo);
        
        return Anuncio.criarAtivo(usuarioId, tipo, veiculoInfo, contatoInfo, observacoes);
    }

    /**
     * Checks if an intention has expired and updates status.
     */
    public boolean verificarExpiracao(Anuncio anuncio) {
        if (anuncio.getStatus() == StatusAnuncio.ATIVO && anuncio.isExpirado()) {
            anuncio.expirar();
            return true;
        }
        return false;
    }

    /**
     * Cancels an active intention.
     */
    public void cancelarAnuncio(Anuncio anuncio, UUID usuarioId) {
        if (!anuncio.getUsuarioId().equals(usuarioId)) {
            throw new AnuncioInvalidoException("Apenas o dono do anúncio pode cancelá-lo");
        }
        if (anuncio.getStatus() != StatusAnuncio.ATIVO) {
            throw new AnuncioInvalidoException(
                "Anúncio não pode ser cancelado. Status atual: " + anuncio.getStatus());
        }
        anuncio.cancelar();
    }

    /**
     * Checks if a year is within the intention's acceptable years.
     */
    public boolean anoAceito(Anuncio anuncio, int ano) {
        return anuncio.getVeiculoInfo().getAnos().contains(ano);
    }

    /**
     * Checks if a price is within the buyer's maximum.
     */
    public boolean precoAceito(Anuncio anuncio, BigDecimal preco) {
        return preco.compareTo(anuncio.getVeiculoInfo().getPrecoMaximo()) <= 0;
    }

    private void validarVeiculoInfo(VeiculoInfo veiculoInfo) {
        if (veiculoInfo == null) {
            throw new AnuncioInvalidoException("Informações do veículo são obrigatórias");
        }
        try {
            veiculoInfo.validar();
        } catch (IllegalArgumentException e) {
            throw new AnuncioInvalidoException(e.getMessage());
        }
    }

    private void validarContatoInfo(ContatoInfo contatoInfo) {
        if (contatoInfo == null) {
            throw new AnuncioInvalidoException("Informações de contato são obrigatórias");
        }
        if (contatoInfo.getWhatsapp() == null || contatoInfo.getWhatsapp().isBlank()) {
            throw new AnuncioInvalidoException("WhatsApp é obrigatório para contato");
        }
    }

    private void validarContatoInfoComLocalizacao(ContatoInfo contatoInfo) {
        validarContatoInfo(contatoInfo);
        if (contatoInfo.getCidade() == null || contatoInfo.getCidade().isBlank()) {
            throw new AnuncioInvalidoException("Cidade é obrigatória para publicar a intenção");
        }
        if (contatoInfo.getEstado() == null || contatoInfo.getEstado().isBlank()) {
            throw new AnuncioInvalidoException("Estado é obrigatório para publicar a intenção");
        }
    }

    /**
     * Validates year range: anoMinimo <= anoMaximo
     */
    public void validarRangeAnos(Integer anoMinimo, Integer anoMaximo) {
        if (anoMinimo != null && anoMaximo != null && anoMinimo > anoMaximo) {
            throw new AnuncioInvalidoException("Ano mínimo não pode ser maior que ano máximo");
        }
    }

    /**
     * Validates mileage range: kmMinima <= kmMaxima
     */
    public void validarRangeQuilometragem(Integer kmMinima, Integer kmMaxima) {
        if (kmMinima != null && kmMaxima != null && kmMinima > kmMaxima) {
            throw new AnuncioInvalidoException("Quilometragem mínima não pode ser maior que máxima");
        }
    }

    /**
     * Validates that all optionals are compatible with the vehicle type.
     * 
     * @param opcionais the list of optionals selected
     * @param tipo the vehicle type
     * @throws AnuncioInvalidoException if any optional is incompatible
     */
    public void validarOpcionaisCompativeis(List<OpcionalVeiculo> opcionais, TipoVeiculo tipo) {
        if (opcionais == null || opcionais.isEmpty() || tipo == null) {
            return;
        }
        
        List<OpcionalVeiculo> incompativeis = OpcionalVeiculo.getOpcionaisIncompativeis(opcionais, tipo);
        
        if (!incompativeis.isEmpty()) {
            String nomesIncompativeis = incompativeis.stream()
                .map(OpcionalVeiculo::getLabel)
                .collect(Collectors.joining(", "));
            throw new AnuncioInvalidoException(
                "Os seguintes opcionais não são compatíveis com " + tipo.getDescricao() + ": " + nomesIncompativeis);
        }
    }
}



