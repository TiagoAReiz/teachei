package com.teachei.api.usuario.application.usecase;

import com.teachei.api.usuario.application.ports.in.AutenticarUsuarioUseCase;
import com.teachei.api.shared.security.PasswordEncoderPort;
import com.teachei.api.usuario.application.ports.out.UsuarioRepositoryPort;
import com.teachei.api.usuario.domain.exception.CredenciaisInvalidasException;
import com.teachei.api.usuario.domain.Usuario;
import com.teachei.api.shared.security.JwtService;

/**
 * Implementation of the user authentication use case.
 */
public class AutenticarUsuarioUseCaseImpl implements AutenticarUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final JwtService jwtService;

    public AutenticarUsuarioUseCaseImpl(UsuarioRepositoryPort usuarioRepository,
                                         PasswordEncoderPort passwordEncoder,
                                         JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResult executar(AutenticarUsuarioCommand command) {
        // Find user by email
        Usuario usuario = usuarioRepository.buscarPorEmail(command.email())
            .orElseThrow(CredenciaisInvalidasException::new);

        // Check if user is active
        if (!usuario.isAtivo()) {
            throw new CredenciaisInvalidasException();
        }

        // Verify password
        if (!passwordEncoder.matches(command.senha(), usuario.getSenha())) {
            throw new CredenciaisInvalidasException();
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
}



