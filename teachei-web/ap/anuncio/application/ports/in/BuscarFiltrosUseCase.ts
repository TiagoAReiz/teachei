import type { AvailableFilters } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";
export interface BuscarFiltrosUseCase {
  execute(tipo?: TipoVeiculo, marcaCodigo?: string): Promise<AvailableFilters>;
}
