import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListarAnunciosFavoritosUseCaseImpl } from "@/backend/favorito/application/usecase/ListarAnunciosFavoritosUseCaseImpl";
import type { FavoritoRepositoryPort } from "@/backend/favorito/application/ports/out/FavoritoRepositoryPort";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";

const favoritoRepo: FavoritoRepositoryPort = {
  findByUsuarioId: vi.fn(),
  findPageByUsuarioId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn(),
};

const anuncioRepo = { findByIds: vi.fn() } as unknown as AnuncioRepositoryPort;

const anuncio = (id: string) => ({ id }) as Anuncio;

describe("ListarAnunciosFavoritosUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retorna anuncios na ordem dos IDs favoritos e calcula a paginacao", async () => {
    vi.mocked(favoritoRepo.findPageByUsuarioId).mockResolvedValue({ ids: ["a", "b"], total: 30 });
    vi.mocked(anuncioRepo.findByIds).mockResolvedValue([anuncio("b"), anuncio("a")]); // fora de ordem

    const uc = new ListarAnunciosFavoritosUseCaseImpl(favoritoRepo, anuncioRepo);
    const res = await uc.execute("user-1", 0, 12);

    expect(res.content.map((a) => a.id)).toEqual(["a", "b"]);
    expect(res.totalElements).toBe(30);
    expect(res.totalPages).toBe(3);
    expect(res.page).toBe(0);
    expect(res.hasNext).toBe(true);
    expect(res.hasPrevious).toBe(false);
    expect(anuncioRepo.findByIds).toHaveBeenCalledWith(["a", "b"]);
  });

  it("lista vazia -> content vazio e sem proxima pagina", async () => {
    vi.mocked(favoritoRepo.findPageByUsuarioId).mockResolvedValue({ ids: [], total: 0 });
    vi.mocked(anuncioRepo.findByIds).mockResolvedValue([]);

    const uc = new ListarAnunciosFavoritosUseCaseImpl(favoritoRepo, anuncioRepo);
    const res = await uc.execute("user-1", 0, 12);

    expect(res.content).toEqual([]);
    expect(res.totalPages).toBe(0);
    expect(res.hasNext).toBe(false);
  });
});
