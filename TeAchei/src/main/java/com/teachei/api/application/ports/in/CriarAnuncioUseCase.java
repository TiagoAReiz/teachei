package com.teachei.api.application.ports.in;

import com.teachei.api.domain.model.Anuncio;
import com.teachei.api.shared.domain.TipoVeiculo;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Inbound port for creating purchase intentions.
 */
public interface CriarAnuncioUseCase {

    /**
     * Creates a new purchase intention.
     *
     * @param usuarioId the user creating the intention
     * @param command the creation command
     * @return the created intention
     */
    Anuncio executar(UUID usuarioId, CriarAnuncioCommand command);

    /**
     * Command for creating an intention.
     */
    record CriarAnuncioCommand(
        TipoVeiculo tipo,
        String marcaCodigo,
        String marcaNome,
        String modeloCodigo,
        String modeloNome,
        String modeloBaseNome,
        List<VersaoCommand> versoes,
        boolean todasVersoes,
        List<Integer> anos,
        List<String> cores,
        BigDecimal precoMaximo,
        Integer quilometragemMinima,
        Integer quilometragemMaxima,
        List<String> opcionais,
        String observacoes,
        boolean dadosManuais,
        String cidade,
        String estado,
        String fotoReferenciaBase64
    ) {
        public CriarAnuncioCommand {
            if (tipo == null) {
                throw new IllegalArgumentException("Tipo de veículo é obrigatório");
            }
            if (anos == null || anos.isEmpty()) {
                throw new IllegalArgumentException("Pelo menos um ano deve ser selecionado");
            }
            // cores is optional - empty means "any color"
            if (precoMaximo == null || precoMaximo.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Preço máximo deve ser maior que zero");
            }
        }
    }

    /**
     * Version info for creation command.
     */
    record VersaoCommand(
        String codigo,
        String nome
    ) {}
}



