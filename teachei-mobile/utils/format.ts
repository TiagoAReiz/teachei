// Format currency in Brazilian Real
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Format currency for display (e.g., "R$ 110k")
export function formatCurrencyShort(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${Math.round(value / 1000)}k`;
  }
  return formatCurrency(value);
}

// Format price range
export function formatPriceRange(min?: number, max?: number): string {
  if (min && max) {
    return `${formatCurrencyShort(min)} - ${formatCurrencyShort(max)}`;
  }
  if (max) {
    return `Até ${formatCurrencyShort(max)}`;
  }
  if (min) {
    return `A partir de ${formatCurrencyShort(min)}`;
  }
  return "A combinar";
}

// Format relative time (e.g., "2h atrás", "1d atrás")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "Agora";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}min atrás`;
  }
  if (diffHours < 24) {
    return `${diffHours}h atrás`;
  }
  if (diffDays === 1) {
    return "Ontem";
  }
  if (diffDays < 7) {
    return `${diffDays}d atrás`;
  }
  
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Format year range
export function formatYearRange(min?: number, max?: number): string {
  if (min && max) {
    if (min === max) {
      return `${min}`;
    }
    return `${min} - ${max}`;
  }
  if (max) {
    return `Até ${max}`;
  }
  if (min) {
    return `${min}+`;
  }
  return "Qualquer ano";
}

// Format phone number for WhatsApp link
export function formatWhatsAppLink(phone: string, message?: string): string {
  // Remove non-numeric characters
  const cleanPhone = phone.replace(/\D/g, "");
  // Add country code if not present
  const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${fullPhone}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

// Format mileage
export function formatMileage(km: number): string {
  return `${km.toLocaleString("pt-BR")} km`;
}

// Format mileage range
export function formatMileageRange(min?: number, max?: number): string | null {
  if (min && max) {
    return `${formatMileage(min)} - ${formatMileage(max)}`;
  }
  if (min) {
    return `A partir de ${formatMileage(min)}`;
  }
  if (max) {
    return `Até ${formatMileage(max)}`;
  }
  return null;
}



