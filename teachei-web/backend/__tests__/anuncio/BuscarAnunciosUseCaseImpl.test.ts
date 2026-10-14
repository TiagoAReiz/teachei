import { describe, it, expect, vi, beforeEach } from "vitest";
import { BuscarAnunciosUseCaseImpl } from "@/backend/anuncio/application/usecase/BuscarAnunciosUseCaseImpl";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";

const repo = {
  findAll: vi.fn(),
  findLocalizacoesAtivas: vi.fn(),
} as unknown as AnuncioRepositoryPort;

describe("BuscarAnunciosUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sem raio, delega os filtros como vieram", async () => {
    await new BuscarAnunciosUseCaseImpl(repo).execute({ cidade: "Campinas", estado: "SP" });
    expect(repo.findAll).toHaveBeenCalledWith({ cidade: "Campinas", estado: "SP" });
    expect(repo.findLocalizacoesAtivas).not.toHaveBeenCalled();
  });

  it("com raio, troca cidade/estado por localizações próximas", async () => {
    vi.mocked(repo.findLocalizacoesAtivas).mockResolvedValue([
      { cidade: "Campinas", estado: "SP" },
      { cidade: "Rio de Janeiro", estado: "RJ" },
    ]);
    await new BuscarAnunciosUseCaseImpl(repo).execute({ cidade: "São Paulo", estado: "SP", raioKm: 150 });
    const arg = vi.mocked(repo.findAll).mock.calls[0][0];
    expect(arg.cidade).toBeUndefined();
    expect(arg.raioKm).toBeUndefined();
    expect(arg.localizacoes?.map((l) => l.cidade)).toEqual(["São Paulo", "Campinas"]);
  });

  it("raio sem cidade/estado é ignorado", async () => {
    await new BuscarAnunciosUseCaseImpl(repo).execute({ raioKm: 100 });
    expect(repo.findAll).toHaveBeenCalledWith({});
  });
});
