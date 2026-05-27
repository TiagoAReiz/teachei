package com.teachei.api.adapter.out.external.mercadopago;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Validates Mercado Pago webhook signatures using HMAC-SHA256.
 * 
 * According to Mercado Pago documentation, the x-signature header contains:
 * ts=timestamp,v1=hash
 * 
 * The manifest to verify is: "id:{data.id};request-id:{x-request-id};ts:{ts};"
 */
@Component
public class MercadoPagoWebhookValidator {

    private static final Logger log = LoggerFactory.getLogger(MercadoPagoWebhookValidator.class);
    private static final String HMAC_SHA256 = "HmacSHA256";

    @Value("${mercadopago.webhook-secret}")
    private String webhookSecret;

    /**
     * Validates the webhook signature from Mercado Pago.
     *
     * @param xSignature the x-signature header value
     * @param xRequestId the x-request-id header value
     * @param dataId the data.id from the webhook payload
     * @return true if signature is valid, false otherwise
     */
    @Value("${spring.profiles.active:default}")
    private String activeProfile;

    public boolean validateSignature(String xSignature, String xRequestId, String dataId) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            // In production, reject requests without a configured secret
            if ("prod".equals(activeProfile) || "production".equals(activeProfile)) {
                log.error("SECURITY: Webhook secret not configured in production! Rejecting request.");
                return false;
            }
            log.warn("Webhook secret not configured, skipping signature validation. " +
                     "Configure MERCADOPAGO_WEBHOOK_SECRET for production!");
            return true; // Allow in dev mode without secret
        }

        if (xSignature == null || xSignature.isBlank()) {
            log.warn("Missing x-signature header in webhook request");
            return false;
        }

        try {
            // Parse x-signature header: "ts=1234567890,v1=abc123..."
            Map<String, String> signatureParts = parseSignatureHeader(xSignature);
            String ts = signatureParts.get("ts");
            String v1 = signatureParts.get("v1");

            if (ts == null || v1 == null) {
                log.warn("Invalid x-signature format: missing ts or v1");
                return false;
            }

            // Build manifest: "id:{data.id};request-id:{x-request-id};ts:{ts};"
            String manifest = buildManifest(dataId, xRequestId, ts);

            // Calculate HMAC-SHA256
            String calculatedSignature = calculateHmac(manifest, webhookSecret);

            // Compare signatures using constant-time comparison to prevent timing attacks
            boolean isValid = java.security.MessageDigest.isEqual(
                calculatedSignature.getBytes(StandardCharsets.UTF_8),
                v1.getBytes(StandardCharsets.UTF_8));
            
            if (!isValid) {
                log.warn("Webhook signature validation failed. Expected: {}, Got: {}", 
                         v1, calculatedSignature);
            }

            return isValid;

        } catch (Exception e) {
            log.error("Error validating webhook signature", e);
            return false;
        }
    }

    /**
     * Parses the x-signature header into its components.
     * Format: "ts=1234567890,v1=abc123def456..."
     */
    private Map<String, String> parseSignatureHeader(String xSignature) {
        Map<String, String> parts = new HashMap<>();
        
        for (String part : xSignature.split(",")) {
            String[] keyValue = part.split("=", 2);
            if (keyValue.length == 2) {
                parts.put(keyValue[0].trim(), keyValue[1].trim());
            }
        }
        
        return parts;
    }

    /**
     * Builds the manifest string for signature verification.
     * Format: "id:{data.id};request-id:{x-request-id};ts:{ts};"
     */
    private String buildManifest(String dataId, String xRequestId, String ts) {
        StringBuilder manifest = new StringBuilder();
        
        // Only include id if present
        if (dataId != null && !dataId.isBlank()) {
            manifest.append("id:").append(dataId).append(";");
        }
        
        // Only include request-id if present
        if (xRequestId != null && !xRequestId.isBlank()) {
            manifest.append("request-id:").append(xRequestId).append(";");
        }
        
        // Always include timestamp
        manifest.append("ts:").append(ts).append(";");
        
        return manifest.toString();
    }

    /**
     * Calculates HMAC-SHA256 hash.
     */
    private String calculateHmac(String data, String secret) throws Exception {
        Mac mac = Mac.getInstance(HMAC_SHA256);
        SecretKeySpec secretKeySpec = new SecretKeySpec(
            secret.getBytes(StandardCharsets.UTF_8), 
            HMAC_SHA256
        );
        mac.init(secretKeySpec);
        
        byte[] hmacBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        
        // Convert to hex string
        StringBuilder hexString = new StringBuilder();
        for (byte b : hmacBytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        
        return hexString.toString();
    }

    /**
     * Checks if webhook validation is enabled (secret is configured).
     */
    public boolean isValidationEnabled() {
        return webhookSecret != null && !webhookSecret.isBlank();
    }
}
