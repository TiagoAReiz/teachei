import type { BuscarAnunciosUseCase } from "@/backend/anuncio/application/ports/in/BuscarAnunciosUseCase";
import type { AnuncioFilters, PaginatedAnuncios, AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
export class BuscarAnunciosUseCaseImpl implements BuscarAnunciosUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  execute(filters: AnuncioFilters): Promise<PaginatedAnuncios> { return this.repo.findAll(filters); }
}
