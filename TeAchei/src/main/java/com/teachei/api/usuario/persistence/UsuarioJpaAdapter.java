package com.teachei.api.usuario.persistence;

import com.teachei.api.usuario.persistence.mapper.UsuarioMapper;
import com.teachei.api.usuario.persistence.repository.UsuarioJpaRepository;
import com.teachei.api.usuario.application.ports.out.UsuarioRepositoryPort;
import com.teachei.api.usuario.domain.Usuario;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;

@Component
public class UsuarioJpaAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository repository;
    private final UsuarioMapper mapper;

    public UsuarioJpaAdapter(UsuarioJpaRepository repository, UsuarioMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Usuario salvar(Usuario usuario) {
        var entity = mapper.toEntity(usuario);
        var saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Usuario> buscarPorId(UUID id) {
        return repository.findById(id)
            .map(mapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repository.findByEmail(email)
            .map(mapper::toDomain);
    }

    @Override
    public boolean existePorEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public void deletar(UUID id) {
        repository.deleteById(id);
    }
}



