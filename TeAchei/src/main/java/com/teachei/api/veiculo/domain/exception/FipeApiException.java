package com.teachei.api.veiculo.domain.exception;

import com.teachei.api.shared.domain.exception.DomainException;
import org.springframework.http.HttpStatusCode;

/**
 * Exception thrown when the FIPE API returns an error or is unreachable.
 */
public class FipeApiException extends DomainException {

    private final int httpStatusCode;

    public FipeApiException(String message) {
        super("FIPE_API_ERROR", message);
        this.httpStatusCode = 0;
    }

    public FipeApiException(String message, HttpStatusCode statusCode) {
        super("FIPE_API_ERROR", message + " (HTTP " + statusCode.value() + ")");
        this.httpStatusCode = statusCode.value();
    }

    public FipeApiException(String message, Throwable cause) {
        super("FIPE_API_ERROR", message, cause);
        this.httpStatusCode = 0;
    }

    public int getHttpStatusCode() {
        return httpStatusCode;
    }
}
