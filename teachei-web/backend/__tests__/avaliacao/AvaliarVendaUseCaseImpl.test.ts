import { describe, it, expect, vi, beforeEach } from "vitest";
import { AvaliarVendaUseCaseImpl } from "@/backend/avaliacao/application/usecase/AvaliarVendaUseCaseImpl";
import type { AvaliacaoRepositoryPort } from "@/backend/avaliacao/application/ports/out/AvaliacaoRepositoryPort";

const repo = { findVendaById: vi.fn(), findAvaliacaoByVenda: vi.fn(), saveAvaliacao: vi.fn() } as unknown as AvaliacaoRepositoryPort;
const venda = { id: "v1", vendedorId: "vendedor", compradorId: "comprador" };
const uc = () => new AvaliarVendaUseCaseImpl(repo);

describe("AvaliarVendaUseCaseImpl", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(repo.findVendaById).mockResolvedValue(venda as never);
    vi.mocked(repo.findAvaliacaoByVenda).mockResolvedValue(null);
    vi.mocked(repo.saveAvaliacao).mockResolvedValue({ id: "av1" } as never);
  });

  it("comprador avalia o vendedor", async () => {
    await uc().execute("comprador", { vendaId: "v1", nota: 5, comentario: "  ótimo  " });
    expect(repo.saveAvaliacao).toHaveBeenCalledWith({
      vendaId: "v1", avaliadorId: "comprador", avaliadoId: "vendedor", nota: 5, comentario: "ótimo",
    });
  });

  it.each([0, 6, 3.5, NaN])("rejeita nota inválida %s", async (nota) => {
    await expect(uc().execute("comprador", { vendaId: "v1", nota })).rejects.toThrow("1 a 5");
  });

  it("rejeita comentário longo demais", async () => {
    await expect(uc().execute("comprador", { vendaId: "v1", nota: 4, comentario: "x".repeat(501) })).rejects.toThrow("500");
  });

  it("só o comprador da venda avalia", async () => {
    await expect(uc().execute("outro", { vendaId: "v1", nota: 4 })).rejects.toThrow("Só o comprador");
    await expect(uc().execute("vendedor", { vendaId: "v1", nota: 4 })).rejects.toThrow("Só o comprador");
  });

  it("não avalia duas vezes nem venda inexistente", async () => {
    vi.mocked(repo.findAvaliacaoByVenda).mockResolvedValue({ id: "av0" } as never);
    await expect(uc().execute("comprador", { vendaId: "v1", nota: 4 })).rejects.toThrow("já foi avaliada");
    vi.mocked(repo.findVendaById).mockResolvedValue(null);
    await expect(uc().execute("comprador", { vendaId: "x", nota: 4 })).rejects.toThrow("não encontrada");
  });
});
