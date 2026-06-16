import { API_ENDPOINTS } from "@/config/env";
import { api } from "./api";
import type {
  TipoVeiculo,
  Marca,
  Modelo,
  ModeloAgrupado,
  Ano,
  PrecoFipeResponse,
} from "@/types";

export async function getMarcas(tipoVeiculo: TipoVeiculo): Promise<Marca[]> {
  const tipo = tipoVeiculo.toLowerCase();
  return api.get<Marca[]>(
    API_ENDPOINTS.VEHICLE_BRANDS(tipo),
    { requireAuth: false }
  );
}

export async function getModelos(
  tipoVeiculo: TipoVeiculo,
  marcaCodigo: string
): Promise<Modelo[]> {
  const tipo = tipoVeiculo.toLowerCase();
  return api.get<Modelo[]>(
    API_ENDPOINTS.VEHICLE_MODELS(tipo, marcaCodigo),
    { requireAuth: false }
  );
}

export async function getAnos(
  tipoVeiculo: TipoVeiculo,
  marcaCodigo: string,
  modeloCodigo: string
): Promise<Ano[]> {
  const tipo = tipoVeiculo.toLowerCase();
  return api.get<Ano[]>(
    API_ENDPOINTS.VEHICLE_YEARS(tipo, marcaCodigo, modeloCodigo),
    { requireAuth: false }
  );
}

export async function getPrecoFipe(
  tipoVeiculo: TipoVeiculo,
  marcaCodigo: string,
  modeloCodigo: string,
  anoCodigo: string
): Promise<PrecoFipeResponse> {
  const tipo = tipoVeiculo.toLowerCase();
  return api.get<PrecoFipeResponse>(
    API_ENDPOINTS.VEHICLE_PRICE(tipo, marcaCodigo, modeloCodigo, anoCodigo),
    { requireAuth: false }
  );
}

export function groupModelsByBase(modelos: Modelo[]): ModeloAgrupado[] {
  const groups = new Map<string, Modelo[]>();

  for (const modelo of modelos) {
    const baseName = modelo.nome.split(" ")[0];
    if (!groups.has(baseName)) {
      groups.set(baseName, []);
    }
    groups.get(baseName)!.push(modelo);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([baseName, versoes]) => ({
      baseName,
      versoes,
    }));
}

export function getVersionName(fullName: string, baseName: string): string {
  const version = fullName.replace(baseName, "").trim();
  return version || fullName;
}
