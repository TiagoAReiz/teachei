package com.teachei.api.application.usecase;

import com.teachei.api.application.ports.in.VerificarAssinaturaUseCase;
import com.teachei.api.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.domain.model.Assinatura;
import com.teachei.api.domain.model.StatusAssinatura;

import java.util.Comparator;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementation of VerificarAssinaturaUseCase.
 */
public class VerificarAssinaturaUseCaseImpl implements VerificarAssinaturaUseCase {

    private final AssinaturaRepositoryPort assinaturaRepository;

    public VerificarAssinaturaUseCaseImpl(AssinaturaRepositoryPort assinaturaRepository) {
        this.assinaturaRepository = assinaturaRepository;
    }

    @Override
    public boolean temAssinaturaAtiva(UUID usuarioId) {
        return assinaturaRepository.temAssinaturaAtiva(usuarioId);
    }

    @Override
    public Optional<Assinatura> buscarAssinaturaAtual(UUID usuarioId) {
        // First try to find an active subscription
        var ativa = assinaturaRepository.buscarAtivaPorUsuarioId(usuarioId);
        if (ativa.isPresent()) {
            return ativa;
        }
        
        // If no active, return the most recent subscription (pending, etc.)
        var todas = assinaturaRepository.buscarPorUsuarioId(usuarioId);
        return todas.stream()
            .filter(a -> a.getStatus() != StatusAssinatura.CANCELADO)
            .max(Comparator.comparing(Assinatura::getCriadoEm));
    }
}
