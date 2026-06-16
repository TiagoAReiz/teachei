import type { BuscarFiltrosUseCase } from "@/ap/anuncio/application/ports/in/BuscarFiltrosUseCase";
import type { AvailableFilters, AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";
export class BuscarFiltrosUseCaseImpl implements BuscarFiltrosUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  execute(tipo?: TipoVeiculo, marcaCodigo?: string): Promise<AvailableFilters> {
    return this.repo.getAvailableFilters(tipo, marcaCodigo);
  }
}
