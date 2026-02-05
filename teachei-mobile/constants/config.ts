// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080",
  timeout: 10000,
};

// App Configuration
export const APP_CONFIG = {
  name: "TeAchei",
  version: "1.0.0",
};

// API Endpoints (aligned with backend /api/v1 prefix)
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/api/v1/auth/login",
  AUTH_REGISTER: "/api/v1/auth/registrar",

  // Profile
  PROFILE: "/api/v1/perfil",
  PROFILE_BY_ID: (id: string) => `/api/v1/perfil/${id}`,

  // Intentions (Anuncios)
  INTENTIONS: "/api/v1/anuncios",
  INTENTION_BY_ID: (id: string) => `/api/v1/anuncios/${id}`,
  MY_INTENTIONS: "/api/v1/anuncios/meus",
  INTENTIONS_FILTERS: "/api/v1/anuncios/filtros",

  // Vehicles (FIPE)
  VEHICLE_BRANDS: (tipo: string) => `/api/v1/veiculos/${tipo}/marcas`,
  VEHICLE_MODELS: (tipo: string, marcaCodigo: string) =>
    `/api/v1/veiculos/${tipo}/marcas/${marcaCodigo}/modelos`,
  VEHICLE_YEARS: (tipo: string, marcaCodigo: string, modeloCodigo: string) =>
    `/api/v1/veiculos/${tipo}/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos`,
  VEHICLE_PRICE: (
    tipo: string,
    marcaCodigo: string,
    modeloCodigo: string,
    anoCodigo: string
  ) =>
    `/api/v1/veiculos/${tipo}/marcas/${marcaCodigo}/modelos/${modeloCodigo}/anos/${anoCodigo}/preco`,

  // Payments
  PAYMENT_PREFERENCE: (anuncioId: string) =>
    `/api/v1/pagamentos/preferencia/${anuncioId}`,
} as const;
