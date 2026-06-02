package com.teachei.api.usuario.application.ports.out;

import java.util.Optional;

/**
 * Port for Google OAuth operations.
 */
public interface GoogleAuthPort {

    /**
     * Verifies a Google access token and retrieves user info.
     *
     * @param accessToken the Google access token
     * @return user info if token is valid, empty if invalid
     */
    Optional<GoogleUserInfo> verifyToken(String accessToken);

    /**
     * User info from Google.
     */
    record GoogleUserInfo(
        String sub,      // Google user ID
        String email,
        String name,
        String picture,
        boolean emailVerified
    ) {}
}
