package com.teachei.api.domain.exception;
import com.teachei.api.shared.domain.exception.DomainException;

/**
 * Exception thrown when attempting to register with an existing email.
 */
public class EmailJaCadastradoException extends DomainException {

    public EmailJaCadastradoException(String email) {
        super("EMAIL_ALREADY_EXISTS", "Email já cadastrado: " + email);
    }
}



