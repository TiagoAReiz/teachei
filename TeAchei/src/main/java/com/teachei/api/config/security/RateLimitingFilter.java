package com.teachei.api.config.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

/**
 * Rate limiting filter for authentication endpoints.
 * Prevents brute force attacks on login and registration.
 *
 * Per-IP buckets are kept in a size-bounded Caffeine cache so that a large
 * number of distinct (or spoofed) source IPs cannot exhaust heap. Buckets
 * that go inactive for {@link #BUCKET_TTL} are evicted; once evicted, the
 * next request from that IP gets a fresh bucket (no false lockout).
 *
 * X-Forwarded-For is only honored when {@code app.security.trust-proxy-headers}
 * is true (default true — assumes deployment behind a trusted ingress/proxy
 * such as Azure Container Apps). Set to false in environments where the app
 * receives traffic directly from the internet to prevent header spoofing
 * bypass.
 */
@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitingFilter.class);

    // Cache bounds: enough headroom for legitimate traffic, hard cap against DoS via spoofed IPs.
    private static final long MAX_BUCKETS = 10_000;
    private static final Duration BUCKET_TTL = Duration.ofHours(1);

    private static final int LOGIN_REQUESTS_PER_MINUTE = 5;
    private static final int REGISTER_REQUESTS_PER_HOUR = 3;

    private final Cache<String, Bucket> loginBuckets = Caffeine.newBuilder()
        .maximumSize(MAX_BUCKETS)
        .expireAfterAccess(BUCKET_TTL)
        .build();

    private final Cache<String, Bucket> registerBuckets = Caffeine.newBuilder()
        .maximumSize(MAX_BUCKETS)
        .expireAfterAccess(BUCKET_TTL)
        .build();

    @Value("${app.security.trust-proxy-headers:true}")
    private boolean trustProxyHeaders;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        if ("POST".equalsIgnoreCase(method)) {
            String clientIp = getClientIP(request);

            if (path.endsWith("/v1/auth/login")) {
                if (!tryConsume(loginBuckets, clientIp, this::createLoginBucket)) {
                    log.warn("Rate limit exceeded for login from IP: {}", clientIp);
                    sendRateLimitResponse(response, 60);
                    return;
                }
            } else if (path.endsWith("/v1/auth/registrar")) {
                if (!tryConsume(registerBuckets, clientIp, this::createRegisterBucket)) {
                    log.warn("Rate limit exceeded for registration from IP: {}", clientIp);
                    sendRateLimitResponse(response, 3600);
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean tryConsume(Cache<String, Bucket> buckets, String key,
                               java.util.function.Supplier<Bucket> bucketFactory) {
        Bucket bucket = buckets.get(key, k -> bucketFactory.get());
        return bucket != null && bucket.tryConsume(1);
    }

    private Bucket createLoginBucket() {
        Bandwidth limit = Bandwidth.classic(LOGIN_REQUESTS_PER_MINUTE,
                Refill.intervally(LOGIN_REQUESTS_PER_MINUTE, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createRegisterBucket() {
        Bandwidth limit = Bandwidth.classic(REGISTER_REQUESTS_PER_HOUR,
                Refill.intervally(REGISTER_REQUESTS_PER_HOUR, Duration.ofHours(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private void sendRateLimitResponse(HttpServletResponse response, int retryAfterSeconds) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        response.setContentType("application/json");
        response.getWriter().write("""
            {"status":429,"error":"Too Many Requests","message":"Muitas tentativas. Tente novamente mais tarde.","code":"RATE_LIMIT_EXCEEDED"}
            """);
    }

    private String getClientIP(HttpServletRequest request) {
        if (trustProxyHeaders) {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                return xForwardedFor.split(",")[0].trim();
            }
            String xRealIp = request.getHeader("X-Real-IP");
            if (xRealIp != null && !xRealIp.isEmpty()) {
                return xRealIp;
            }
        }
        return request.getRemoteAddr();
    }

    /**
     * Reset bucket for an IP after a successful login (optional optimization).
     */
    public void resetLoginBucket(String clientIp) {
        loginBuckets.invalidate(clientIp);
    }
}
