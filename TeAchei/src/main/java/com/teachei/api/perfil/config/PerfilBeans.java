package com.teachei.api.perfil.config;

import com.teachei.api.perfil.application.ports.in.GerenciarPerfilUseCase;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.perfil.application.usecase.GerenciarPerfilUseCaseImpl;
import com.teachei.api.shared.storage.BlobStoragePort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PerfilBeans {

    @Bean
    public GerenciarPerfilUseCase gerenciarPerfilUseCase(
            PerfilRepositoryPort perfilRepository,
            BlobStoragePort blobStorage) {
        return new GerenciarPerfilUseCaseImpl(perfilRepository, blobStorage);
    }
}
