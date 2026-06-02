package com.teachei.api.veiculo.external.fipe;

import com.teachei.api.veiculo.application.ports.out.VeiculoDataPort;
import com.teachei.api.domain.exception.ServicoIndisponivelException;
import com.teachei.api.domain.model.TipoVeiculo;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class FipeAdapter implements VeiculoDataPort {

    private static final Logger log = LoggerFactory.getLogger(FipeAdapter.class);
    private static final String FIPE_CB = "fipe";

    private final FipeClient fipeClient;

    public FipeAdapter(FipeClient fipeClient) {
        this.fipeClient = fipeClient;
    }

    @Override
    @CircuitBreaker(name = FIPE_CB, fallbackMethod = "getMarcasFallback")
    public List<Marca> getMarcas(TipoVeiculo tipo) {
        return fipeClient.getMarcas(tipo).stream()
            .map(r -> new Marca(r.codigo(), r.nome()))
            .toList();
    }

    @Override
    @CircuitBreaker(name = FIPE_CB, fallbackMethod = "getModelosFallback")
    public List<Modelo> getModelos(TipoVeiculo tipo, String marcaCodigo) {
        var response = fipeClient.getModelos(tipo, marcaCodigo);
        return response.modelos().stream()
            .map(m -> new Modelo(String.valueOf(m.codigo()), m.nome()))
            .toList();
    }

    @Override
    @CircuitBreaker(name = FIPE_CB, fallbackMethod = "getAnosFallback")
    public List<Ano> getAnos(TipoVeiculo tipo, String marcaCodigo, String modeloCodigo) {
        return fipeClient.getAnos(tipo, marcaCodigo, modeloCodigo).stream()
            .map(a -> new Ano(a.codigo(), a.nome()))
            .toList();
    }

    @Override
    @CircuitBreaker(name = FIPE_CB, fallbackMethod = "getPrecoFipeFallback")
    public PrecoFipe getPrecoFipe(TipoVeiculo tipo, String marcaCodigo, 
                                   String modeloCodigo, String anoCodigo) {
        var response = fipeClient.getPreco(tipo, marcaCodigo, modeloCodigo, anoCodigo);
        
        // Parse price (format: "R$ 120.000,00")
        BigDecimal valor = parsePreco(response.Valor());

        return new PrecoFipe(
            valor,
            response.Marca(),
            response.Modelo(),
            response.AnoModelo(),
            response.Combustivel(),
            response.CodigoFipe(),
            response.MesReferencia()
        );
    }

    private BigDecimal parsePreco(String valorStr) {
        if (valorStr == null || valorStr.isBlank()) {
            return BigDecimal.ZERO;
        }
        // Remove "R$ " and format from "120.000,00" to "120000.00"
        String cleaned = valorStr
            .replace("R$ ", "")
            .replace(".", "")
            .replace(",", ".");
        try {
            return new BigDecimal(cleaned);
        } catch (NumberFormatException e) {
            log.warn("Failed to parse FIPE price: {}", valorStr);
            return BigDecimal.ZERO;
        }
    }

    // Fallback methods - all throw ServicoIndisponivelException for proper error feedback
    @SuppressWarnings("unused")
    private List<Marca> getMarcasFallback(TipoVeiculo tipo, Throwable t) {
        log.error("FIPE API unavailable for getMarcas (tipo={}): {}", tipo, t.getMessage());
        throw new ServicoIndisponivelException("FIPE API", t);
    }

    @SuppressWarnings("unused")
    private List<Modelo> getModelosFallback(TipoVeiculo tipo, String marcaCodigo, Throwable t) {
        log.error("FIPE API unavailable for getModelos (tipo={}, marca={}): {}", 
            tipo, marcaCodigo, t.getMessage());
        throw new ServicoIndisponivelException("FIPE API", t);
    }

    @SuppressWarnings("unused")
    private List<Ano> getAnosFallback(TipoVeiculo tipo, String marcaCodigo, 
                                       String modeloCodigo, Throwable t) {
        log.error("FIPE API unavailable for getAnos (tipo={}, marca={}, modelo={}): {}", 
            tipo, marcaCodigo, modeloCodigo, t.getMessage());
        throw new ServicoIndisponivelException("FIPE API", t);
    }

    @SuppressWarnings("unused")
    private PrecoFipe getPrecoFipeFallback(TipoVeiculo tipo, String marcaCodigo, 
                                            String modeloCodigo, String anoCodigo, Throwable t) {
        log.error("FIPE API unavailable for getPrecoFipe (tipo={}, marca={}, modelo={}, ano={}): {}", 
            tipo, marcaCodigo, modeloCodigo, anoCodigo, t.getMessage());
        throw new ServicoIndisponivelException("FIPE API", t);
    }
}



