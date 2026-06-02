package com.teachei.api.config;

import com.teachei.api.application.ports.in.*;
import com.teachei.api.application.ports.out.*;
import com.teachei.api.application.usecase.*;
import com.teachei.api.shared.security.JwtService;
import com.teachei.api.shared.security.PasswordEncoderPort;
import com.teachei.api.domain.service.AnuncioService;
import com.teachei.api.veiculo.application.ports.in.BuscarVeiculosUseCase;
import com.teachei.api.veiculo.application.ports.out.VeiculoDataPort;
import com.teachei.api.veiculo.application.usecase.BuscarVeiculosUseCaseImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.base-url}")
    private String backendUrl;

    // Domain Services
    @Bean
    public AnuncioService anuncioService() {
        return new AnuncioService();
    }

    // Use Cases
    @Bean
    public RegistrarUsuarioUseCase registrarUsuarioUseCase(
            UsuarioRepositoryPort usuarioRepository,
            PerfilRepositoryPort perfilRepository,
            PasswordEncoderPort passwordEncoder,
            JwtService jwtService) {
        return new RegistrarUsuarioUseCaseImpl(usuarioRepository, perfilRepository, passwordEncoder, jwtService);
    }

    @Bean
    public AutenticarUsuarioUseCase autenticarUsuarioUseCase(
            UsuarioRepositoryPort usuarioRepository,
            PasswordEncoderPort passwordEncoder,
            JwtService jwtService) {
        return new AutenticarUsuarioUseCaseImpl(usuarioRepository, passwordEncoder, jwtService);
    }

    @Bean
    public AutenticarGoogleUseCase autenticarGoogleUseCase(
            GoogleAuthPort googleAuthPort,
            UsuarioRepositoryPort usuarioRepository,
            PerfilRepositoryPort perfilRepository,
            JwtService jwtService) {
        return new AutenticarGoogleUseCaseImpl(googleAuthPort, usuarioRepository, perfilRepository, jwtService);
    }

    @Bean
    public GerenciarPerfilUseCase gerenciarPerfilUseCase(
            PerfilRepositoryPort perfilRepository,
            BlobStoragePort blobStorage) {
        return new GerenciarPerfilUseCaseImpl(perfilRepository, blobStorage);
    }

    @Bean
    public CriarAnuncioUseCase criarAnuncioUseCase(
            AnuncioRepositoryPort anuncioRepository,
            PerfilRepositoryPort perfilRepository,
            AnuncioService anuncioService,
            BlobStoragePort blobStorage) {
        return new CriarAnuncioUseCaseImpl(anuncioRepository, perfilRepository, anuncioService, blobStorage);
    }

    @Bean
    public BuscarAnunciosUseCase buscarAnunciosUseCase(
            AnuncioRepositoryPort anuncioRepository) {
        return new BuscarAnunciosUseCaseImpl(anuncioRepository);
    }

    @Bean
    public BuscarFiltrosDisponiveisUseCase buscarFiltrosDisponiveisUseCase(
            AnuncioRepositoryPort anuncioRepository) {
        return new BuscarFiltrosDisponiveisUseCaseImpl(anuncioRepository);
    }

    @Bean
    public AtualizarAnuncioUseCase atualizarAnuncioUseCase(
            AnuncioRepositoryPort anuncioRepository,
            AnuncioService anuncioService,
            BlobStoragePort blobStorage) {
        return new AtualizarAnuncioUseCaseImpl(anuncioRepository, anuncioService, blobStorage);
    }

    @Bean
    public ExcluirAnuncioUseCase excluirAnuncioUseCase(
            AnuncioRepositoryPort anuncioRepository,
            BlobStoragePort blobStorage) {
        return new ExcluirAnuncioUseCaseImpl(anuncioRepository, blobStorage);
    }

    @Bean
    public FinalizarAnuncioUseCase finalizarAnuncioUseCase(
            AnuncioRepositoryPort anuncioRepository) {
        return new FinalizarAnuncioUseCaseImpl(anuncioRepository);
    }

    @Bean
    public BuscarVeiculosUseCase buscarVeiculosUseCase(
            VeiculoDataPort veiculoDataPort) {
        return new BuscarVeiculosUseCaseImpl(veiculoDataPort);
    }

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

    // Subscription Use Cases
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
    public VerificarAssinaturaUseCase verificarAssinaturaUseCase(
            AssinaturaRepositoryPort assinaturaRepository) {
        return new VerificarAssinaturaUseCaseImpl(assinaturaRepository);
    }

    @Bean
    public CancelarAssinaturaUseCase cancelarAssinaturaUseCase(
            AssinaturaRepositoryPort assinaturaRepository) {
        return new CancelarAssinaturaUseCaseImpl(assinaturaRepository);
    }

    @Bean
    public AlterarSenhaUseCase alterarSenhaUseCase(
            UsuarioRepositoryPort usuarioRepository,
            PasswordEncoderPort passwordEncoder) {
        return new AlterarSenhaUseCaseImpl(usuarioRepository, passwordEncoder);
    }

    @Bean
    public ExcluirContaUseCase excluirContaUseCase(
            UsuarioRepositoryPort usuarioRepository,
            PerfilRepositoryPort perfilRepository,
            AnuncioRepositoryPort anuncioRepository,
            AssinaturaRepositoryPort assinaturaRepository,
            BlobStoragePort blobStorage) {
        return new ExcluirContaUseCaseImpl(
            usuarioRepository, perfilRepository, anuncioRepository,
            assinaturaRepository, blobStorage);
    }
}


