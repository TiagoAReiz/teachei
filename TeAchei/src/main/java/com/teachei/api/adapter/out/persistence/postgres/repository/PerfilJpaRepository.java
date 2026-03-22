package com.teachei.api.adapter.out.persistence.postgres.repository;

import com.teachei.api.adapter.out.persistence.postgres.entity.PerfilEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PerfilJpaRepository extends JpaRepository<PerfilEntity, UUID> {

    Optional<PerfilEntity> findByUsuarioId(UUID usuarioId);

    void deleteByUsuarioId(UUID usuarioId);
}



