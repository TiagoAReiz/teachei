package com.teachei.api.usuario.application.ports.in;

import java.util.UUID;

/**
 * Inbound port for password change use case.
 */
public interface AlterarSenhaUseCase {

    /**
     * Changes the user's password.
     *
     * @param usuarioId the user ID
     * @param command the password change command
     */
    void executar(UUID usuarioId, AlterarSenhaCommand command);  

    /**
     * Command for password change.
     */
    record AlterarSenhaCommand(
        String senhaAtual,
        String novaSenha
    ) {}
}
