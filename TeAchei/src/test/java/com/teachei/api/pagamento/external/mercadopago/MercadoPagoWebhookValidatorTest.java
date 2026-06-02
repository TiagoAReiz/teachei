package com.teachei.api.pagamento.external.mercadopago;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Regression tests for P0.5 — webhook HMAC contract.
 * The comparison must reject mismatches; correctness is the contract we lock
 * in here (timing-safety via {@code MessageDigest.isEqual} is the implementation
 * choice and not directly observable from a unit test).
 */
@DisplayName("MercadoPagoWebhookValidator - assinatura HMAC (P0.5)")
class MercadoPagoWebhookValidatorTest {

    private static final String SECRET = "test-webhook-secret";
    private static final String DATA_ID = "12345";
    private static final String REQUEST_ID = "req-abc";
    private static final String TS = "1700000000";

    private MercadoPagoWebhookValidator validator;

    @BeforeEach
    void setUp() {
        validator = new MercadoPagoWebhookValidator();
        ReflectionTestUtils.setField(validator, "webhookSecret", SECRET);
        ReflectionTestUtils.setField(validator, "activeProfile", "prod");
    }

    @Test
    @DisplayName("assinatura válida: aceita")
    void validSignatureIsAccepted() {
        String manifest = "id:" + DATA_ID + ";request-id:" + REQUEST_ID + ";ts:" + TS + ";";
        String v1 = hmacSha256Hex(SECRET, manifest);

        boolean result = validator.validateSignature(
            "ts=" + TS + ",v1=" + v1, REQUEST_ID, DATA_ID);

        assertThat(result).isTrue();
    }

    @Test
    @DisplayName("assinatura inválida (v1 trocado): rejeita")
    void wrongSignatureIsRejected() {
        boolean result = validator.validateSignature(
            "ts=" + TS + ",v1=deadbeef", REQUEST_ID, DATA_ID);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("header x-signature sem v1: rejeita")
    void missingV1IsRejected() {
        boolean result = validator.validateSignature("ts=" + TS, REQUEST_ID, DATA_ID);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("header x-signature ausente: rejeita")
    void missingHeaderIsRejected() {
        assertThat(validator.validateSignature(null, REQUEST_ID, DATA_ID)).isFalse();
        assertThat(validator.validateSignature("", REQUEST_ID, DATA_ID)).isFalse();
    }

    @Test
    @DisplayName("produção sem secret configurado: rejeita por segurança")
    void prodWithoutSecretRejects() {
        ReflectionTestUtils.setField(validator, "webhookSecret", "");

        boolean result = validator.validateSignature("ts=" + TS + ",v1=anything",
            REQUEST_ID, DATA_ID);

        assertThat(result).isFalse();
    }

    // ---- helper ----

    private static String hmacSha256Hex(String secret, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(raw.length * 2);
            for (byte b : raw) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) hex.append('0');
                hex.append(h);
            }
            return hex.toString();
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
