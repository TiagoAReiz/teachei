package com.teachei.api.adapter.in.web.dto.response;

import com.teachei.api.domain.model.Anuncio;
import com.teachei.api.domain.model.StatusAnuncio;
import com.teachei.api.domain.model.TipoVeiculo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record AnuncioResponse(
    String id,
    String usuarioId,
    TipoVeiculo tipo,
    StatusAnuncio status,
    VeiculoResponse veiculo,
    ContatoResponse contato,
    String observacoes,
    LocalDateTime criadoEm,
    LocalDateTime expiraEm,
    boolean contatoOculto,
    boolean assinaturaAtiva
) {
    /**
     * Creates response with full contact info visible (for owners or subscribers).
     */
    public static AnuncioResponse fromDomain(Anuncio anuncio) {
        return fromDomain(anuncio, false, true);
    }

    /**
     * Creates response with contact visibility based on subscription status.
     * 
     * @param anuncio the intention
     * @param ocultarContato whether to hide contact info (true for non-subscribers viewing others' intentions)
     * @param assinaturaAtiva whether the requesting user has an active subscription
     */
    public static AnuncioResponse fromDomain(Anuncio anuncio, boolean ocultarContato, boolean assinaturaAtiva) {
        ContatoResponse contato;
        if (ocultarContato) {
            // Show only location for non-subscribers
            contato = ContatoResponse.apenasLocalizacao(anuncio.getContatoInfo());
        } else {
            contato = ContatoResponse.from(anuncio.getContatoInfo());
        }

        return new AnuncioResponse(
            anuncio.getId(),
            anuncio.getUsuarioId().toString(),
            anuncio.getTipo(),
            anuncio.getStatus(),
            VeiculoResponse.from(anuncio.getVeiculoInfo()),
            contato,
            anuncio.getObservacoes(),
            anuncio.getCriadoEm(),
            anuncio.getExpiraEm(),
            ocultarContato,
            assinaturaAtiva
        );
    }

    public record VeiculoResponse(
        String marcaCodigo,
        String marcaNome,
        String modeloCodigo,
        String modeloNome,
        String modeloBaseNome,
        List<VersaoResponse> versoes,
        boolean todasVersoes,
        List<Integer> anos,
        List<String> cores,
        BigDecimal precoMaximo,
        BigDecimal precoFipeReferencia,
        Integer quilometragemMinima,
        Integer quilometragemMaxima,
        List<String> opcionais,
        boolean dadosManuais,
        String fotoReferenciaUrl
    ) {
        public static VeiculoResponse from(com.teachei.api.domain.model.VeiculoInfo info) {
            if (info == null) return null;
            List<VersaoResponse> versoes = info.getVersoes() != null 
                ? info.getVersoes().stream().map(VersaoResponse::from).toList()
                : List.of();
            return new VeiculoResponse(
                info.getMarcaCodigo(),
                info.getMarcaNome(),
                info.getModeloCodigo(),
                info.getModeloNome(),
                info.getModeloBaseNome(),
                versoes,
                info.isTodasVersoes(),
                info.getAnos(),
                info.getCores(),
                info.getPrecoMaximo(),
                info.getPrecoFipeReferencia(),
                info.getQuilometragemMinima(),
                info.getQuilometragemMaxima(),
                info.getOpcionais(),
                info.isDadosManuais(),
                info.getFotoReferenciaUrl()
            );
        }
    }

    public record VersaoResponse(
        String codigo,
        String nome
    ) {
        public static VersaoResponse from(com.teachei.api.domain.model.VersaoInfo info) {
            if (info == null) return null;
            return new VersaoResponse(info.getCodigo(), info.getNome());
        }
    }

    public record ContatoResponse(
        String whatsapp,
        String whatsappLink,
        String instagram,
        String cidade,
        String estado,
        String localizacao
    ) {
        public static ContatoResponse from(com.teachei.api.domain.model.ContatoInfo info) {
            if (info == null) return null;
            return new ContatoResponse(
                info.getWhatsapp(),
                info.getWhatsappLink(),
                info.getInstagram(),
                info.getCidade(),
                info.getEstado(),
                info.getLocalizacao()
            );
        }

        /**
         * Creates a response with only location visible (for non-subscribers).
         */
        public static ContatoResponse apenasLocalizacao(com.teachei.api.domain.model.ContatoInfo info) {
            if (info == null) return null;
            return new ContatoResponse(
                null,  // whatsapp hidden
                null,  // whatsappLink hidden
                null,  // instagram hidden
                info.getCidade(),
                info.getEstado(),
                info.getLocalizacao()
            );
        }
    }
}



