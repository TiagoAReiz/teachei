package com.teachei.api.config;
import com.teachei.api.perfil.application.usecase.GerenciarPerfilUseCaseImpl;
import com.teachei.api.perfil.application.ports.in.GerenciarPerfilUseCase;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.assinatura.config.SubscriptionConfig;
import com.teachei.api.assinatura.application.usecase.BuscarPlanosUseCaseImpl;
import com.teachei.api.assinatura.application.usecase.VerificarAssinaturaUseCaseImpl;
import com.teachei.api.assinatura.application.usecase.CancelarAssinaturaUseCaseImpl;
import com.teachei.api.assinatura.application.usecase.CriarAssinaturaUseCaseImpl;
import com.teachei.api.assinatura.application.ports.in.BuscarPlanosUseCase;
import com.teachei.api.assinatura.application.ports.in.VerificarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.in.CancelarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.in.CriarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.pagamento.application.usecase.ProcessarPagamentoUseCaseImpl;
import com.teachei.api.pagamento.application.ports.in.ProcessarPagamentoUseCase;
import com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort;
import com.teachei.api.pagamento.application.ports.out.PagamentoPort;
import com.teachei.api.shared.storage.BlobStoragePort;

import com.teachei.api.anuncio.application.ports.in.AtualizarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarAnunciosUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase;
import com.teachei.api.anuncio.application.ports.in.CriarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.ExcluirAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.FinalizarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.anuncio.application.usecase.AtualizarAnuncioUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.BuscarAnunciosUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.BuscarFiltrosDisponiveisUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.CriarAnuncioUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.ExcluirAnuncioUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.FinalizarAnuncioUseCaseImpl;
import com.teachei.api.usuario.application.ports.in.AlterarSenhaUseCase;
import com.teachei.api.usuario.application.ports.in.AutenticarGoogleUseCase;
import com.teachei.api.usuario.application.ports.in.AutenticarUsuarioUseCase;
import com.teachei.api.usuario.application.ports.in.ExcluirContaUseCase;
import com.teachei.api.usuario.application.ports.in.RegistrarUsuarioUseCase;
import com.teachei.api.usuario.application.ports.out.GoogleAuthPort;
import com.teachei.api.usuario.application.ports.out.UsuarioRepositoryPort;
import com.teachei.api.usuario.application.usecase.AlterarSenhaUseCaseImpl;
import com.teachei.api.usuario.application.usecase.AutenticarGoogleUseCaseImpl;
import com.teachei.api.usuario.application.usecase.AutenticarUsuarioUseCaseImpl;
import com.teachei.api.usuario.application.usecase.ExcluirContaUseCaseImpl;
import com.teachei.api.usuario.application.usecase.RegistrarUsuarioUseCaseImpl;
import com.teachei.api.shared.security.JwtService;
import com.teachei.api.shared.security.PasswordEncoderPort;
import com.teachei.api.anuncio.domain.AnuncioService;
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


