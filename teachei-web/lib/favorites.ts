import { api } from "./api";
import { API_ENDPOINTS } from "@/config/env";
import type { Anuncio, PaginatedResponse } from "@/types";

/**
 * Fetch the authenticated user's favorite intentions, paginated.
 */
export async function getFavoriteIntentions(
  params: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<Anuncio>> {
  const sp = new URLSearchParams();
  if (params.page !== undefined) sp.append("page", String(params.page));
  if (params.size !== undefined) sp.append("size", String(params.size));
  const qs = sp.toString();
  const url = qs
    ? `${API_ENDPOINTS.FAVORITES_INTENTIONS}?${qs}`
    : API_ENDPOINTS.FAVORITES_INTENTIONS;
  return api.get<PaginatedResponse<Anuncio>>(url);
}
