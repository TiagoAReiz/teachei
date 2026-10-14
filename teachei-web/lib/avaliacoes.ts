import { api } from "./api";

export interface VendaPendente {
  vendaId: string;
  anuncioId: string | null;
  vendedorId: string;
  vendedorNome: string;
  veiculo: string;
  criadoEm: string;
}

export interface AvaliacaoResponse {
  id: string;
  nota: number;
  comentario?: string;
  criadoEm: string;
  avaliadorNome: string;
}

export interface ReputacaoResponse {
  media: number;
  total: number;
  avaliacoes: AvaliacaoResponse[];
}

/** Vendedor declara que vendeu para o dono da intenção. */
export function registrarVenda(anuncioId: string) {
  return api.post<{ id: string }>(`/api/v1/anuncios/${anuncioId}/venda`);
}

export function fetchVendasPendentes() {
  return api.get<VendaPendente[]>("/api/v1/avaliacoes/pendentes");
}

export function avaliarVenda(input: { vendaId: string; nota: number; comentario?: string }) {
  return api.post<{ id: string }>("/api/v1/avaliacoes", input);
}

export function fetchReputacao(usuarioId: string) {
  return api.get<ReputacaoResponse>(`/api/v1/avaliacoes/usuario/${usuarioId}`, { requireAuth: false });
}
