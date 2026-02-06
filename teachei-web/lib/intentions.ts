import { API_ENDPOINTS } from "@/config/env";
import { api } from "./api";
import type {
  Anuncio,
  AvailableFilters,
  CreateAnuncioRequest,
  UpdateAnuncioRequest,
  PaginatedResponse,
  IntentionFilters,
  TipoVeiculo,
} from "@/types";

/**
 * Fetch paginated list of intentions with filters
 */
export async function getIntentions(
  filters: IntentionFilters = {}
): Promise<PaginatedResponse<Anuncio>> {
  const params = new URLSearchParams();

  if (filters.tipoVeiculo) params.append("tipoVeiculo", filters.tipoVeiculo);
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.marcaCodigo) params.append("marcaCodigo", filters.marcaCodigo);
  if (filters.modeloCodigo) params.append("modeloCodigo", filters.modeloCodigo);
  if (filters.modelos && filters.modelos.length > 0) {
    params.append("modelos", filters.modelos.join(","));
  }
  if (filters.cidade) params.append("cidade", filters.cidade);
  if (filters.estado) params.append("estado", filters.estado);
  if (filters.anoMin !== undefined) params.append("anoMin", filters.anoMin.toString());
  if (filters.anoMax !== undefined) params.append("anoMax", filters.anoMax.toString());
  if (filters.precoMin !== undefined) params.append("precoMin", filters.precoMin.toString());
  if (filters.precoMax !== undefined) params.append("precoMax", filters.precoMax.toString());
  if (filters.kmMin !== undefined) params.append("kmMin", filters.kmMin.toString());
  if (filters.kmMax !== undefined) params.append("kmMax", filters.kmMax.toString());
  if (filters.opcionais && filters.opcionais.length > 0) {
    // Send each opcional as a separate parameter for proper Spring List parsing
    filters.opcionais.forEach(opcional => params.append("opcionais", opcional));
  }
  if (filters.ordenar) params.append("ordenar", filters.ordenar);
  if (filters.page !== undefined) params.append("page", filters.page.toString());
  if (filters.size !== undefined) params.append("size", filters.size.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${API_ENDPOINTS.INTENTIONS}?${queryString}`
    : API_ENDPOINTS.INTENTIONS;

  return api.get<PaginatedResponse<Anuncio>>(url, { requireAuth: false });
}

/**
 * Fetch a single intention by ID
 */
export async function getIntentionById(id: string): Promise<Anuncio> {
  return api.get<Anuncio>(API_ENDPOINTS.INTENTION_BY_ID(id), {
    requireAuth: false,
  });
}

/**
 * Fetch current user's intentions
 */
export async function getMyIntentions(): Promise<Anuncio[]> {
  return api.get<Anuncio[]>(API_ENDPOINTS.MY_INTENTIONS);
}

/**
 * Fetch intentions by user ID (public endpoint)
 * TODO: Para cobrar assinatura, verificar se usuário tem assinatura ativa antes de chamar
 */
export async function getIntentionsByUserId(userId: string): Promise<Anuncio[]> {
  return api.get<Anuncio[]>(API_ENDPOINTS.INTENTIONS_BY_USER(userId), {
    requireAuth: false,
  });
}

/**
 * Create a new intention
 */
export async function createIntention(
  data: CreateAnuncioRequest
): Promise<Anuncio> {
  return api.post<Anuncio>(API_ENDPOINTS.INTENTIONS, data);
}

/**
 * Update an existing intention
 */
export async function updateIntention(
  id: string,
  data: UpdateAnuncioRequest
): Promise<Anuncio> {
  return api.put<Anuncio>(API_ENDPOINTS.INTENTION_BY_ID(id), data);
}

/**
 * Mark an intention as completed/sold
 */
export async function markAsCompleted(id: string): Promise<Anuncio> {
  return api.post<Anuncio>(`${API_ENDPOINTS.INTENTION_BY_ID(id)}/finalizar`);
}

/**
 * Delete an intention
 */
export async function deleteIntention(id: string): Promise<void> {
  return api.delete(API_ENDPOINTS.INTENTION_BY_ID(id));
}

/**
 * Fetch available filter options based on existing active intentions
 */
export async function getAvailableFilters(
  tipo?: TipoVeiculo,
  marcaCodigo?: string
): Promise<AvailableFilters> {
  const params = new URLSearchParams();
  
  if (tipo) params.append("tipo", tipo);
  if (marcaCodigo) params.append("marcaCodigo", marcaCodigo);

  const queryString = params.toString();
  const url = queryString
    ? `${API_ENDPOINTS.INTENTION_FILTERS}?${queryString}`
    : API_ENDPOINTS.INTENTION_FILTERS;

  return api.get<AvailableFilters>(url, { requireAuth: false });
}


