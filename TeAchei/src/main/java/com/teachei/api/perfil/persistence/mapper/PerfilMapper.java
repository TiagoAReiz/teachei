package com.teachei.api.perfil.persistence.mapper;

import com.teachei.api.perfil.persistence.entity.PerfilEntity;
import com.teachei.api.perfil.domain.Perfil;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface PerfilMapper {

    Perfil toDomain(PerfilEntity entity);

    PerfilEntity toEntity(Perfil domain);
}



