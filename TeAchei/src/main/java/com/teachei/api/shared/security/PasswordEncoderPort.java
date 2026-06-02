package com.teachei.api.shared.security;

/**
 * Outbound port for password encoding.
 */
public interface PasswordEncoderPort {

    /**
     * Encodes a raw password.
     *
     * @param rawPassword the raw password
     * @return the encoded password
     */
    String encode(String rawPassword);

    /**
     * Checks if a raw password matches an encoded password.
     *
     * @param rawPassword the raw password
     * @param encodedPassword the encoded password
     * @return true if matches
     */
    boolean matches(String rawPassword, String encodedPassword);
}



