package com.teachei.api.assinatura.persistence;

import com.teachei.api.assinatura.persistence.mapper.AssinaturaMapper;
import com.teachei.api.assinatura.persistence.repository.AssinaturaJpaRepository;
import com.teachei.api.assinatura.application.ports.out.AssinaturaRepositoryPort;
import com.teachei.api.assinatura.domain.Assinatura;
import com.teachei.api.assinatura.domain.StatusAssinatura;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * JPA adapter for subscription repository port.
 */
@Component
public class AssinaturaJpaAdapter implements AssinaturaRepositoryPort {

    private final AssinaturaJpaRepository repository;
    private final AssinaturaMapper mapper;

    public AssinaturaJpaAdapter(AssinaturaJpaRepository repository, AssinaturaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Assinatura salvar(Assinatura assinatura) {
        var entity = mapper.toEntity(assinatura);
        var saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Assinatura> buscarPorId(UUID id) {
        return repository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Assinatura> buscarPorUsuarioId(UUID usuarioId) {
        return repository.findByUsuarioIdOrderByDataFimDesc(usuarioId)
            .stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public Optional<Assinatura> buscarAtivaPorUsuarioId(UUID usuarioId) {
        var actives = repository.findActiveByUsuarioId(
            usuarioId, 
            StatusAssinatura.ATIVO, 
            LocalDateTime.now()
        );
        return actives.isEmpty() ? Optional.empty() : Optional.of(mapper.toDomain(actives.get(0)));
    }

    @Override
    public boolean temAssinaturaAtiva(UUID usuarioId) {
        return repository.hasActiveSubscription(usuarioId, LocalDateTime.now());
    }

    @Override
    public Optional<Assinatura> buscarPorTransacaoId(String transacaoId) {
        return repository.findByTransacaoId(transacaoId).map(mapper::toDomain);
    }

    @Override
    public List<Assinatura> buscarExpiradas() {
        return repository.findExpiredSubscriptions(LocalDateTime.now())
            .stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    public void deletarPorUsuarioId(UUID usuarioId) {
        repository.deleteByUsuarioId(usuarioId);
    }
}
