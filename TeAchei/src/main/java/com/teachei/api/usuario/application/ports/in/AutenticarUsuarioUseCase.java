package com.teachei.api.usuario.application.ports.in;

/**
 * Inbound port for user authentication use case.
 */
public interface AutenticarUsuarioUseCase {

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param command the authentication command
     * @return the authentication result with token
     */
    AuthResult executar(AutenticarUsuarioCommand command);

    /** 
     * Command for user authentication.a
     */
    record AutenticarUsuarioCommand(
        String email,
        String senha
    ) {
        public AutenticarUsuarioCommand {
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Email é obrigatório");
            }
            if (senha == null || senha.isBlank()) {
                throw new IllegalArgumentException("Senha é obrigatória");
            }
        }
    }

    /**
     * Result of authentication.
     */
    record AuthResult(
        String token,
        String usuarioId,
        String email,
        long expiresIn
    ) {}
}



