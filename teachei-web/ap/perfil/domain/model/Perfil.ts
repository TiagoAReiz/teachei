export interface Perfil {
  id: string;
  usuarioId: string;
  nome: string;
  bio?: string;
  fotoUrl?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
  role: "BUYER" | "SELLER";
  avaliacaoMedia: number;
  totalAvaliacoes: number;
  criadoEm: string;
}

export interface AtualizarPerfilInput {
  nome?: string;
  bio?: string;
  fotoUrl?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  cidade?: string;
  estado?: string;
  role?: "BUYER" | "SELLER";
}
