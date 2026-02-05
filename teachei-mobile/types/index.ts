// ============================================
// User and Auth Types (aligned with backend DTOs)
// ============================================

export type UserRole = "BUYER" | "SELLER";

// Backend AuthResponse - token only, no user object
export interface AuthResponse {
  token: string;
  usuarioId: string;
  email: string;
  expiresIn: number;
  tokenType: string;
}

// Login/Register requests match backend
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  senha: string;
  nome?: string;
}

// ============================================
// Profile Types (aligned with PerfilResponse)
// ============================================

export interface Perfil {
  id: string;
  usuarioId: string;
  nome: string;
  bio?: string;
  whatsapp?: string;
  whatsappLink?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  criadoEm: string;
}

export interface AtualizarPerfilRequest {
  nome?: string;
  bio?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
}

// Legacy User type for UI compatibility - maps from Perfil
export interface User {
  id: string;
  email: string;
  nome: string;
  role?: UserRole;
  telefone?: string;
  cidade?: string;
  estado?: string;
  avatarUrl?: string;
  bio?: string;
  whatsapp?: string;
  whatsappLink?: string;
  instagram?: string;
  facebook?: string;
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  verified?: boolean;
  createdAt?: string;
}

// Auth state for stores
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// Vehicle Types (aligned with backend)
// ============================================

export type TipoVeiculo = "CARRO" | "MOTO" | "CAMINHAO";

// Individual item types
export interface Marca {
  codigo: string;
  nome: string;
}

export interface Modelo {
  codigo: string;
  nome: string;
}

export interface Ano {
  codigo: string;
  nome: string;
}

// Backend wrapper responses
export interface MarcasResponse {
  marcas: Marca[];
}

export interface ModelosResponse {
  modelos: Modelo[];
}

export interface AnosResponse {
  anos: Ano[];
}

export interface PrecoFipeResponse {
  valor: number;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
}

// ============================================
// Intention/Anuncio Types (aligned with AnuncioResponse)
// ============================================

export type StatusAnuncio = "ATIVO" | "PENDENTE_PAGAMENTO" | "FINALIZADO" | "EXPIRADO";

// Nested vehicle info in AnuncioResponse
export interface VeiculoResponse {
  marcaCodigo: string;
  marcaNome: string;
  modeloCodigo: string;
  modeloNome: string;
  modeloBaseNome?: string;
  anos: number[];
  cores: string[];
  precoMaximo: number;
  precoFipeReferencia?: number;
  quilometragemMinima?: number;
  quilometragemMaxima?: number;
  dadosManuais: boolean;
}

// Nested contact info in AnuncioResponse
export interface ContatoResponse {
  whatsapp?: string;
  whatsappLink?: string;
  instagram?: string;
  cidade?: string;
  estado?: string;
  localizacao?: string;
}

// Full Anuncio response from backend
export interface Anuncio {
  id: string;
  usuarioId: string;
  tipo: TipoVeiculo;
  status: StatusAnuncio;
  veiculo: VeiculoResponse;
  contato: ContatoResponse;
  observacoes?: string;
  criadoEm: string;
  expiraEm?: string;
}

// Request to create an intention (matches CriarAnuncioRequest)
export interface CreateAnuncioRequest {
  tipo: TipoVeiculo;
  marcaCodigo?: string;
  marcaNome?: string;
  modeloCodigo?: string;
  modeloNome?: string;
  anos: number[];
  cores: string[];
  precoMaximo: number;
  observacoes?: string;
  dadosManuais?: boolean;
}

// ============================================
// Payment Types (aligned with PagamentoResponse)
// ============================================

export interface PagamentoResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
  valor: number;
}

// ============================================
// Optional Features Types
// ============================================

export interface OpcionalOption {
  codigo: string;
  label: string;
}

// ============================================
// Filter Types
// ============================================

export interface FiltrosDisponiveis {
  tipos: TipoVeiculo[];
  marcas: Marca[];
  modelos: Modelo[];
  opcionais: OpcionalOption[];
}

export interface IntentionFilters {
  tipoVeiculo?: TipoVeiculo;
  search?: string;
  status?: StatusAnuncio;
  page?: number;
  size?: number;
}

// ============================================
// API Response Types (aligned with PaginaResponse)
// ============================================

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// ============================================
// Helper function to map Perfil to User for UI
// ============================================

export function perfilToUser(perfil: Perfil, email?: string): User {
  return {
    id: perfil.usuarioId,
    email: email || "",
    nome: perfil.nome,
    bio: perfil.bio,
    whatsapp: perfil.whatsapp,
    whatsappLink: perfil.whatsappLink,
    instagram: perfil.instagram,
    facebook: perfil.facebook,
    cidade: perfil.cidade,
    estado: perfil.estado,
    avaliacaoMedia: perfil.avaliacaoMedia,
    totalAvaliacoes: perfil.totalAvaliacoes,
    createdAt: perfil.criadoEm,
  };
}
