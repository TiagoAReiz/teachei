package com.teachei.api.shared.web.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
    int status,
    String error,
    String message,
    String code,
    String path,
    LocalDateTime timestamp,
    List<FieldError> fieldErrors
) {
    public ErrorResponse(int status, String error, String message, String code, String path) {
        this(status, error, message, code, path, LocalDateTime.now(), null);
    }

    public ErrorResponse(int status, String error, String message, String code, 
                         String path, List<FieldError> fieldErrors) {
        this(status, error, message, code, path, LocalDateTime.now(), fieldErrors);
    }

    public record FieldError(String field, String message) {}
}



