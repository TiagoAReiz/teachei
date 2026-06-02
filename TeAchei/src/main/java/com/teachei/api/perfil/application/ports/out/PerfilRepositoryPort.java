package com.teachei.api.perfil.application.ports.out;

import com.teachei.api.perfil.domain.Perfil;

import java.util.Optional;
import java.util.UUID;

/**
 * Outbound port for profile persistence operations.
 */
public interface PerfilRepositoryPort {

    /**
     * Saves a profile.
     *
     * @param perfil the profile to save
     * @return the saved profile
     */
    Perfil salvar(Perfil perfil);

    /**
     * Finds a profile by ID.
     *
     * @param id the profile ID
     * @return the profile if found
     */
    Optional<Perfil> buscarPorId(UUID id);

    /**
     * Finds a profile by user ID.
     *
     * @param usuarioId the user ID
     * @return the profile if found
     */
    Optional<Perfil> buscarPorUsuarioId(UUID usuarioId);

    /**
     * Deletes a profile by ID.
     *
     * @param id the profile ID
     */
    void deletar(UUID id);

    /**
     * Deletes a profile by user ID.
     *
     * @param usuarioId the user ID
     */
    void deletarPorUsuarioId(UUID usuarioId);
}



