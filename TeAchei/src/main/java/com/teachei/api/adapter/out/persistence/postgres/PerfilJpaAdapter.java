package com.teachei.api.adapter.out.persistence.postgres;

import com.teachei.api.adapter.out.persistence.postgres.mapper.PerfilMapper;
import com.teachei.api.adapter.out.persistence.postgres.repository.PerfilJpaRepository;
import com.teachei.api.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.domain.model.Perfil;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class PerfilJpaAdapter implements PerfilRepositoryPort {

    private final PerfilJpaRepository repository;
    private final PerfilMapper mapper;

    public PerfilJpaAdapter(PerfilJpaRepository repository, PerfilMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Perfil salvar(Perfil perfil) {
        var entity = mapper.toEntity(perfil);
        var saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Perfil> buscarPorId(UUID id) {
        return repository.findById(id)
            .map(mapper::toDomain);
    }

    @Override
    public Optional<Perfil> buscarPorUsuarioId(UUID usuarioId) {
        return repository.findByUsuarioId(usuarioId)
            .map(mapper::toDomain);
    }

    @Override
    public void deletar(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public void deletarPorUsuarioId(UUID usuarioId) {
        repository.deleteByUsuarioId(usuarioId);
    }
}



