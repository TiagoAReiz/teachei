package com.teachei.api.usuario.application.ports.out;

import com.teachei.api.usuario.domain.model.Usuario;

import java.util.Optional;
import java.util.UUID;

/**
 * Outbound port for user persistence operations.
 */
public interface UsuarioRepositoryPort {

    /**
     * Saves a user.
     *
     * @param usuario the user to save
     * @return the saved user
     */
    Usuario salvar(Usuario usuario);

    /**
     * Finds a user by ID.
     *
     * @param id the user ID
     * @return the user if found
     */
    Optional<Usuario> buscarPorId(UUID id);

    /**
     * Finds a user by email.
     *
     * @param email the user email
     * @return the user if found
     */
    Optional<Usuario> buscarPorEmail(String email);

    /**
     * Checks if an email already exists.
     *
     * @param email the email to check
     * @return true if exists
     */
    boolean existePorEmail(String email);

    /**
     * Deletes a user by ID.
     *
     * @param id the user ID
     */
    void deletar(UUID id);
}



