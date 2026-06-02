package com.teachei.api.application.usecase;
import com.teachei.api.perfil.domain.Perfil;

import com.teachei.api.application.ports.in.CriarAnuncioUseCase;
import com.teachei.api.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.shared.storage.BlobStoragePort;
import com.teachei.api.perfil.application.ports.out.PerfilRepositoryPort;
import com.teachei.api.domain.exception.UsuarioNaoEncontradoException;
import com.teachei.api.domain.model.*;
import com.teachei.api.domain.service.AnuncioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of the create intention use case.
 */
public class CriarAnuncioUseCaseImpl implements CriarAnuncioUseCase {

    private static final Logger log = LoggerFactory.getLogger(CriarAnuncioUseCaseImpl.class);

    private final AnuncioRepositoryPort anuncioRepository;
    private final PerfilRepositoryPort perfilRepository;
    private final AnuncioService anuncioService;
    private final BlobStoragePort blobStorage;

    public CriarAnuncioUseCaseImpl(AnuncioRepositoryPort anuncioRepository,
                                    PerfilRepositoryPort perfilRepository,
                                    AnuncioService anuncioService,
                                    BlobStoragePort blobStorage) {
        this.anuncioRepository = anuncioRepository;
        this.perfilRepository = perfilRepository;
        this.anuncioService = anuncioService;
        this.blobStorage = blobStorage;
    }

    @Override
    public Anuncio executar(UUID usuarioId, CriarAnuncioCommand command) {
        // Validate year range
        Integer anoMinimo = command.anos() != null && !command.anos().isEmpty() 
            ? command.anos().stream().min(Integer::compareTo).orElse(null)
            : null;
        Integer anoMaximo = command.anos() != null && !command.anos().isEmpty()
            ? command.anos().stream().max(Integer::compareTo).orElse(null)
            : null;
        anuncioService.validarRangeAnos(anoMinimo, anoMaximo);

        // Validate mileage range
        anuncioService.validarRangeQuilometragem(
            command.quilometragemMinima(), 
            command.quilometragemMaxima()
        );

        // Convert optionals from String to OpcionalVeiculo and validate
        List<OpcionalVeiculo> opcionaisEnum = command.opcionais() != null
            ? command.opcionais().stream()
                .map(OpcionalVeiculo::valueOf)
                .toList()
            : List.of();
        anuncioService.validarOpcionaisCompativeis(opcionaisEnum, command.tipo());

        // Get user profile for contact info
        Perfil perfil = perfilRepository.buscarPorUsuarioId(usuarioId)
            .orElseThrow(() -> new UsuarioNaoEncontradoException(usuarioId));

        // Create vehicle info
        VeiculoInfo veiculoInfo;
        if (command.dadosManuais()) {
            veiculoInfo = VeiculoInfo.criarManual(
                command.marcaNome(),
                command.modeloNome(),
                command.anos(),
                command.cores(),
                command.precoMaximo()
            );
        } else {
            veiculoInfo = new VeiculoInfo(
                command.marcaCodigo(),
                command.marcaNome(),
                command.modeloCodigo(),
                command.modeloNome(),
                command.anos(),
                command.cores(),
                command.precoMaximo()
            );
        }
        
        // Set mileage if provided
        if (command.quilometragemMinima() != null) {
            veiculoInfo.setQuilometragemMinima(command.quilometragemMinima());
        }
        if (command.quilometragemMaxima() != null) {
            veiculoInfo.setQuilometragemMaxima(command.quilometragemMaxima());
        }
        
        // Set optional features if provided
        if (command.opcionais() != null && !command.opcionais().isEmpty()) {
            veiculoInfo.setOpcionais(command.opcionais());
        }
        
        // Set version info if provided
        if (command.modeloBaseNome() != null && !command.modeloBaseNome().isBlank()) {
            veiculoInfo.setModeloBaseNome(command.modeloBaseNome());
        }
        veiculoInfo.setTodasVersoes(command.todasVersoes());
        if (command.versoes() != null && !command.versoes().isEmpty()) {
            List<VersaoInfo> versoes = command.versoes().stream()
                .map(v -> new VersaoInfo(v.codigo(), v.nome()))
                .collect(Collectors.toList());
            veiculoInfo.setVersoes(versoes);
        }

        // Create contact info from profile, with overrides from command
        ContatoInfo contatoInfo = ContatoInfo.fromPerfil(perfil);
        
        // Override location from command (required for new business model)
        if (command.cidade() != null && !command.cidade().isBlank()) {
            contatoInfo.setCidade(command.cidade());
        }
        if (command.estado() != null && !command.estado().isBlank()) {
            contatoInfo.setEstado(command.estado());
        }

        // Create intention as ATIVO (free for buyers - new business model)
        Anuncio anuncio = anuncioService.criarAnuncioAtivo(
            usuarioId,
            command.tipo(),
            veiculoInfo,
            contatoInfo,
            command.observacoes()
        );

        // Save first to get the ID
        Anuncio savedAnuncio = anuncioRepository.salvar(anuncio);

        // Upload reference photo if provided
        if (command.fotoReferenciaBase64() != null && !command.fotoReferenciaBase64().isBlank()) {
            try {
                String fotoUrl = blobStorage.uploadIntentionPhoto(savedAnuncio.getId(), command.fotoReferenciaBase64());
                savedAnuncio.getVeiculoInfo().setFotoReferenciaUrl(fotoUrl);
                savedAnuncio = anuncioRepository.salvar(savedAnuncio);
                log.info("Reference photo uploaded for intention {}", savedAnuncio.getId());
            } catch (Exception e) {
                log.warn("Failed to upload reference photo for intention {}: {}", savedAnuncio.getId(), e.getMessage());
                // Continue without photo - it's optional
            }
        }

        return savedAnuncio;
    }
}



