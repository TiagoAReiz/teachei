package com.teachei.api.adapter.in.web;

import com.teachei.api.adapter.in.web.dto.response.ErrorResponse;
import com.teachei.api.domain.exception.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(fe -> new ErrorResponse.FieldError(fe.getField(), fe.getDefaultMessage()))
            .toList();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Erro de validação",
            "VALIDATION_ERROR",
            request.getRequestURI(),
            fieldErrors
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), "INVALID_ARGUMENT", request);
    }

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleUsuarioNaoEncontrado(
            UsuarioNaoEncontradoException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), ex.getErrorCode(), request);
    }

    @ExceptionHandler(AnuncioNaoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleAnuncioNaoEncontrado(
            AnuncioNaoEncontradoException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), ex.getErrorCode(), request);
    }

    @ExceptionHandler(EmailJaCadastradoException.class)
    public ResponseEntity<ErrorResponse> handleEmailJaCadastrado(
            EmailJaCadastradoException ex, HttpServletRequest request) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), ex.getErrorCode(), request);
    }

    @ExceptionHandler(CredenciaisInvalidasException.class)
    public ResponseEntity<ErrorResponse> handleCredenciaisInvalidas(
            CredenciaisInvalidasException ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Credenciais inválidas", ex.getErrorCode(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Credenciais inválidas", "INVALID_CREDENTIALS", request);
    }

    @ExceptionHandler({AcessoNegadoException.class, AccessDeniedException.class})
    public ResponseEntity<ErrorResponse> handleAcessoNegado(
            Exception ex, HttpServletRequest request) {
        return build(HttpStatus.FORBIDDEN, "Acesso negado", "ACCESS_DENIED", request);
    }

    @ExceptionHandler(AnuncioInvalidoException.class)
    public ResponseEntity<ErrorResponse> handleAnuncioInvalido(
            AnuncioInvalidoException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), ex.getErrorCode(), request);
    }

    @ExceptionHandler(PagamentoException.class)
    public ResponseEntity<ErrorResponse> handlePagamento(
            PagamentoException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), ex.getErrorCode(), request);
    }

    @ExceptionHandler(FipeApiException.class)
    public ResponseEntity<ErrorResponse> handleFipeApi(
            FipeApiException ex, HttpServletRequest request) {
        log.warn("FIPE API error: {} (HTTP {})", ex.getMessage(), ex.getHttpStatusCode());
        return build(HttpStatus.SERVICE_UNAVAILABLE,
            "Serviço de consulta de veículos temporariamente indisponível",
            ex.getErrorCode(), request);
    }

    @ExceptionHandler(ServicoIndisponivelException.class)
    public ResponseEntity<ErrorResponse> handleServicoIndisponivel(
            ServicoIndisponivelException ex, HttpServletRequest request) {
        log.error("External service unavailable: {}", ex.getMessage());
        return build(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage(), ex.getErrorCode(), request);
    }

    @ExceptionHandler(DomainException.class)
    public ResponseEntity<ErrorResponse> handleDomain(
            DomainException ex, HttpServletRequest request) {
        log.warn("Domain exception: {}", ex.getMessage());
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), ex.getErrorCode(), request);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String message;
        Throwable cause = ex.getCause();
        if (cause != null && cause.getCause() instanceof IllegalArgumentException iae) {
            message = iae.getMessage();
        } else {
            message = String.format("Valor inválido para o parâmetro '%s': %s",
                ex.getName(), ex.getValue());
        }
        return build(HttpStatus.BAD_REQUEST, message, "INVALID_PARAMETER", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex, HttpServletRequest request) {
        log.error("Unexpected error", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR,
            "Ocorreu um erro inesperado", "INTERNAL_ERROR", request);
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String message,
                                                String code, HttpServletRequest request) {
        return ResponseEntity.status(status).body(new ErrorResponse(
            status.value(),
            status.getReasonPhrase(),
            message,
            code,
            request.getRequestURI()
        ));
    }
}
