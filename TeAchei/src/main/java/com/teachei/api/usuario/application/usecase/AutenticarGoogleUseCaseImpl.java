package com.teachei.api.usuario.application.usecase;

import com.teachei.api.usuario.application.ports.in.AutenticarGoogleUseCase;
import com.teachei.api.usuario.application.ports.out.GoogleAuthPort;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.usuario.application.ports.out.UsuarioRepositoryPort;
import com.teachei.api.shared.security.JwtService;
import com.teachei.api.usuario.domain.exception.CredenciaisInvalidasException;
import com.teachei.api.perfil.domain.model.Perfil;
import com.teachei.api.usuario.domain.model.Usuario;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of Google OAuth authentication use case.
 */
public class AutenticarGoogleUseCaseImpl implements AutenticarGoogleUseCase {

    private final GoogleAuthPort googleAuthPort;
    private final UsuarioRepositoryPort usuarioRepository;
    private final PerfilRepositoryPort perfilRepository;
    private final JwtService jwtService;

    public AutenticarGoogleUseCaseImpl(
            GoogleAuthPort googleAuthPort,
            UsuarioRepositoryPort usuarioRepository,
            PerfilRepositoryPort perfilRepository,
            JwtService jwtService) {
        this.googleAuthPort = googleAuthPort;
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResult executar(GoogleAuthCommand command) {
        // Verify Google access token and get user info
        var googleUserInfo = googleAuthPort.verifyToken(command.accessToken())
            .orElseThrow(() -> new CredenciaisInvalidasException("Token do Google inválido"));

        // Check if email is verified
        if (!googleUserInfo.emailVerified()) {
            throw new CredenciaisInvalidasException("Email do Google não verificado");
        }

        // Find existing user or create new one
        Usuario usuario = usuarioRepository.buscarPorEmail(googleUserInfo.email())
            .orElseGet(() -> {
                if (!Boolean.TRUE.equals(command.aceitouTermos())) {
                    throw new CredenciaisInvalidasException(
                        "Você deve aceitar os termos de uso e política de privacidade para criar uma conta");
                }
                return createNewUser(googleUserInfo);
            });

        // Check if user is active
        if (!usuario.isAtivo()) {
            throw new CredenciaisInvalidasException("Usuário desativado");
        }

        // Generate JWT token
        String token = jwtService.generateToken(usuario.getId().toString(), usuario.getEmail());
        long expiresIn = jwtService.getExpirationMillis();

        return new AuthResult(
            token,
            usuario.getId().toString(),
            usuario.getEmail(),
            expiresIn
        );
    }

    private Usuario createNewUser(GoogleAuthPort.GoogleUserInfo googleUserInfo) {
        // Create user with Google OAuth (no password - marked with special hash)
        Usuario usuario = Usuario.criarComGoogle(googleUserInfo.email(), googleUserInfo.sub());
        usuario = usuarioRepository.salvar(usuario);

        // Create profile with Google user info
        Perfil perfil = Perfil.criarPadrao(usuario.getId());
        if (googleUserInfo.name() != null && !googleUserInfo.name().isBlank()) {
            perfil.setNome(googleUserInfo.name());
        }
        if (googleUserInfo.picture() != null && !googleUserInfo.picture().isBlank()) {
            perfil.setFotoUrl(googleUserInfo.picture());
        }
        perfilRepository.salvar(perfil);

        return usuario;
    }
}
