package com.teachei.api.application.ports.in;

import com.teachei.api.domain.model.PlanoAssinatura;

import java.util.List;

/**
 * Use case for fetching available subscription plans.
 */
public interface BuscarPlanosUseCase {

    /**
     * Get all available subscription plans with their prices.
     */  
    List<PlanoInfo> executar();

    /**
     * Plan information record.
     */
    record PlanoInfo(
        PlanoAssinatura id, 
        String nome,
        int precoCentavos,
        int duracaoDias,
        boolean recorrente
    ) {}
}
