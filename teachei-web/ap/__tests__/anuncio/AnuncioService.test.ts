import { describe, it, expect } from "vitest";
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";

describe("AnuncioService", () => {
  it("validarAnuncio lança erro se tipo ausente", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "" as "CARRO", precoMaximo: 50000, anos: [2020], cores: [] })
    ).toThrow("Tipo de veículo inválido");
  });

  it("validarAnuncio lança erro se precoMaximo <= 0", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "CARRO", precoMaximo: 0, anos: [2020], cores: [] })
    ).toThrow("Preço máximo deve ser maior que zero");
  });

  it("validarAnuncio lança erro se anos vazio", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "CARRO", precoMaximo: 50000, anos: [], cores: [] })
    ).toThrow("Pelo menos um ano deve ser informado");
  });

  it("validarAnuncio não lança para dados válidos", () => {
    expect(() =>
      AnuncioService.validarAnuncio({ tipo: "CARRO", precoMaximo: 50000, anos: [2020], cores: ["Branco"] })
    ).not.toThrow();
  });

  it("calcularExpiracao retorna 30 dias no futuro", () => {
    const expira = AnuncioService.calcularExpiracao();
    const diff = expira.getTime() - Date.now();
    expect(diff).toBeGreaterThan(29 * 24 * 60 * 60 * 1000);
    expect(diff).toBeLessThan(31 * 24 * 60 * 60 * 1000);
  });
});
