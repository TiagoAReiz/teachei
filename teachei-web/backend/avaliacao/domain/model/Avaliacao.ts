export interface Venda {
  id: string;
  anuncioId: string | null;
  vendedorId: string;
  compradorId: string;
  criadoEm: string;
}

export interface Avaliacao {
  id: string;
  vendaId: string;
  avaliadorId: string;
  avaliadoId: string;
  nota: number;
  comentario?: string;
  criadoEm: string;
}

export interface AvaliacaoComAutor extends Avaliacao {
  avaliadorNome: string;
}

export interface VendaPendente {
  vendaId: string;
  anuncioId: string | null;
  vendedorId: string;
  vendedorNome: string;
  veiculo: string; // ex.: "Honda Civic"
  criadoEm: string;
}

export interface Reputacao {
  media: number; // 0 quando não há avaliações; 1 casa decimal
  total: number;
}
