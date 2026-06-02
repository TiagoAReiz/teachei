package com.teachei.api.assinatura.application.usecase;

import com.teachei.api.assinatura.application.ports.in.CancelarAssinaturaUseCase;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.shared.domain.exception.AcessoNegadoException;
import com.teachei.api.assinatura.domain.model.Assinatura;

import java.util.UUID;

/**
 * Implementation of CancelarAssinaturaUseCase.
 */
public class CancelarAssinaturaUseCaseImpl implements CancelarAssinaturaUseCase {

    private final AssinaturaRepositoryPort assinaturaRepository;

    public CancelarAssinaturaUseCaseImpl(AssinaturaRepositoryPort assinaturaRepository) {
        this.assinaturaRepository = assinaturaRepository;
    }

    @Override
    public void executar(UUID usuarioId, UUID assinaturaId) {
        Assinatura assinatura = assinaturaRepository.buscarPorId(assinaturaId)
            .orElseThrow(() -> new AcessoNegadoException("Assinatura não encontrada"));

        // Check ownership
        if (!assinatura.getUsuarioId().equals(usuarioId)) {
            throw new AcessoNegadoException("Você não pode cancelar esta assinatura");
        }

        assinatura.cancelar();
        assinaturaRepository.salvar(assinatura);
    }
}
