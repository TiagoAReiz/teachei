package com.teachei.api.domain.exception;
import com.teachei.api.shared.domain.exception.DomainException;

/**
 * Exception thrown when an intention/announcement is invalid.
 */
public class AnuncioInvalidoException extends DomainException {

    public AnuncioInvalidoException(String message) {
        super("INVALID_INTENTION", message);
    }
}



