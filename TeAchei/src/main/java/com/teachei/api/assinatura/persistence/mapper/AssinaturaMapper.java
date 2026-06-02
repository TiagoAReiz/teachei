package com.teachei.api.assinatura.persistence.mapper;

import com.teachei.api.assinatura.persistence.entity.AssinaturaEntity;
import com.teachei.api.assinatura.domain.Assinatura;
import org.springframework.stereotype.Component;

/**
 * Mapper between Assinatura domain model and JPA entity.
 */
@Component
public class AssinaturaMapper {

    public Assinatura toDomain(AssinaturaEntity entity) {
        if (entity == null) {
            return null;
        }

        return Assinatura.builder()
            .id(entity.getId())
            .usuarioId(entity.getUsuarioId())
            .plano(entity.getPlano())
            .status(entity.getStatus())
            .dataInicio(entity.getDataInicio())
            .dataFim(entity.getDataFim())
            .transacaoId(entity.getTransacaoId())
            .criadoEm(entity.getCriadoEm())
            .atualizadoEm(entity.getAtualizadoEm())
            .build();
    }

    public AssinaturaEntity toEntity(Assinatura domain) {
        if (domain == null) {
            return null;
        }

        AssinaturaEntity entity = new AssinaturaEntity();
        entity.setId(domain.getId());
        entity.setUsuarioId(domain.getUsuarioId());
        entity.setPlano(domain.getPlano());
        entity.setStatus(domain.getStatus());
        entity.setDataInicio(domain.getDataInicio());
        entity.setDataFim(domain.getDataFim());
        entity.setTransacaoId(domain.getTransacaoId());
        entity.setCriadoEm(domain.getCriadoEm());
        entity.setAtualizadoEm(domain.getAtualizadoEm());
        return entity;
    }
}
