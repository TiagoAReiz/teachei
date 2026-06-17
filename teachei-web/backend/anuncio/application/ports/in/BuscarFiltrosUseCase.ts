import type { AvailableFilters } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { TipoVeiculo } from "@/backend/anuncio/domain/model/Anuncio";
export interface BuscarFiltrosUseCase {
  execute(tipo?: TipoVeiculo, marcaCodigo?: string): Promise<AvailableFilters>;
}
