package com.teachei.api.pagamento.persistence;

import com.teachei.api.pagamento.persistence.mapper.TransacaoMapper;
import com.teachei.api.pagamento.persistence.repository.TransacaoJpaRepository;
import com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class TransacaoJpaAdapter implements TransacaoRepositoryPort {

    private final TransacaoJpaRepository repository;
    private final TransacaoMapper mapper;

    public TransacaoJpaAdapter(TransacaoJpaRepository repository, TransacaoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public Transacao salvar(Transacao transacao) {
        var entity = mapper.toEntity(transacao);
        var saved = repository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Transacao> buscarPorPaymentId(Long paymentId) {
        return repository.findByPaymentId(paymentId)
            .map(mapper::toDomain);
    }

    @Override
    public Optional<Transacao> buscarPorAnuncioId(String anuncioId) {
        return repository.findByAnuncioId(anuncioId)
            .map(mapper::toDomain);
    }

    @Override
    public List<Transacao> buscarPorUsuarioId(UUID usuarioId) {
        return repository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId)
            .stream()
            .map(mapper::toDomain)
            .toList();
    }
}



