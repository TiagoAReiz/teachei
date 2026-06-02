package com.teachei.api.veiculo.external.fipe;

import com.teachei.api.veiculo.domain.exception.FipeApiException;
import com.teachei.api.shared.domain.TipoVeiculo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class FipeClient {

    private static final Logger log = LoggerFactory.getLogger(FipeClient.class);

    private final RestClient restClient;

    public FipeClient(@Value("${fipe.base-url}") String baseUrl, RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
            .baseUrl(baseUrl)
            .build();
    }

    @Cacheable(value = "fipe-marcas", key = "#tipo.name()")
    public List<FipeMarcaResponse> getMarcas(TipoVeiculo tipo) {
        log.debug("FIPE API: GET /{}/marcas", tipo.getFipeEndpoint());

        return restClient.get()
            .uri("/{tipo}/marcas", tipo.getFipeEndpoint())
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (req, resp) -> {
                throw new FipeApiException("Erro de cliente na API FIPE", resp.getStatusCode());
            })
            .onStatus(HttpStatusCode::is5xxServerError, (req, resp) -> {
                throw new FipeApiException("Erro no servidor da API FIPE", resp.getStatusCode());
            })
            .body(new ParameterizedTypeReference<List<FipeMarcaResponse>>() {});
    }

    @Cacheable(value = "fipe-modelos", key = "#tipo.name() + '-' + #marcaCodigo")
    public FipeModelosResponse getModelos(TipoVeiculo tipo, String marcaCodigo) {
        log.debug("FIPE API: GET /{}/marcas/{}/modelos", tipo.getFipeEndpoint(), marcaCodigo);

        return restClient.get()
            .uri("/{tipo}/marcas/{marca}/modelos", tipo.getFipeEndpoint(), marcaCodigo)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (req, resp) -> {
                throw new FipeApiException("Erro de cliente na API FIPE", resp.getStatusCode());
            })
            .onStatus(HttpStatusCode::is5xxServerError, (req, resp) -> {
                throw new FipeApiException("Erro no servidor da API FIPE", resp.getStatusCode());
            })
            .body(FipeModelosResponse.class);
    }

    @Cacheable(value = "fipe-anos", key = "#tipo.name() + '-' + #marcaCodigo + '-' + #modeloCodigo")
    public List<FipeAnoResponse> getAnos(TipoVeiculo tipo, String marcaCodigo, String modeloCodigo) {
        log.debug("FIPE API: GET /{}/marcas/{}/modelos/{}/anos",
            tipo.getFipeEndpoint(), marcaCodigo, modeloCodigo);

        return restClient.get()
            .uri("/{tipo}/marcas/{marca}/modelos/{modelo}/anos",
                tipo.getFipeEndpoint(), marcaCodigo, modeloCodigo)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (req, resp) -> {
                throw new FipeApiException("Erro de cliente na API FIPE", resp.getStatusCode());
            })
            .onStatus(HttpStatusCode::is5xxServerError, (req, resp) -> {
                throw new FipeApiException("Erro no servidor da API FIPE", resp.getStatusCode());
            })
            .body(new ParameterizedTypeReference<List<FipeAnoResponse>>() {});
    }

    @Cacheable(value = "fipe-preco", key = "#tipo.name() + '-' + #marcaCodigo + '-' + #modeloCodigo + '-' + #anoCodigo")
    public FipePrecoResponse getPreco(TipoVeiculo tipo, String marcaCodigo,
                                       String modeloCodigo, String anoCodigo) {
        log.debug("FIPE API: GET /{}/marcas/{}/modelos/{}/anos/{}",
            tipo.getFipeEndpoint(), marcaCodigo, modeloCodigo, anoCodigo);

        return restClient.get()
            .uri("/{tipo}/marcas/{marca}/modelos/{modelo}/anos/{ano}",
                tipo.getFipeEndpoint(), marcaCodigo, modeloCodigo, anoCodigo)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, (req, resp) -> {
                throw new FipeApiException("Erro de cliente na API FIPE", resp.getStatusCode());
            })
            .onStatus(HttpStatusCode::is5xxServerError, (req, resp) -> {
                throw new FipeApiException("Erro no servidor da API FIPE", resp.getStatusCode());
            })
            .body(FipePrecoResponse.class);
    }

    // Response DTOs
    public record FipeMarcaResponse(String codigo, String nome) {}

    public record FipeModelosResponse(
        List<FipeModeloItem> modelos,
        List<FipeAnoResponse> anos
    ) {}

    public record FipeModeloItem(int codigo, String nome) {}

    public record FipeAnoResponse(String codigo, String nome) {}

    public record FipePrecoResponse(
        String Valor,
        String Marca,
        String Modelo,
        int AnoModelo,
        String Combustivel,
        String CodigoFipe,
        String MesReferencia,
        int TipoVeiculo,
        String SiglaCombustivel
    ) {}
}
