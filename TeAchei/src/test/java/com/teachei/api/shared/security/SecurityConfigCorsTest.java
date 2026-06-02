package com.teachei.api.shared.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Regression tests for P0.4 — CORS allowed origins. This is the test we were
 * missing on 2026-05-27 when prod returned 403 "Invalid CORS request" because
 * the deployed env did not satisfy the new conditional CORS code path.
 *
 * The default for {@code app.cors-origins} in application.yml now falls back
 * to {@code https://teachei.shop} when the env var is unset, so even a
 * misconfigured prod environment keeps the canonical origin allowed.
 */
@DisplayName("SecurityConfig.corsConfigurationSource (P0.4)")
class SecurityConfigCorsTest {

    @Test
    @DisplayName("prod com corsOrigins explícito: usa a lista da config, sem localhost")
    void prodWithExplicitOrigins() {
        List<String> patterns = patternsFor("prod", "https://teachei.shop");

        assertThat(patterns).containsExactly("https://teachei.shop");
    }

    @Test
    @DisplayName("prod com corsOrigins vazio: cai no fallback teachei.shop")
    void prodEmptyOriginsFallsBack() {
        List<String> patterns = patternsFor("prod", "");

        assertThat(patterns).containsExactly("https://teachei.shop");
    }

    @Test
    @DisplayName("default (não-prod) com corsOrigins vazio: só localhost")
    void devEmptyOriginsAddsLocalhostOnly() {
        List<String> patterns = patternsFor("default", "");

        assertThat(patterns)
            .doesNotContain("https://teachei.shop")
            .contains("http://localhost:*", "http://127.0.0.1:*");
    }

    @Test
    @DisplayName("default com corsOrigins explícito: combina config + localhost")
    void devCombinesConfigAndLocalhost() {
        List<String> patterns = patternsFor("default", "https://teachei.shop");

        assertThat(patterns).contains(
            "https://teachei.shop",
            "http://localhost:*",
            "http://127.0.0.1:*"
        );
    }

    @Test
    @DisplayName("corsOrigins múltiplos separados por vírgula: split + trim")
    void multipleOriginsSplit() {
        List<String> patterns = patternsFor("prod", "https://a.com, https://b.com ,https://c.com");

        assertThat(patterns).containsExactlyInAnyOrder(
            "https://a.com", "https://b.com", "https://c.com"
        );
    }

    @Test
    @DisplayName("prod ignora localhost mesmo se vier na config")
    void prodKeepsExplicitConfigVerbatim() {
        List<String> patterns = patternsFor("prod", "https://teachei.shop,http://localhost:3000");

        // A config explícita é respeitada (operadores podem querer testar prod
        // contra localhost), mas o caminho automático de localhost só roda
        // fora de prod.
        assertThat(patterns).containsExactlyInAnyOrder(
            "https://teachei.shop", "http://localhost:3000"
        );
    }

    // ---- helper ----

    private List<String> patternsFor(String activeProfile, String corsOrigins) {
        SecurityConfig config = new SecurityConfig(null, null);
        ReflectionTestUtils.setField(config, "activeProfile", activeProfile);
        ReflectionTestUtils.setField(config, "corsOrigins", corsOrigins);

        UrlBasedCorsConfigurationSource source =
            (UrlBasedCorsConfigurationSource) config.corsConfigurationSource();
        CorsConfiguration cors = source.getCorsConfigurations().get("/**");
        assertThat(cors).as("CorsConfiguration registered under /**").isNotNull();
        return cors.getAllowedOriginPatterns();
    }
}
