package com.teachei.api.pagamento.config;

import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.pagamento.application.ports.in.ProcessarPagamentoUseCase;
import com.teachei.api.pagamento.application.ports.out.PagamentoPort;
import com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort;
import com.teachei.api.pagamento.application.usecase.ProcessarPagamentoUseCaseImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PagamentoBeans {

    @Bean
    public ProcessarPagamentoUseCase processarPagamentoUseCase(
            PagamentoPort pagamentoPort,
            TransacaoRepositoryPort transacaoRepository,
            AssinaturaRepositoryPort assinaturaRepository) {
        return new ProcessarPagamentoUseCaseImpl(
            pagamentoPort,
            transacaoRepository,
            assinaturaRepository
        );
    }
}
