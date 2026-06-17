import { describe, it, expect, vi, beforeEach } from "vitest";
import { GerenciarFavoritosUseCaseImpl } from "@/backend/favorito/application/usecase/GerenciarFavoritosUseCaseImpl";
import type { FavoritoRepositoryPort } from "@/backend/favorito/application/ports/out/FavoritoRepositoryPort";

const mockRepo: FavoritoRepositoryPort = {
  findByUsuarioId: vi.fn(),
  findPageByUsuarioId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  exists: vi.fn(),
};

describe("GerenciarFavoritosUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("listar delega ao repo", async () => {
    vi.mocked(mockRepo.findByUsuarioId).mockResolvedValue(["id-1", "id-2"]);
    const uc = new GerenciarFavoritosUseCaseImpl(mockRepo);
    const result = await uc.listar("usuario-1");
    expect(result).toEqual(["id-1", "id-2"]);
    expect(mockRepo.findByUsuarioId).toHaveBeenCalledWith("usuario-1");
  });

  it("adicionar delega ao repo", async () => {
    vi.mocked(mockRepo.save).mockResolvedValue(undefined);
    const uc = new GerenciarFavoritosUseCaseImpl(mockRepo);
    await uc.adicionar("usuario-1", "anuncio-1");
    expect(mockRepo.save).toHaveBeenCalledWith("usuario-1", "anuncio-1");
  });

  it("verificar retorna true quando existe", async () => {
    vi.mocked(mockRepo.exists).mockResolvedValue(true);
    const uc = new GerenciarFavoritosUseCaseImpl(mockRepo);
    expect(await uc.verificar("u", "a")).toBe(true);
  });
});
