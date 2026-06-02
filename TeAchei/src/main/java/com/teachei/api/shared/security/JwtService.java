package com.teachei.api.shared.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class JwtService {

    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final long expirationHours;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-hours}") long expirationHours) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.verifier = JWT.require(algorithm)
            .withIssuer("teachei-api")
            .build();
        this.expirationHours = expirationHours;
    }

    public String generateToken(String userId, String email) {
        Instant now = Instant.now();
        Instant expiry = now.plus(expirationHours, ChronoUnit.HOURS);

        return JWT.create()
            .withIssuer("teachei-api")
            .withSubject(userId)
            .withClaim("email", email)
            .withIssuedAt(now)
            .withExpiresAt(expiry)
            .sign(algorithm);
    }

    public DecodedJWT validateToken(String token) {
        try {
            return verifier.verify(token);
        } catch (JWTVerificationException e) {
            return null;
        }
    }

    public String getUserId(DecodedJWT jwt) {
        return jwt.getSubject();
    }

    public String getEmail(DecodedJWT jwt) {
        return jwt.getClaim("email").asString();
    }

    public long getExpirationMillis() {
        return expirationHours * 60 * 60 * 1000;
    }
}


