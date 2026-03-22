package com.teachei.api.application.ports.in;

/**
 * Inbound port for Google OAuth authentication use case.
 */
public interface AutenticarGoogleUseCase {

    /**
     * Authenticates a user using Google OAuth.
     * If the user doesn't exist, creates a new account.
     *
     * @param command the Google auth command
     * @return the authentication result with token
     */
    AuthResult executar(GoogleAuthCommand command);

    /**
     * Command for Google authentication.
     */
    record GoogleAuthCommand(
        String accessToken,
        Boolean aceitouTermos
    ) {
        public GoogleAuthCommand {
            if (accessToken == null || accessToken.isBlank()) {
                throw new IllegalArgumentException("Token de acesso do Google é obrigatório");
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
