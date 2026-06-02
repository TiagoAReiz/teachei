package com.teachei.api.perfil.application.ports.in;

import com.teachei.api.perfil.domain.Perfil;

import java.util.UUID;

/**
 * Inbound port for profile management use case.
 */
public interface GerenciarPerfilUseCase {

    /**
     * Gets the profile of a user.
     *
     * @param usuarioId the user ID
     * @return the user's profile
     */
    Perfil buscarPorUsuario(UUID usuarioId);

    /**
     * Updates a user's profile.
     *
     * @param usuarioId the user ID making the request
     * @param command the update command
     * @return the updated profile
     */
    Perfil atualizar(UUID usuarioId, AtualizarPerfilCommand command);

    /**
     * Command for profile update.
     */
    record AtualizarPerfilCommand(
        String nome,
        String bio,
        String whatsapp,
        String instagram,
        String facebook,
        String cidade,
        String estado,
        String role,
        String foto,  // Base64 encoded photo for upload to Blob Storage
        Boolean removerFoto  // If true, delete existing photo
    ) {}
}



