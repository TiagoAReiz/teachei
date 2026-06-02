package com.teachei.api.assinatura.application.usecase;

import com.teachei.api.assinatura.application.ports.in.CriarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.pagamento.application.ports.out.PagamentoPort;
import com.teachei.api.assinatura.config.SubscriptionConfig;
import com.teachei.api.assinatura.domain.model.Assinatura;
import com.teachei.api.assinatura.domain.model.PlanoAssinatura;
import com.teachei.api.assinatura.domain.model.StatusAssinatura;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Implementation of CriarAssinaturaUseCase.
 */
public class CriarAssinaturaUseCaseImpl implements CriarAssinaturaUseCase {

    private final AssinaturaRepositoryPort assinaturaRepository;
    private final PagamentoPort pagamentoPort;
    private final SubscriptionConfig subscriptionConfig;
    private final String frontendUrl;
    private final String backendUrl;

    public CriarAssinaturaUseCaseImpl(
            AssinaturaRepositoryPort assinaturaRepository,
            PagamentoPort pagamentoPort,
            SubscriptionConfig subscriptionConfig,
            String frontendUrl,
            String backendUrl) {
        this.assinaturaRepository = assinaturaRepository;
        this.pagamentoPort = pagamentoPort;
        this.subscriptionConfig = subscriptionConfig;
        this.frontendUrl = frontendUrl;
        this.backendUrl = backendUrl;
    }

    @Override
    public AssinaturaPreferencia executar(UUID usuarioId, PlanoAssinatura plano) {
        // Create pending subscription
        Assinatura assinatura = Assinatura.builder()
            .id(UUID.randomUUID())
            .usuarioId(usuarioId)
            .plano(plano)
            .status(StatusAssinatura.PENDENTE)
            .criadoEm(LocalDateTime.now())
            .atualizadoEm(LocalDateTime.now())
            .build();

        Assinatura saved = assinaturaRepository.salvar(assinatura);

        // Create payment preference
        String externalReference = "sub_" + saved.getId().toString();
        String description = "TeAchei - " + plano.getNome();
        var price = subscriptionConfig.getPriceAsDecimal(plano);

        String successUrl = frontendUrl + "/assinatura/sucesso?id=" + saved.getId();
        String failureUrl = frontendUrl + "/assinatura/erro?id=" + saved.getId();
        String pendingUrl = frontendUrl + "/assinatura/pendente?id=" + saved.getId();
        
        // Notification URL for webhooks - must be set explicitly for test environment
        String notificationUrl = backendUrl + "/api/v1/pagamentos/webhook";

        var preference = pagamentoPort.criarPreferencia(
            externalReference,
            description,
            price,
            successUrl,
            failureUrl,
            pendingUrl,
            notificationUrl
        );

        return new AssinaturaPreferencia(
            saved.getId().toString(),
            preference.id(),
            preference.initPoint(),
            preference.sandboxInitPoint(),
            subscriptionConfig.getPriceForPlan(plano)
        );
    }
}
