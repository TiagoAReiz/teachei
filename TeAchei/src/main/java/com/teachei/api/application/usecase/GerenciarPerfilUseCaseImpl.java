package com.teachei.api.application.usecase;

import com.teachei.api.application.ports.in.GerenciarPerfilUseCase;
import com.teachei.api.application.ports.out.BlobStoragePort;
import com.teachei.api.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.domain.exception.UsuarioNaoEncontradoException;
import com.teachei.api.domain.model.Perfil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;

/**
 * Implementation of the profile management use case.
 */
public class GerenciarPerfilUseCaseImpl implements GerenciarPerfilUseCase {

    private static final Logger log = LoggerFactory.getLogger(GerenciarPerfilUseCaseImpl.class);

    private final PerfilRepositoryPort perfilRepository;
    private final BlobStoragePort blobStorage;

    public GerenciarPerfilUseCaseImpl(PerfilRepositoryPort perfilRepository, BlobStoragePort blobStorage) {
        this.perfilRepository = perfilRepository;
        this.blobStorage = blobStorage;
    }

    @Override
    public Perfil buscarPorUsuario(UUID usuarioId) {
        return perfilRepository.buscarPorUsuarioId(usuarioId)
            .orElseThrow(() -> new UsuarioNaoEncontradoException(usuarioId));
    }

    @Override
    public Perfil atualizar(UUID usuarioId, AtualizarPerfilCommand command) {
        Perfil perfil = perfilRepository.buscarPorUsuarioId(usuarioId)
            .orElseThrow(() -> new UsuarioNaoEncontradoException(usuarioId));

        perfil.atualizar(
            command.nome(),
            command.bio(),
            command.whatsapp(),
            command.instagram(),
            command.facebook(),
            command.cidade(),
            command.estado()
        );

        // Update role if provided
        if (command.role() != null && !command.role().isBlank()) {
            perfil.setRole(command.role());
        }

        // Handle photo removal
        if (Boolean.TRUE.equals(command.removerFoto())) {
            // Delete from Blob Storage if exists
            if (perfil.getFotoUrl() != null) {
                try {
                    blobStorage.deleteProfilePhoto(usuarioId);
                    log.info("Profile photo deleted from Blob Storage for user {}", usuarioId);
                } catch (Exception e) {
                    log.warn("Failed to delete profile photo from Blob for user {}: {}", usuarioId, e.getMessage());
                }
            }
            perfil.setFotoUrl(null);
        }
        // Update photo if provided - upload to Blob Storage
        else if (command.foto() != null && !command.foto().isBlank()) {
            // Delete old photo if exists
            if (perfil.getFotoUrl() != null) {
                try {
                    blobStorage.deleteProfilePhoto(usuarioId);
                } catch (Exception e) {
                    log.warn("Failed to delete old photo from Blob for user {}: {}", usuarioId, e.getMessage());
                }
            }
            String fotoUrl = blobStorage.uploadProfilePhoto(usuarioId, command.foto());
            if (fotoUrl != null) {
                perfil.setFotoUrl(fotoUrl);
                log.info("Profile photo uploaded to Blob Storage for user {}", usuarioId);
            } else {
                throw new RuntimeException("Falha ao enviar foto para o armazenamento. Tente novamente.");
            }
        }

        return perfilRepository.salvar(perfil);
    }
}



