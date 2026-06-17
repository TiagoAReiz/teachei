import type { FavoritoRepositoryPort } from "@/backend/favorito/application/ports/out/FavoritoRepositoryPort";
import type { AnuncioRepositoryPort, PaginatedAnuncios } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";

export class ListarAnunciosFavoritosUseCaseImpl {
  constructor(
    private favoritoRepo: FavoritoRepositoryPort,
    private anuncioRepo: AnuncioRepositoryPort,
  ) {}

  async execute(usuarioId: string, page: number, size: number): Promise<PaginatedAnuncios> {
    const { ids, total } = await this.favoritoRepo.findPageByUsuarioId(usuarioId, page, size);
    const anuncios = await this.anuncioRepo.findByIds(ids);
    const byId = new Map(anuncios.map((a) => [a.id, a]));
    const content = ids
      .map((id) => byId.get(id))
      .filter((a): a is Anuncio => a !== undefined);
    const totalPages = size > 0 ? Math.ceil(total / size) : 0;
    return {
      content,
      totalElements: total,
      totalPages,
      page,
      size,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    };
  }
}
