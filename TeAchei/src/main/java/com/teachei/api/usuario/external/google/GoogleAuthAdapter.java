package com.teachei.api.usuario.external.google;

import com.teachei.api.usuario.application.ports.out.GoogleAuthPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Optional;

/**
 * Adapter for Google OAuth operations.
 * Verifies access tokens by calling Google's userinfo endpoint.
 */
@Component
public class GoogleAuthAdapter implements GoogleAuthPort {

    private static final Logger log = LoggerFactory.getLogger(GoogleAuthAdapter.class);
    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final RestClient restClient;

    public GoogleAuthAdapter(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder
            .baseUrl(GOOGLE_USERINFO_URL)
            .build();
    }

    @Override
    public Optional<GoogleUserInfo> verifyToken(String accessToken) {
        try {
            GoogleUserInfoResponse response = restClient.get()
                .header("Authorization", "Bearer " + accessToken)
                .retrieve()
                .body(GoogleUserInfoResponse.class);

            if (response == null || response.email() == null) {
                log.warn("Invalid Google token - no user info returned");
                return Optional.empty();
            }

            return Optional.of(new GoogleUserInfo(
                response.sub(),
                response.email(),
                response.name(),
                response.picture(),
                response.email_verified() != null && response.email_verified()
            ));
        } catch (RestClientResponseException e) {
            log.warn("Failed to verify Google token: {} - {}", e.getStatusCode(), e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error verifying Google token", e);
            return Optional.empty();
        }
    }

    /**
     * Response from Google's userinfo endpoint.
     */
    private record GoogleUserInfoResponse(
        String sub,
        String email,
        String name,
        String picture,
        Boolean email_verified
    ) {}
}
