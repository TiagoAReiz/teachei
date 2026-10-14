import type { BuscarAnunciosUseCase } from "@/backend/anuncio/application/ports/in/BuscarAnunciosUseCase";
import type { AnuncioFilters, PaginatedAnuncios, AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import { GeoService } from "@/backend/anuncio/domain/service/GeoService";
export class BuscarAnunciosUseCaseImpl implements BuscarAnunciosUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(filters: AnuncioFilters): Promise<PaginatedAnuncios> {
    const { raioKm, ...resto } = filters;
    if (raioKm && raioKm > 0 && resto.cidade && resto.estado) {
      const candidatas = await this.repo.findLocalizacoesAtivas();
      const localizacoes = GeoService.dentroDoRaio({ cidade: resto.cidade, estado: resto.estado }, raioKm, candidatas);
      return this.repo.findAll({ ...resto, cidade: undefined, estado: undefined, localizacoes });
    }
    return this.repo.findAll(resto);
  }
}
