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

/**
 * Format phone number as user types (Brazilian format)
 * Input: raw digits or partial input
 * Output: formatted as +55 (XX) XXXXX-XXXX with visual separators
 */
export function formatBrazilianPhoneInput(value: string): string {
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, "");
  
  // Handle if starts with 55, remove it (we'll add it back formatted)
  let digits = digitsOnly;
  if (digits.startsWith("55") && digits.length > 2) {
    digits = digits.slice(2);
  }
  
  // Limit to 11 digits (DDD + 9 digit number)
  const limitedDigits = digits.slice(0, 11);
  
  // Build formatted string with visual separators
  if (limitedDigits.length === 0) {
    return ""; // Empty field - no automatic prefix
  } else if (limitedDigits.length <= 2) {
    // Just DDD: +55 (XX
    return `+55 (${limitedDigits}`;
  } else if (limitedDigits.length <= 7) {
    // DDD + partial number: +55 (XX) XXXXX
    const ddd = limitedDigits.slice(0, 2);
    const number = limitedDigits.slice(2);
    return `+55 (${ddd}) ${number}`;
  } else {
    // Full number: +55 (XX) XXXXX-XXXX
    const ddd = limitedDigits.slice(0, 2);
    const firstPart = limitedDigits.slice(2, 7);
    const secondPart = limitedDigits.slice(7);
    return `+55 (${ddd}) ${firstPart}-${secondPart}`;
  }
}

/**
 * Strip formatting from phone number (for saving to backend)
 * Input: +55 (11) 99999-8888
 * Output: +5511999998888
 */
export function stripPhoneFormatting(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits.startsWith("55")) {
    return `+55${digits}`;
  }
  return `+${digits}`;
}

// Brazilian phone validation regex
const BRAZILIAN_PHONE_REGEX = /^\+55[1-9][0-9]9[0-9]{8}$/;

/**
 * Validate if a phone number is a valid Brazilian mobile number
 * Accepts both formatted (+55 (11) 99999-8888) and unformatted (+5511999998888) formats
 */
export function isValidBrazilianPhone(phone: string): boolean {
  if (!phone || phone.trim() === "" || phone.trim() === "+55" || phone.trim() === "+55 ") {
    return true; // Empty is valid (optional field)
  }
  const stripped = stripPhoneFormatting(phone);
  return BRAZILIAN_PHONE_REGEX.test(stripped);
}

/**
 * Get Brazilian phone validation error message
 */
export function getBrazilianPhoneError(phone: string): string | null {
  if (!phone || phone.trim() === "" || phone.trim() === "+55" || phone.trim() === "+55 ") {
    return null; // Empty is valid
  }
  const stripped = stripPhoneFormatting(phone);
  if (!stripped.startsWith("+55")) {
    return "Use o código do Brasil: +55";
  }
  if (!BRAZILIAN_PHONE_REGEX.test(stripped)) {
    return "Formato inválido. Use: +55 (11) 99999-8888";
  }
  return null;
}



