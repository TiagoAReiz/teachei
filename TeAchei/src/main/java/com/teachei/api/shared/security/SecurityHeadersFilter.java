package com.teachei.api.shared.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter that adds security headers to all HTTP responses.
 * These headers help prevent common web vulnerabilities like XSS, clickjacking, and MIME sniffing.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 1)
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Prevent MIME type sniffing
        response.setHeader("X-Content-Type-Options", "nosniff");
        
        // Prevent clickjacking
        response.setHeader("X-Frame-Options", "DENY");
        
        // XSS protection (legacy browsers)
        response.setHeader("X-XSS-Protection", "1; mode=block");
        
        // Referrer policy
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // Permissions policy (restrict browser features)
        response.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
        
        // HSTS - only in production with HTTPS
        if ("prod".equals(activeProfile) || "production".equals(activeProfile)) {
            response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        }
        
        filterChain.doFilter(request, response);
    }
}
