import type { AnuncioFilters, PaginatedAnuncios } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
export interface BuscarAnunciosUseCase {
  execute(filters: AnuncioFilters): Promise<PaginatedAnuncios>;
}
