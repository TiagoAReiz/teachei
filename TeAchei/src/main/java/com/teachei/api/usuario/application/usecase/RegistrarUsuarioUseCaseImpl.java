package com.teachei.api.usuario.application.usecase;

import com.teachei.api.usuario.application.ports.in.RegistrarUsuarioUseCase;
import com.teachei.api.shared.security.PasswordEncoderPort;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.usuario.application.ports.out.UsuarioRepositoryPort;
import com.teachei.api.shared.security.JwtService;
import com.teachei.api.usuario.domain.exception.EmailJaCadastradoException;
import com.teachei.api.perfil.domain.Perfil;
import com.teachei.api.usuario.domain.Usuario;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation of the user registration use case.
 */
public class RegistrarUsuarioUseCaseImpl implements RegistrarUsuarioUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PerfilRepositoryPort perfilRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final JwtService jwtService;

    public RegistrarUsuarioUseCaseImpl(UsuarioRepositoryPort usuarioRepository,
                                        PerfilRepositoryPort perfilRepository,
                                        PasswordEncoderPort passwordEncoder,
                                        JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResult executar(RegistrarUsuarioCommand command) {
        // Check if email already exists
        if (usuarioRepository.existePorEmail(command.email())) {
            throw new EmailJaCadastradoException(command.email());
        }

        // Create user with hashed password
        String senhaHash = passwordEncoder.encode(command.senha());
        Usuario usuario = Usuario.criar(command.email(), senhaHash);
        usuario = usuarioRepository.salvar(usuario);

        // Create default profile
        Perfil perfil = Perfil.criarPadrao(usuario.getId());
        if (command.nome() != null && !command.nome().isBlank()) {
            perfil.setNome(command.nome());
        }
        perfilRepository.salvar(perfil);

        // Generate JWT token (auto-login after registration)
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



