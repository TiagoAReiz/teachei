import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegistrarVendaUseCaseImpl } from "@/backend/avaliacao/application/usecase/RegistrarVendaUseCaseImpl";
import type { AvaliacaoRepositoryPort } from "@/backend/avaliacao/application/ports/out/AvaliacaoRepositoryPort";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";

const repo = { findVendaByAnuncioVendedor: vi.fn(), saveVenda: vi.fn() } as unknown as AvaliacaoRepositoryPort;
const anuncios = { findById: vi.fn() } as unknown as AnuncioRepositoryPort;
const anuncio = { id: "a1", usuarioId: "comprador", status: "ATIVO" };
const uc = () => new RegistrarVendaUseCaseImpl(repo, anuncios);

describe("RegistrarVendaUseCaseImpl", () => {
  beforeEach(() => vi.clearAllMocks());

  it("grava a venda com o dono da intenção como comprador", async () => {
    vi.mocked(anuncios.findById).mockResolvedValue(anuncio as never);
    vi.mocked(repo.findVendaByAnuncioVendedor).mockResolvedValue(null);
    vi.mocked(repo.saveVenda).mockResolvedValue({ id: "v1" } as never);
    await uc().execute("a1", "vendedor");
    expect(repo.saveVenda).toHaveBeenCalledWith({ anuncioId: "a1", vendedorId: "vendedor", compradorId: "comprador" });
  });

  it("é idempotente quando a venda já existe", async () => {
    vi.mocked(anuncios.findById).mockResolvedValue(anuncio as never);
    vi.mocked(repo.findVendaByAnuncioVendedor).mockResolvedValue({ id: "v1" } as never);
    const r = await uc().execute("a1", "vendedor");
    expect(r.id).toBe("v1");
    expect(repo.saveVenda).not.toHaveBeenCalled();
  });

  it("rejeita venda na própria intenção", async () => {
    vi.mocked(anuncios.findById).mockResolvedValue(anuncio as never);
    await expect(uc().execute("a1", "comprador")).rejects.toThrow("própria intenção");
  });

  it("rejeita anúncio inexistente e cancelado", async () => {
    vi.mocked(anuncios.findById).mockResolvedValueOnce(null);
    await expect(uc().execute("a1", "vendedor")).rejects.toThrow("não encontrado");
    vi.mocked(anuncios.findById).mockResolvedValueOnce({ ...anuncio, status: "CANCELADO" } as never);
    await expect(uc().execute("a1", "vendedor")).rejects.toThrow("cancelada");
  });
});
