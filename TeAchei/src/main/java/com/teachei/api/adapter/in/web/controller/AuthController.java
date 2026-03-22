package com.teachei.api.adapter.in.web.controller;

import com.teachei.api.adapter.in.web.dto.request.AlterarSenhaRequest;
import com.teachei.api.adapter.in.web.dto.request.GoogleAuthRequest;
import com.teachei.api.adapter.in.web.dto.request.LoginRequest;
import com.teachei.api.adapter.in.web.dto.request.RegistroRequest;
import com.teachei.api.adapter.in.web.dto.response.AuthResponse;
import com.teachei.api.application.ports.in.AlterarSenhaUseCase;
import com.teachei.api.application.ports.in.AutenticarGoogleUseCase;
import com.teachei.api.application.ports.in.AutenticarUsuarioUseCase;
import com.teachei.api.application.ports.in.RegistrarUsuarioUseCase;
import com.teachei.api.config.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final RegistrarUsuarioUseCase registrarUsuarioUseCase;
    private final AutenticarUsuarioUseCase autenticarUsuarioUseCase;
    private final AutenticarGoogleUseCase autenticarGoogleUseCase;
    private final AlterarSenhaUseCase alterarSenhaUseCase;

    public AuthController(RegistrarUsuarioUseCase registrarUsuarioUseCase,
                          AutenticarUsuarioUseCase autenticarUsuarioUseCase,
                          AutenticarGoogleUseCase autenticarGoogleUseCase,
                          AlterarSenhaUseCase alterarSenhaUseCase) {
        this.registrarUsuarioUseCase = registrarUsuarioUseCase;
        this.autenticarUsuarioUseCase = autenticarUsuarioUseCase;
        this.autenticarGoogleUseCase = autenticarGoogleUseCase;
        this.alterarSenhaUseCase = alterarSenhaUseCase;
    }

    @PostMapping("/registrar")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        var command = new RegistrarUsuarioUseCase.RegistrarUsuarioCommand(
            request.email(),
            request.senha(),
            request.nome()
        );

        var result = registrarUsuarioUseCase.executar(command);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(new AuthResponse(
                result.token(),
                result.usuarioId(),
                result.email(),
                result.expiresIn()
            ));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        var command = new AutenticarUsuarioUseCase.AutenticarUsuarioCommand(
            request.email(),
            request.senha()
        );

        var result = autenticarUsuarioUseCase.executar(command);

        return ResponseEntity.ok(new AuthResponse(
            result.token(),
            result.usuarioId(),
            result.email(),
            result.expiresIn()
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        var command = new AutenticarGoogleUseCase.GoogleAuthCommand(
            request.credential(),
            request.aceitouTermos()
        );

        var result = autenticarGoogleUseCase.executar(command);

        return ResponseEntity.ok(new AuthResponse(
            result.token(),
            result.usuarioId(),
            result.email(),
            result.expiresIn()
        ));
    }

    @PutMapping("/senha")
    public ResponseEntity<Void> alterarSenha(
            @AuthenticationPrincipal CurrentUser currentUser,
            @Valid @RequestBody AlterarSenhaRequest request) {
        
        var command = new AlterarSenhaUseCase.AlterarSenhaCommand(
            request.senhaAtual(),
            request.novaSenha()
        );

        alterarSenhaUseCase.executar(currentUser.getId(), command);

        return ResponseEntity.noContent().build();
    }
}



