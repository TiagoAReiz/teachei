package com.teachei.api.anuncio.config;

import com.teachei.api.anuncio.application.ports.in.AtualizarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarAnunciosUseCase;
import com.teachei.api.anuncio.application.ports.in.BuscarFiltrosDisponiveisUseCase;
import com.teachei.api.anuncio.application.ports.in.CriarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.ExcluirAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.in.FinalizarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.anuncio.application.usecase.AtualizarAnuncioUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.BuscarAnunciosUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.BuscarFiltrosDisponiveisUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.CriarAnuncioUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.ExcluirAnuncioUseCaseImpl;
import com.teachei.api.anuncio.application.usecase.FinalizarAnuncioUseCaseImpl;
import com.teachei.api.anuncio.domain.service.AnuncioService;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.shared.storage.BlobStoragePort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AnuncioBeans {

    @Bean
    public AnuncioService anuncioService() {
        return new AnuncioService();
    }

    @Bean
    public CriarAnuncioUseCase criarAnuncioUseCase(
            AnuncioRepositoryPort anuncioRepository,
            PerfilRepositoryPort perfilRepository,
            AnuncioService anuncioService,
            BlobStoragePort blobStorage) {
        return new CriarAnuncioUseCaseImpl(anuncioRepository, perfilRepository, anuncioService, blobStorage);
    }

    @Bean
    public BuscarAnunciosUseCase buscarAnunciosUseCase(AnuncioRepositoryPort anuncioRepository) {
        return new BuscarAnunciosUseCaseImpl(anuncioRepository);
    }

    @Bean
    public BuscarFiltrosDisponiveisUseCase buscarFiltrosDisponiveisUseCase(AnuncioRepositoryPort anuncioRepository) {
        return new BuscarFiltrosDisponiveisUseCaseImpl(anuncioRepository);
    }

    @Bean
    public AtualizarAnuncioUseCase atualizarAnuncioUseCase(
            AnuncioRepositoryPort anuncioRepository,
            AnuncioService anuncioService,
            BlobStoragePort blobStorage) {
        return new AtualizarAnuncioUseCaseImpl(anuncioRepository, anuncioService, blobStorage);
    }

    @Bean
    public ExcluirAnuncioUseCase excluirAnuncioUseCase(
            AnuncioRepositoryPort anuncioRepository,
            BlobStoragePort blobStorage) {
        return new ExcluirAnuncioUseCaseImpl(anuncioRepository, blobStorage);
    }

    @Bean
    public FinalizarAnuncioUseCase finalizarAnuncioUseCase(AnuncioRepositoryPort anuncioRepository) {
        return new FinalizarAnuncioUseCaseImpl(anuncioRepository);
    }
}
