package com.teachei.api.usuario.application.usecase;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.shared.storage.BlobStoragePort;

import com.teachei.api.usuario.application.ports.in.ExcluirContaUseCase;
import com.teachei.api.usuario.application.ports.out.*;
import com.teachei.api.usuario.domain.exception.UsuarioNaoEncontradoException;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Implementation of account deletion use case.
 * Deletes all user data in compliance with LGPD.
 * Payment transactions are preserved for legal requirements (5 years).
 */
public class ExcluirContaUseCaseImpl implements ExcluirContaUseCase {

    private final UsuarioRepositoryPort usuarioRepository;
    private final PerfilRepositoryPort perfilRepository;
    private final AnuncioRepositoryPort anuncioRepository;
    private final AssinaturaRepositoryPort assinaturaRepository;
    private final BlobStoragePort blobStorage;

    public ExcluirContaUseCaseImpl(UsuarioRepositoryPort usuarioRepository,
                                    PerfilRepositoryPort perfilRepository,
                                    AnuncioRepositoryPort anuncioRepository,
                                    AssinaturaRepositoryPort assinaturaRepository,
                                    BlobStoragePort blobStorage) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.anuncioRepository = anuncioRepository;
        this.assinaturaRepository = assinaturaRepository;
        this.blobStorage = blobStorage;
    }

    @Override
    @Transactional
    // @Transactional cobre apenas as deleções relacionais (Postgres): assinatura,
    // perfil e usuário fazem rollback juntos em caso de falha.
    // Blob Storage e Cosmos (anúncios) NÃO participam da transação JPA — são
    // best-effort e, se já tiverem sido removidos, não são restaurados num rollback.
    public void executar(UUID usuarioId) {
        // Verify user exists
        var usuario = usuarioRepository.buscarPorId(usuarioId)
            .orElseThrow(() -> new UsuarioNaoEncontradoException(usuarioId));

        // Delete profile photo from blob storage
        try {
            blobStorage.deleteProfilePhoto(usuarioId);
        } catch (Exception e) {
            // Best effort cleanup - don't fail deletion
        }

        // Delete announcement photos from blob storage
        var anuncios = anuncioRepository.buscarPorUsuarioId(usuarioId);
        for (var anuncio : anuncios) {
            if (anuncio.getId() != null) {
                try {
                    blobStorage.deleteIntentionPhoto(anuncio.getId());
                } catch (Exception e) {
                    // Best effort cleanup
                }
            }
        }
        anuncioRepository.deletarPorUsuarioId(usuarioId);

        // Delete subscriptions
        assinaturaRepository.deletarPorUsuarioId(usuarioId);

        // Delete profile
        perfilRepository.deletarPorUsuarioId(usuarioId);

        // Delete user account
        usuarioRepository.deletar(usuarioId);
    }
}
