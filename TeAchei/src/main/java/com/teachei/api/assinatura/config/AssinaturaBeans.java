package com.teachei.api.assinatura.config;

import com.teachei.api.assinatura.application.ports.in.BuscarPlanosUseCase;
import com.teachei.api.assinatura.application.ports.in.CancelarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.in.CriarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.in.VerificarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.assinatura.application.usecase.BuscarPlanosUseCaseImpl;
import com.teachei.api.assinatura.application.usecase.CancelarAssinaturaUseCaseImpl;
import com.teachei.api.assinatura.application.usecase.CriarAssinaturaUseCaseImpl;
import com.teachei.api.assinatura.application.usecase.VerificarAssinaturaUseCaseImpl;
import com.teachei.api.pagamento.application.ports.out.PagamentoPort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AssinaturaBeans {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.base-url}")
    private String backendUrl;

    @Bean
    public BuscarPlanosUseCase buscarPlanosUseCase(SubscriptionConfig subscriptionConfig) {
        return new BuscarPlanosUseCaseImpl(subscriptionConfig);
    }

    @Bean
    public CriarAssinaturaUseCase criarAssinaturaUseCase(
            AssinaturaRepositoryPort assinaturaRepository,
            PagamentoPort pagamentoPort,
            SubscriptionConfig subscriptionConfig) {
        return new CriarAssinaturaUseCaseImpl(
            assinaturaRepository,
            pagamentoPort,
            subscriptionConfig,
            frontendUrl,
            backendUrl
        );
    }

    @Bean
    public VerificarAssinaturaUseCase verificarAssinaturaUseCase(AssinaturaRepositoryPort assinaturaRepository) {
        return new VerificarAssinaturaUseCaseImpl(assinaturaRepository);
    }

    @Bean
    public CancelarAssinaturaUseCase cancelarAssinaturaUseCase(AssinaturaRepositoryPort assinaturaRepository) {
        return new CancelarAssinaturaUseCaseImpl(assinaturaRepository);
    }
}
