import { API_ENDPOINTS } from "@/config/env";
import { api } from "./api";
import type {
  Anuncio,
  AvailableFilters,
  AvailableLocalizacao,
  CreateAnuncioRequest,
  UpdateAnuncioRequest,
  PaginatedResponse,
  IntentionFilters,
  TipoVeiculo,
  StatusAnuncio,
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
 * Fetch current user's intentions (array completo — usado pelo perfil próprio).
 */
export async function getMyIntentions(): Promise<Anuncio[]> {
  const res = await api.get<PaginatedResponse<Anuncio>>(`${API_ENDPOINTS.MY_INTENTIONS}?size=1000`);
  return res.content;
}

/**
 * Fetch current user's intentions, paginated (tela "minhas intenções").
 */
export async function getMyIntentionsPage(
  params: { page?: number; size?: number; status?: StatusAnuncio } = {}
): Promise<PaginatedResponse<Anuncio>> {
  const sp = new URLSearchParams();
  if (params.page !== undefined) sp.append("page", String(params.page));
  if (params.size !== undefined) sp.append("size", String(params.size));
  if (params.status) sp.append("status", params.status);
  const qs = sp.toString();
  const url = qs ? `${API_ENDPOINTS.MY_INTENTIONS}?${qs}` : API_ENDPOINTS.MY_INTENTIONS;
  return api.get<PaginatedResponse<Anuncio>>(url);
}

/**
 * Fetch intentions by user ID (array completo — usado por app/profile/[id]).
 */
export async function getIntentionsByUserId(userId: string): Promise<Anuncio[]> {
  const res = await api.get<PaginatedResponse<Anuncio>>(
    `${API_ENDPOINTS.INTENTIONS_BY_USER(userId)}?size=1000`,
    { requireAuth: false }
  );
  return res.content;
}

/**
 * Fetch intentions by user ID, paginated (tela app/user/[id]).
 */
export async function getUserIntentionsPage(
  userId: string,
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<Anuncio>> {
  const sp = new URLSearchParams();
  if (params.page !== undefined) sp.append("page", String(params.page));
  if (params.size !== undefined) sp.append("size", String(params.size));
  const qs = sp.toString();
  const url = qs
    ? `${API_ENDPOINTS.INTENTIONS_BY_USER(userId)}?${qs}`
    : API_ENDPOINTS.INTENTIONS_BY_USER(userId);
  return api.get<PaginatedResponse<Anuncio>>(url, { requireAuth: false });
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

export type FiltroSelecaoRequest = IntentionFilters & { modeloBaseNome?: string };

/**
 * Fetch available filter options with full faceted selection
 */
export async function getAvailableFilters(
  selecao: FiltroSelecaoRequest = {}
): Promise<AvailableFilters> {
  const params = new URLSearchParams();

  if (selecao.tipoVeiculo) params.append("tipo", selecao.tipoVeiculo);
  if (selecao.marcaCodigo) params.append("marcaCodigo", selecao.marcaCodigo);
  if (selecao.modeloBaseNome) params.append("modeloBaseNome", selecao.modeloBaseNome);
  if (selecao.modeloCodigo) params.append("modeloCodigo", selecao.modeloCodigo);
  if (selecao.modelos && selecao.modelos.length > 0) {
    params.append("modelos", selecao.modelos.join(","));
  }
  if (selecao.cidade) params.append("cidade", selecao.cidade);
  if (selecao.estado) params.append("estado", selecao.estado);
  if (selecao.opcionais && selecao.opcionais.length > 0) {
    selecao.opcionais.forEach((o) => params.append("opcionais", o));
  }
  if (selecao.precoMin !== undefined) params.append("precoMin", selecao.precoMin.toString());
  if (selecao.precoMax !== undefined) params.append("precoMax", selecao.precoMax.toString());
  if (selecao.anoMin !== undefined) params.append("anoMin", selecao.anoMin.toString());
  if (selecao.anoMax !== undefined) params.append("anoMax", selecao.anoMax.toString());
  if (selecao.kmMin !== undefined) params.append("kmMin", selecao.kmMin.toString());
  if (selecao.kmMax !== undefined) params.append("kmMax", selecao.kmMax.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${API_ENDPOINTS.INTENTION_FILTERS}?${queryString}`
    : API_ENDPOINTS.INTENTION_FILTERS;

  const data = await api.get<AvailableFilters>(url, { requireAuth: false });
  if (!data.localizacoes) data.localizacoes = [];
  return data;
}

/**
 * Fetch available location options by extracting distinct city/state pairs
 * from existing active intentions. This works independently of the backend
 * filters endpoint - it reads from the regular listing API.
 */
export async function getAvailableLocations(): Promise<AvailableLocalizacao[]> {
  // Fetch a large page of intentions to get a good sample of locations
  const result = await getIntentions({ size: 200 });
  
  // Extract unique city/state pairs from intention contact data
  const locationMap = new Map<string, AvailableLocalizacao>();
  
  for (const intention of result.content) {
    const cidade = intention.contato?.cidade;
    const estado = intention.contato?.estado;
    
    if (cidade && estado) {
      const key = `${cidade}|${estado}`;
      if (!locationMap.has(key)) {
        locationMap.set(key, { cidade, estado });
      }
    }
  }
  
  // Sort by estado then cidade
  return Array.from(locationMap.values()).sort((a, b) => {
    const stateCompare = a.estado.localeCompare(b.estado);
    if (stateCompare !== 0) return stateCompare;
    return a.cidade.localeCompare(b.cidade);
  });
}


