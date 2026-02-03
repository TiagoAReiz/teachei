/**
 * IBGE API Integration
 * API documentation: https://servicodados.ibge.gov.br/api/docs/localidades
 */

const IBGE_API_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

/**
 * Brazilian state from IBGE API
 */
export interface IBGEEstado {
  id: number;
  sigla: string;
  nome: string;
}

/**
 * Brazilian city from IBGE API
 */
export interface IBGEMunicipio {
  id: number;
  nome: string;
}

/**
 * Simplified state for our app
 */
export interface Estado {
  sigla: string;
  nome: string;
}

/**
 * Simplified city for our app
 */
export interface Cidade {
  nome: string;
}

/**
 * Fetch all Brazilian states ordered by name
 */
export async function getEstados(): Promise<Estado[]> {
  const response = await fetch(`${IBGE_API_BASE}/estados?orderBy=nome`);
  
  if (!response.ok) {
    throw new Error("Erro ao buscar estados");
  }
  
  const data: IBGEEstado[] = await response.json();
  
  return data.map((estado) => ({
    sigla: estado.sigla,
    nome: estado.nome,
  }));
}

/**
 * Fetch all cities for a given state (UF)
 */
export async function getCidades(uf: string): Promise<Cidade[]> {
  if (!uf) return [];
  
  const response = await fetch(
    `${IBGE_API_BASE}/estados/${uf}/municipios?orderBy=nome`
  );
  
  if (!response.ok) {
    throw new Error("Erro ao buscar cidades");
  }
  
  const data: IBGEMunicipio[] = await response.json();
  
  return data.map((cidade) => ({
    nome: cidade.nome,
  }));
}

/**
 * List of valid Brazilian UF codes
 */
export const VALID_UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const;

export type UF = typeof VALID_UFS[number];

/**
 * Check if a string is a valid UF
 */
export function isValidUF(uf: string): uf is UF {
  return VALID_UFS.includes(uf.toUpperCase() as UF);
}
