package com.teachei.api.pagamento.persistence.mapper;

import com.teachei.api.pagamento.persistence.entity.TransacaoPagamentoEntity;
import com.teachei.api.pagamento.application.ports.out.TransacaoRepositoryPort;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TransacaoMapper {

    default TransacaoRepositoryPort.Transacao toDomain(TransacaoPagamentoEntity entity) {
        if (entity == null) {
            return null;
        }
        return new TransacaoRepositoryPort.Transacao(
            entity.getId(),
            entity.getPaymentId(),
            entity.getUsuarioId(),
            entity.getAnuncioId(),
            entity.getValor(),
            entity.getMetodoPagamento(),
            entity.getStatus(),
            entity.getCriadoEm(),
            entity.getAtualizadoEm()
        );
    }

    default TransacaoPagamentoEntity toEntity(TransacaoRepositoryPort.Transacao domain) {
        if (domain == null) {
            return null;
        }
        TransacaoPagamentoEntity entity = new TransacaoPagamentoEntity();
        entity.setId(domain.id());
        entity.setPaymentId(domain.paymentId());
        entity.setUsuarioId(domain.usuarioId());
        entity.setAnuncioId(domain.anuncioId());
        entity.setValor(domain.valor());
        entity.setMetodoPagamento(domain.metodoPagamento());
        entity.setStatus(domain.status());
        entity.setCriadoEm(domain.criadoEm());
        entity.setAtualizadoEm(domain.atualizadoEm());
        return entity;
    }
}



