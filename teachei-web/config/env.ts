// Environment configuration
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://teachei.shop",
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
} as const;

// API endpoints (aligned with backend /api/v1 prefix)
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: "/api/v1/auth/login",
  AUTH_REGISTER: "/api/v1/auth/registrar",
  AUTH_GOOGLE: "/api/v1/auth/google",
  AUTH_CHANGE_PASSWORD: "/api/v1/auth/senha",

  // Profile
  PROFILE: "/api/v1/perfil",
  PROFILE_BY_ID: (id: string) => `/api/v1/perfil/${id}`,

  // Intentions (Anuncios)
  INTENTIONS: "/api/v1/anuncios",
  INTENTION_FILTERS: "/api/v1/anuncios/filtros",
  INTENTION_BY_ID: (id: string) => `/api/v1/anuncios/${id}`,
  INTENTIONS_BY_USER: (userId: string) => `/api/v1/anuncios/usuario/${userId}`,
  MY_INTENTIONS: "/api/v1/anuncios/meus",

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

  // Payments (webhook only - intentions are free, subscriptions via /assinaturas)
  PAYMENT_WEBHOOK: "/api/v1/pagamentos/webhook",

  // Subscriptions
  SUBSCRIPTIONS: "/api/v1/assinaturas",
  SUBSCRIPTION_PLANS: "/api/v1/assinaturas/planos",
  SUBSCRIPTION_STATUS: "/api/v1/assinaturas/minha",
} as const;
