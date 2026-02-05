import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine class names with Tailwind merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to BRL
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Format date to Brazilian format
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "agora";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return formatDate(date);
}

// Format phone number for display
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Format phone number as user types (Brazilian format)
 * Only applies formatting if the input already includes +55 or 55 prefix.
 * Does NOT automatically add +55 - user must type the full number.
 * Input: raw digits or partial input
 * Output: formatted as +55 (XX) XXXXX-XXXX with visual separators (if has +55)
 */
export function formatBrazilianPhoneInput(value: string): string {
  if (!value) return "";
  
  // Check if input starts with + (indicating country code)
  const hasPlus = value.startsWith("+");
  
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, "");
  
  if (digitsOnly.length === 0) {
    // Keep + if user typed it
    return hasPlus ? "+" : "";
  }
  
  // Only apply Brazilian formatting if starts with 55 (country code)
  if (digitsOnly.startsWith("55")) {
    // Extract digits after country code
    const digits = digitsOnly.slice(2);
    
    // Limit to 11 digits (DDD + 9 digit number)
    const limitedDigits = digits.slice(0, 11);
    
    if (limitedDigits.length === 0) {
      return "+55";
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
  
  // For non-Brazilian numbers or numbers without country code, return as typed
  // Just preserve the + if it was there
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

/**
 * Strip formatting from phone number (for saving to backend)
 * Does NOT add +55 automatically - preserves original format
 * Input: +55 (11) 99999-8888
 * Output: +5511999998888
 */
export function stripPhoneFormatting(phone: string): string {
  if (!phone) return "";
  
  const hasPlus = phone.startsWith("+");
  const digits = phone.replace(/\D/g, "");
  
  if (!digits) return "";
  
  // Preserve the + if it was there, don't add +55 automatically
  return hasPlus ? `+${digits}` : digits;
}

// Generate WhatsApp link
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const phoneWithCountry = cleaned.startsWith("55") ? cleaned : `55${cleaned}`;
  const encodedMessage = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${phoneWithCountry}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
}

// Brazilian phone validation regex
// Format: +55 + DDD (2 digits) + 9-digit mobile number (starting with 9)
// Example: +5511999998888 (stripped format)
const BRAZILIAN_PHONE_REGEX = /^\+55[1-9][0-9]9[0-9]{8}$/;

/**
 * Validate if a phone number is a valid Brazilian mobile number
 * Accepts both formatted (+55 (11) 99999-8888) and unformatted (+5511999998888) formats
 * Requires the +55 country code to be present
 * @param phone - Phone number in any format
 * @returns true if valid Brazilian mobile number
 */
export function isValidBrazilianPhone(phone: string): boolean {
  if (!phone || phone.trim() === "" || phone.trim() === "+" || phone.trim() === "+55" || phone.trim() === "+55 ") {
    return true; // Empty is valid (optional field)
  }
  // Strip formatting before validating
  const stripped = stripPhoneFormatting(phone);
  return BRAZILIAN_PHONE_REGEX.test(stripped);
}

/**
 * Get Brazilian phone validation error message
 * Accepts both formatted and unformatted formats
 * Requires the +55 country code to be present
 * @param phone - Phone number to validate
 * @returns Error message or null if valid
 */
export function getBrazilianPhoneError(phone: string): string | null {
  if (!phone || phone.trim() === "" || phone.trim() === "+" || phone.trim() === "+55" || phone.trim() === "+55 ") {
    return null; // Empty is valid
  }
  // Strip formatting before validating
  const stripped = stripPhoneFormatting(phone);
  if (!stripped.startsWith("+55")) {
    return "Use o formato com código do país: +5511999998888";
  }
  if (!BRAZILIAN_PHONE_REGEX.test(stripped)) {
    return "Formato inválido. Use: +5511999998888";
  }
  return null;
}

// Generate Instagram link
export function getInstagramLink(username: string): string {
  const cleaned = username.replace("@", "").replace("https://instagram.com/", "");
  return `https://instagram.com/${cleaned}`;
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Vehicle type labels
export const vehicleTypeLabels: Record<string, string> = {
  CARRO: "Carro",
  MOTO: "Moto",
  CAMINHAO: "Caminhão",
};

// Status labels
export const statusLabels: Record<string, string> = {
  ATIVO: "Ativo",
  FINALIZADO: "Finalizado",
  EXPIRADO: "Expirado",
  CANCELADO: "Cancelado",
};

// Status colors
export const statusColors: Record<string, string> = {
  ATIVO: "bg-success text-white",
  FINALIZADO: "bg-muted text-white",
  EXPIRADO: "bg-error text-white",
  CANCELADO: "bg-muted text-white",
};

// Format expiration date with days remaining
export function formatExpiration(expiraEm: string | null | undefined): string {
  if (!expiraEm) return "";
  
  const now = new Date();
  const expirationDate = new Date(expiraEm);
  const diffInMs = expirationDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays < 0) {
    return "Expirado";
  } else if (diffInDays === 0) {
    return "Expira hoje";
  } else if (diffInDays === 1) {
    return "Expira amanhã";
  } else if (diffInDays <= 7) {
    return `Expira em ${diffInDays} dias`;
  } else {
    return `Expira em ${formatDate(expiraEm)}`;
  }
}

// Generate year options for vehicle selection (current year - 30 to current year + 1)
export function generateYearOptions(yearsBack: number = 30): { value: string; label: string }[] {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const years: { value: string; label: string }[] = [];
  
  for (let year = nextYear; year >= currentYear - yearsBack; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  
  return years;
}

// Optional feature labels mapping
export const opcionalLabels: Record<string, string> = {
  VIDRO_ELETRICO: "Vidro Elétrico",
  AR_CONDICIONADO: "Ar Condicionado",
  DIRECAO_HIDRAULICA: "Direção Hidráulica",
  DIRECAO_ELETRICA: "Direção Elétrica",
  TETO_SOLAR: "Teto Solar",
  BANCOS_COURO: "Bancos de Couro",
  SENSOR_ESTACIONAMENTO: "Sensor de Estacionamento",
  CAMERA_RE: "Câmera de Ré",
  MULTIMIDIA: "Central Multimídia",
  BLUETOOTH: "Bluetooth",
  AIRBAG: "Airbag",
  ABS: "Freios ABS",
  ALARME: "Alarme",
  RODAS_LIGA: "Rodas de Liga",
  PILOTO_AUTOMATICO: "Piloto Automático",
};

// Format optional feature name for display
// Converts "VIDRO_ELETRICO" to "Vidro Elétrico"
export function formatOpcional(opcional: string): string {
  // Return mapped label if exists
  if (opcionalLabels[opcional]) {
    return opcionalLabels[opcional];
  }
  
  // Fallback: convert SNAKE_CASE to Title Case
  return opcional
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Vehicle colors
export const vehicleColors = [
  { value: "BRANCO", label: "Branco", hex: "#FFFFFF" },
  { value: "PRETO", label: "Preto", hex: "#000000" },
  { value: "PRATA", label: "Prata", hex: "#C0C0C0" },
  { value: "CINZA", label: "Cinza", hex: "#808080" },
  { value: "VERMELHO", label: "Vermelho", hex: "#FF0000" },
  { value: "AZUL", label: "Azul", hex: "#0000FF" },
  { value: "VERDE", label: "Verde", hex: "#008000" },
  { value: "AMARELO", label: "Amarelo", hex: "#FFFF00" },
  { value: "MARROM", label: "Marrom", hex: "#8B4513" },
  { value: "BEGE", label: "Bege", hex: "#F5F5DC" },
];



