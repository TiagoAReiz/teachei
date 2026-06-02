package com.teachei.api.assinatura.application.usecase;

import com.teachei.api.assinatura.application.ports.in.BuscarPlanosUseCase;
import com.teachei.api.assinatura.config.SubscriptionConfig;
import com.teachei.api.assinatura.domain.PlanoAssinatura;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of BuscarPlanosUseCase.
 */
public class BuscarPlanosUseCaseImpl implements BuscarPlanosUseCase {

    private final SubscriptionConfig subscriptionConfig;

    public BuscarPlanosUseCaseImpl(SubscriptionConfig subscriptionConfig) {
        this.subscriptionConfig = subscriptionConfig;
    }

    @Override
    public List<PlanoInfo> executar() {
        return Arrays.stream(PlanoAssinatura.values())
            .map(plano -> new PlanoInfo(
                plano,
                plano.getNome(),
                subscriptionConfig.getPriceForPlan(plano),
                plano.getDuracaoDias(),
                plano.isRecorrente()
            ))
            .collect(Collectors.toList());
    }
}
