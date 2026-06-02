package com.teachei.api.assinatura.domain;

/**
 * Status of a seller subscription.
 */
public enum StatusAssinatura {
    PENDENTE,    // Payment pending
    ATIVO,       // Active subscription
    EXPIRADO,    // Subscription expired
    CANCELADO    // Cancelled by user
}
