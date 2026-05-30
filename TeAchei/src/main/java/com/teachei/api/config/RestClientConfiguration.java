package com.teachei.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;

/**
 * HTTP client configuration for synchronous outbound calls (FIPE, Google).
 * Replaces the previous reactive WebClient setup — RestClient runs on the
 * JDK HttpClient and removes the dependency on Reactor/Netty.
 */
@Configuration
public class RestClientConfiguration {

    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(5);
    private static final Duration READ_TIMEOUT = Duration.ofSeconds(10);

    @Bean
    public RestClient.Builder restClientBuilder() {
        HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(CONNECT_TIMEOUT)
            .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(READ_TIMEOUT);

        return RestClient.builder().requestFactory(requestFactory);
    }
}
