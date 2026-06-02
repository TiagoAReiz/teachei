package com.teachei.api.perfil.application.usecase;

import com.teachei.api.perfil.application.ports.in.GerenciarPerfilUseCase;
import com.teachei.api.shared.storage.BlobStoragePort;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.shared.domain.exception.ServicoIndisponivelException;
import com.teachei.api.usuario.domain.exception.UsuarioNaoEncontradoException;
import com.teachei.api.perfil.domain.model.Perfil;
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
        log.info("Updating profile for user {}, removerFoto={}, hasFoto={}", 
            usuarioId, command.removerFoto(), command.foto() != null);
        
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
            log.info("Processing photo removal for user {}, current fotoUrl={}", usuarioId, perfil.getFotoUrl());
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
            log.info("Uploading new profile photo for user {} (base64 length: {})", 
                usuarioId, command.foto().length());
            // Delete old photo if exists
            if (perfil.getFotoUrl() != null) {
                try {
                    blobStorage.deleteProfilePhoto(usuarioId);
                } catch (Exception e) {
                    log.warn("Failed to delete old photo from Blob for user {}: {}", usuarioId, e.getMessage());
                }
            }
            try {
                String fotoUrl = blobStorage.uploadProfilePhoto(usuarioId, command.foto());
                perfil.setFotoUrl(fotoUrl);
                log.info("Profile photo uploaded to Blob Storage for user {}: {}", usuarioId, fotoUrl);
            } catch (IllegalArgumentException e) {
                throw e; // Re-throw validation errors (e.g., image too large)
            } catch (Exception e) {
                log.error("Failed to upload profile photo for user {}: {}", usuarioId, e.getMessage(), e);
                throw new ServicoIndisponivelException("Armazenamento de fotos", e);
            }
        }

        Perfil saved = perfilRepository.salvar(perfil);
        log.info("Profile saved for user {}, fotoUrl={}", usuarioId, saved.getFotoUrl());
        return saved;
    }
}



