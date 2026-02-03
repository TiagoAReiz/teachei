package com.teachei.api.adapter.in.web.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    String email,

    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>\\[\\]\\-_+=~`]).{8,}$",
        message = "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
    )
    String senha,

    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    String nome
) {}



