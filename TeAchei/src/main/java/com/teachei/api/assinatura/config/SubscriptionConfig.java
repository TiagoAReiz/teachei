package com.teachei.api.assinatura.config;

import com.teachei.api.assinatura.domain.PlanoAssinatura;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Configuration for subscription plans.
 * Prices are in centavos (1500 = R$15.00).
 */
@Configuration
@ConfigurationProperties(prefix = "subscription")
public class SubscriptionConfig {

    private Map<String, PlanConfig> plans = new HashMap<>();

    public Map<String, PlanConfig> getPlans() {
        return plans;
    }

    public void setPlans(Map<String, PlanConfig> plans) {
        this.plans = plans;
    }

    /**
     * Get price for a specific plan in centavos.
     */
    public int getPriceForPlan(PlanoAssinatura plano) {
        String key = plano.name().toLowerCase();
        if (key.equals("trimestral")) {
            key = "quarterly";
        } else if (key.equals("anual")) {
            key = "annual";
        }
        
        PlanConfig config = plans.get(key);
        return config != null ? config.getPrice() : getDefaultPrice(plano);
    }

    /**
     * Get price as BigDecimal in reais (for payment processing).
     */
    public BigDecimal getPriceAsDecimal(PlanoAssinatura plano) {
        return BigDecimal.valueOf(getPriceForPlan(plano)).divide(BigDecimal.valueOf(100));
    }

    private int getDefaultPrice(PlanoAssinatura plano) {
        return switch (plano) {
            case INDIVIDUAL -> 1500;
            case TRIMESTRAL -> 3000;
            case ANUAL -> 9000;
        };
    }

    public static class PlanConfig {
        private int price;
        private int durationDays;
        private boolean recurring;

        public int getPrice() {
            return price;
        }

        public void setPrice(int price) {
            this.price = price;
        }

        public int getDurationDays() {
            return durationDays;
        }

        public void setDurationDays(int durationDays) {
            this.durationDays = durationDays;
        }

        public boolean isRecurring() {
            return recurring;
        }

        public void setRecurring(boolean recurring) {
            this.recurring = recurring;
        }
    }
}
