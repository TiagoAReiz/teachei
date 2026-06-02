package com.teachei.api.usuario.config;

import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.shared.security.JwtService;
import com.teachei.api.shared.security.PasswordEncoderPort;
import com.teachei.api.shared.storage.BlobStoragePort;
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
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UsuarioBeans {

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
