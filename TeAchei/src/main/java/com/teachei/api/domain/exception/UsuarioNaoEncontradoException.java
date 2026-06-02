package com.teachei.api.domain.exception;
import com.teachei.api.shared.domain.exception.DomainException;

import java.util.UUID;

/**
 * Exception thrown when a user is not found.
 */
public class UsuarioNaoEncontradoException extends DomainException {

    public UsuarioNaoEncontradoException(UUID id) {
        super("USER_NOT_FOUND", "Usuário não encontrado: " + id);
    }

    public UsuarioNaoEncontradoException(String email) {
        super("USER_NOT_FOUND", "Usuário não encontrado com email: " + email);
    }
}



