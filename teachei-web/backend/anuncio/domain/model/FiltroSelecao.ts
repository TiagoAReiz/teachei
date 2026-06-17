import type { TipoVeiculo } from "./Anuncio";

export interface FiltroSelecao {
  tipo?: TipoVeiculo;
  marcaCodigo?: string;
  modeloBaseNome?: string; // nome base do modelo (ex.: "Gol") — usado nas facetas
  modelos?: string[];      // códigos de versão (usado pela listagem; opcional aqui)
  modeloCodigo?: string;   // versão específica
  cidade?: string;
  estado?: string;
  opcionais?: string[];
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  anoMax?: number;
  kmMin?: number;
  kmMax?: number;
}
