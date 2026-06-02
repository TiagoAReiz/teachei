package com.teachei.api.usuario.persistence.mapper;

import com.teachei.api.usuario.persistence.entity.UsuarioEntity;
import com.teachei.api.usuario.domain.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UsuarioMapper {

    Usuario toDomain(UsuarioEntity entity);

    UsuarioEntity toEntity(Usuario domain);
}



