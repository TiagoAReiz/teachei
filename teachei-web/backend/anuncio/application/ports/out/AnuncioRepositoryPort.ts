import type { Anuncio, TipoVeiculo } from "@/backend/anuncio/domain/model/Anuncio";
import type { StatusAnuncio } from "@/backend/anuncio/domain/model/StatusAnuncio";
import type { FiltroSelecao } from "@/backend/anuncio/domain/model/FiltroSelecao";

export interface AnuncioFilters {
  tipoVeiculo?: TipoVeiculo;
  search?: string;
  status?: StatusAnuncio;
  incluirTodosStatus?: boolean;  // when true, don't filter by status
  marcaCodigo?: string;
  modeloCodigo?: string;
  modelos?: string[];
  cidade?: string;
  estado?: string;
  anoMin?: number;
  anoMax?: number;
  precoMin?: number;
  precoMax?: number;
  kmMin?: number;
  kmMax?: number;
  opcionais?: string[];
  ordenar?: string;
  page?: number;
  size?: number;
  usuarioId?: string;
}

export interface PaginatedAnuncios {
  content: Anuncio[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AvailableFilters {
  tipos: TipoVeiculo[];
  marcas: { codigo: string; nome: string }[];
  modelos: { codigo: string; nome: string; baseNome: string }[];
  opcionais: { codigo: string; label: string }[];
  localizacoes: { cidade: string; estado: string }[];
}

export interface AnuncioRepositoryPort {
  findAll(filters: AnuncioFilters): Promise<PaginatedAnuncios>;
  findById(id: string): Promise<Anuncio | null>;
  findByIds(ids: string[]): Promise<Anuncio[]>;
  findByUsuarioId(usuarioId: string): Promise<Anuncio[]>;
  save(data: Omit<Anuncio, "id" | "criadoEm">): Promise<Anuncio>;
  update(id: string, data: Partial<Anuncio>): Promise<Anuncio>;
  delete(id: string): Promise<void>;
  getAvailableFilters(selecao: FiltroSelecao): Promise<AvailableFilters>;
}
