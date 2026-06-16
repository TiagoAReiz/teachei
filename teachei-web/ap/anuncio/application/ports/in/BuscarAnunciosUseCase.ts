import type { AnuncioFilters, PaginatedAnuncios } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
export interface BuscarAnunciosUseCase {
  execute(filters: AnuncioFilters): Promise<PaginatedAnuncios>;
}
