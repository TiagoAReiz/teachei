package com.teachei.api.adapter.in.web.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AtualizarPerfilRequest(
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    String nome,

    @Size(max = 500, message = "Bio deve ter no máximo 500 caracteres")
    String bio,

    @Pattern(regexp = "^$|^\\+?[1-9]\\d{10,14}$", message = "WhatsApp deve estar no formato internacional (ex: +5511999998888)")
    String whatsapp,

    @Pattern(regexp = "^$|^@?[a-zA-Z0-9._]{1,30}$", message = "Instagram deve ser um nome de usuário válido")
    String instagram,

    @Pattern(regexp = "^$|^[a-zA-Z0-9.]{5,50}$|^https?://.*facebook\\.com/.*$", message = "Facebook deve ser um nome de usuário ou URL válida")
    String facebook,

    @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres")
    String cidade,

    @Size(max = 2, message = "Estado deve ter 2 caracteres (sigla)")
    @Pattern(regexp = "^$|^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$", 
             message = "Estado deve ser uma UF brasileira válida (ex: SP, RJ)")
    String estado,

    @Pattern(regexp = "^$|^(BUYER|SELLER)$", message = "Role deve ser BUYER ou SELLER")
    String role,

    @Size(max = 700000, message = "Foto deve ter no máximo 500KB")
    String fotoBase64,

    Boolean removerFoto  // If true, delete existing photo
) {}



