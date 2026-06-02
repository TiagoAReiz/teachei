package com.teachei.api.anuncio.application.usecase;

import com.teachei.api.anuncio.application.ports.in.AtualizarAnuncioUseCase;
import com.teachei.api.anuncio.application.ports.out.AnuncioRepositoryPort;
import com.teachei.api.shared.storage.BlobStoragePort;
import com.teachei.api.shared.domain.exception.AcessoNegadoException;
import com.teachei.api.anuncio.domain.exception.AnuncioNaoEncontradoException;
import com.teachei.api.anuncio.domain.model.Anuncio;
import com.teachei.api.anuncio.domain.model.OpcionalVeiculo;
import com.teachei.api.anuncio.domain.model.VersaoInfo;
import com.teachei.api.anuncio.domain.service.AnuncioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;

/**
 * Implementation of the update intention use case.
 */
public class AtualizarAnuncioUseCaseImpl implements AtualizarAnuncioUseCase {

    private static final Logger log = LoggerFactory.getLogger(AtualizarAnuncioUseCaseImpl.class);

    private final AnuncioRepositoryPort anuncioRepository;
    private final AnuncioService anuncioService;
    private final BlobStoragePort blobStorage;

    public AtualizarAnuncioUseCaseImpl(AnuncioRepositoryPort anuncioRepository,
                                        AnuncioService anuncioService,
                                        BlobStoragePort blobStorage) {
        this.anuncioRepository = anuncioRepository;
        this.anuncioService = anuncioService;
        this.blobStorage = blobStorage;
    }

    @Override
    public Anuncio executar(UUID usuarioId, String anuncioId, AtualizarAnuncioCommand command) {
        Anuncio anuncio = anuncioRepository.buscarPorId(anuncioId)
            .orElseThrow(() -> new AnuncioNaoEncontradoException(anuncioId));

        // Check ownership
        if (!anuncio.getUsuarioId().equals(usuarioId)) {
            throw new AcessoNegadoException("Você não pode editar este anúncio");
        }

        // Convert optionals from String to OpcionalVeiculo and validate
        List<OpcionalVeiculo> opcionaisEnum = command.opcionais() != null
            ? command.opcionais().stream()
                .map(OpcionalVeiculo::valueOf)
                .toList()
            : List.of();
        anuncioService.validarOpcionaisCompativeis(opcionaisEnum, anuncio.getTipo());

        // Map version commands to domain objects
        List<VersaoInfo> versoes = command.versoes() != null
            ? command.versoes().stream()
                .map(v -> new VersaoInfo(v.codigo(), v.nome()))
                .toList()
            : List.of();

        // Update vehicle info (brand/model remain unchanged)
        anuncio.getVeiculoInfo().atualizar(
            versoes,
            command.todasVersoes(),
            command.anos(),
            command.cores(),
            command.precoMaximo(),
            command.quilometragemMinima(),
            command.quilometragemMaxima(),
            command.opcionais()
        );

        // Update observations
        anuncio.setObservacoes(command.observacoes());

        // Update location in contact info
        if (command.cidade() != null) {
            anuncio.getContatoInfo().setCidade(command.cidade());
        }
        if (command.estado() != null) {
            anuncio.getContatoInfo().setEstado(command.estado());
        }

        // Handle reference photo update
        if (command.fotoReferenciaBase64() != null && !command.fotoReferenciaBase64().isEmpty()) {
            try {
                // Delete old photo if exists
                if (anuncio.getVeiculoInfo().getFotoReferenciaUrl() != null) {
                    blobStorage.deleteIntentionPhoto(anuncioId);
                }
                // Upload new photo
                String fotoUrl = blobStorage.uploadIntentionPhoto(anuncioId, command.fotoReferenciaBase64());
                anuncio.getVeiculoInfo().setFotoReferenciaUrl(fotoUrl);
            } catch (Exception e) {
                log.warn("Failed to upload reference photo for intention {}: {}", anuncioId, e.getMessage());
                // Continue without photo update
            }
        }

        return anuncioRepository.salvar(anuncio);
    }
}
