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
  fotoUrl?: string;
  whatsapp?: string;
  whatsappLink?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
  role?: UserRole;
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  criadoEm: string;
}

export interface AtualizarPerfilRequest {
  nome?: string;
  bio?: string;
  foto?: string;  // Base64 encoded photo for upload to Blob Storage
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
  role?: UserRole;
  removerFoto?: boolean;  // If true, delete existing photo
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
  fotoUrl?: string;
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

// Grouped model for base model + versions selection
export interface ModeloAgrupado {
  baseName: string;
  versoes: Modelo[];
}

// Selected version for multi-select
export interface VersaoSelecionada {
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

export type StatusAnuncio = "ATIVO" | "FINALIZADO" | "EXPIRADO" | "CANCELADO";

// Version info in VeiculoResponse
export interface VersaoResponse {
  codigo: string;
  nome: string;
}

// Nested vehicle info in AnuncioResponse
export interface VeiculoResponse {
  marcaCodigo: string;
  marcaNome: string;
  modeloCodigo: string;
  modeloNome: string;
  modeloBaseNome?: string;          // Base model name (e.g., "Onix")
  versoes?: VersaoResponse[];       // Selected versions
  todasVersoes?: boolean;           // True if "accept any version"
  anos: number[];
  cores: string[];
  precoMaximo: number;
  precoFipeReferencia?: number;
  quilometragemMinima?: number;
  quilometragemMaxima?: number;
  opcionais?: string[];
  dadosManuais: boolean;
  fotoReferenciaUrl?: string;       // Optional reference photo URL
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
  contatoOculto?: boolean;
  assinaturaAtiva?: boolean;
}

// Version request for creating intentions
export interface VersaoRequest {
  codigo: string;
  nome: string;
}

// Request to create an intention (matches CriarAnuncioRequest)
export interface CreateAnuncioRequest {
  tipo: TipoVeiculo;
  marcaCodigo?: string;
  marcaNome?: string;
  modeloCodigo?: string;
  modeloNome?: string;
  modeloBaseNome?: string;          // Base model name (e.g., "Onix")
  versoes?: VersaoRequest[];        // Selected versions
  todasVersoes?: boolean;           // True if "accept any version"
  anos: number[];
  cores: string[];
  precoMaximo: number;
  quilometragemMinima?: number;
  quilometragemMaxima?: number;
  opcionais?: string[];
  observacoes?: string;
  dadosManuais?: boolean;
  cidade?: string;
  estado?: string;
  fotoReferenciaBase64?: string;    // Optional reference photo (Base64)
}

// Request to update an intention (matches AtualizarAnuncioRequest)
export interface UpdateAnuncioRequest {
  versoes?: VersaoRequest[];
  todasVersoes?: boolean;
  anos: number[];
  cores?: string[];
  precoMaximo: number;
  quilometragemMinima?: number;
  quilometragemMaxima?: number;
  opcionais?: string[];
  observacoes?: string;
  cidade?: string;
  estado?: string;
  fotoReferenciaBase64?: string;    // Optional reference photo update (Base64)
}

// ============================================
// Filter Types
// ============================================

// ============================================
// Available Filters Types (from active intentions)
// ============================================

export interface AvailableFilters {
  tipos: TipoVeiculo[];
  marcas: AvailableMarca[];
  modelos: AvailableModelo[];
  opcionais: AvailableOpcional[];
}

export interface AvailableMarca {
  codigo: string;
  nome: string;
}

export interface AvailableModelo {
  codigo: string;
  nome: string;
  baseNome: string;
}

export interface AvailableOpcional {
  codigo: string;
  label: string;
}

// ============================================
// Filter Types
// ============================================

// Sort options for intentions
export type SortOption = 
  | "RECENTE"      // Most recent first (default)
  | "PRECO_ASC"    // Lowest price first
  | "PRECO_DESC"   // Highest price first
  | "KM_ASC"       // Lowest km first
  | "ANO_DESC"     // Newest year first
  | "NOME_ASC";    // Alphabetical by model name

export interface IntentionFilters {
  tipoVeiculo?: TipoVeiculo;
  search?: string;
  status?: StatusAnuncio;
  marcaCodigo?: string;
  modeloCodigo?: string;
  modelos?: string[]; // Multiple model codes (comma-separated in URL)
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  kmMin?: number;
  kmMax?: number;
  opcionais?: string[];
  ordenar?: SortOption;
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
// UI State Types
// ============================================

export interface ModalState {
  isOpen: boolean;
  onClose: () => void;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
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
    fotoUrl: perfil.fotoUrl,
    whatsapp: perfil.whatsapp,
    whatsappLink: perfil.whatsappLink,
    instagram: perfil.instagram,
    facebook: perfil.facebook,
    cidade: perfil.cidade,
    estado: perfil.estado,
    role: perfil.role,
    avaliacaoMedia: perfil.avaliacaoMedia,
    totalAvaliacoes: perfil.totalAvaliacoes,
    createdAt: perfil.criadoEm,
  };
}
