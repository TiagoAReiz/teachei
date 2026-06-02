package com.teachei.api.usuario.application.ports.in;

/**
 * Inbound port for user registration use case.
 */
public interface RegistrarUsuarioUseCase {

    /**
     * Registers a new user with email and password.
     *
     * @param command the registration command
     * @return the authentication result with token (auto-login after registration)
     */
    AuthResult executar(RegistrarUsuarioCommand command);

    /**
     * Command for user registration.
     */
    record RegistrarUsuarioCommand(
        String email,
        String senha,
        String nome
    ) {
        public RegistrarUsuarioCommand {
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Email é obrigatório");
            }
            if (senha == null || senha.length() < 8) {
                throw new IllegalArgumentException("Senha deve ter no mínimo 8 caracteres");
            }
        }
    }

    /**
     * Result of registration (same as authentication).
     */
    record AuthResult(
        String token,
        String usuarioId,
        String email,
        long expiresIn
    ) {}
}



