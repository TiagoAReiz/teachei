import { describe, it, expect } from "vitest";
import { computeAvailableFilters } from "./FiltroFacetService";
import type { Anuncio } from "../model/Anuncio";

function anuncio(over: {
  tipo?: Anuncio["tipo"];
  marcaCodigo?: string; marcaNome?: string;
  modeloCodigo?: string; modeloNome?: string; modeloBaseNome?: string;
  anos?: number[]; precoMaximo?: number;
  quilometragemMinima?: number; quilometragemMaxima?: number;
  opcionais?: string[]; cidade?: string; estado?: string;
}): Anuncio {
  return {
    id: "x", usuarioId: "u", tipo: over.tipo ?? "CARRO", status: "ATIVO",
    veiculo: {
      marcaCodigo: over.marcaCodigo, marcaNome: over.marcaNome,
      modeloCodigo: over.modeloCodigo, modeloNome: over.modeloNome,
      modeloBaseNome: over.modeloBaseNome ?? over.modeloNome,
      anos: over.anos ?? [2020], cores: ["Branco"],
      precoMaximo: over.precoMaximo ?? 50000,
      quilometragemMinima: over.quilometragemMinima,
      quilometragemMaxima: over.quilometragemMaxima,
      opcionais: over.opcionais ?? [], dadosManuais: false,
    },
    contato: { cidade: over.cidade ?? "São Paulo", estado: over.estado ?? "SP" },
    criadoEm: "2026-01-01",
  };
}

const catalogo = [
  { codigo: "ar", label: "Ar condicionado", tipos: [] as string[] },
  { codigo: "abs", label: "Freios ABS", tipos: ["CARRO"] },
  { codigo: "bau", label: "Baú", tipos: ["MOTO"] },
];

const dados: Anuncio[] = [
  anuncio({ tipo: "CARRO", marcaCodigo: "vw", marcaNome: "VW", modeloCodigo: "gol", modeloNome: "Gol", precoMaximo: 40000, cidade: "São Paulo", estado: "SP", opcionais: ["ar", "abs"] }),
  anuncio({ tipo: "CARRO", marcaCodigo: "vw", marcaNome: "VW", modeloCodigo: "polo", modeloNome: "Polo", precoMaximo: 80000, cidade: "Curitiba", estado: "PR", opcionais: ["ar"] }),
  anuncio({ tipo: "CARRO", marcaCodigo: "fiat", marcaNome: "Fiat", modeloCodigo: "argo", modeloNome: "Argo", precoMaximo: 45000, cidade: "Belo Horizonte", estado: "MG", opcionais: [] }),
  anuncio({ tipo: "MOTO", marcaCodigo: "honda", marcaNome: "Honda", modeloCodigo: "cg", modeloNome: "CG 160", precoMaximo: 16000, cidade: "Recife", estado: "PE", opcionais: ["bau"] }),
];

describe("computeAvailableFilters", () => {
  it("sem seleção, retorna todas as dimensões", () => {
    const r = computeAvailableFilters(dados, {}, catalogo);
    expect(r.tipos.sort()).toEqual(["CARRO", "MOTO"]);
    expect(r.marcas.map((m) => m.codigo).sort()).toEqual(["fiat", "honda", "vw"]);
    expect(r.modelos.map((m) => m.codigo).sort()).toEqual(["argo", "cg", "gol", "polo"]);
    expect(r.localizacoes.length).toBe(4);
  });

  it("tipo CARRO restringe marcas/modelos/localizações/opcionais", () => {
    const r = computeAvailableFilters(dados, { tipo: "CARRO" }, catalogo);
    expect(r.marcas.map((m) => m.codigo).sort()).toEqual(["fiat", "vw"]);
    expect(r.modelos.map((m) => m.codigo)).not.toContain("cg");
    expect(r.localizacoes.some((l) => l.estado === "PE")).toBe(false);
    expect(r.opcionais.map((o) => o.codigo).sort()).toEqual(["abs", "ar"]);
  });

  it("marca VW restringe os modelos a Gol e Polo", () => {
    const r = computeAvailableFilters(dados, { marcaCodigo: "vw" }, catalogo);
    expect(r.modelos.map((m) => m.codigo).sort()).toEqual(["gol", "polo"]);
  });

  it("auto-exclusão: com marca VW, a faceta de marcas ainda lista todas (sem filtro de tipo)", () => {
    const r = computeAvailableFilters(dados, { marcaCodigo: "vw" }, catalogo);
    expect(r.marcas.map((m) => m.codigo).sort()).toEqual(["fiat", "honda", "vw"]);
  });

  it("modeloBaseNome 'Gol' restringe as localizações às do Gol", () => {
    const r = computeAvailableFilters(dados, { modeloBaseNome: "Gol" }, catalogo);
    expect(r.localizacoes).toEqual([{ cidade: "São Paulo", estado: "SP" }]);
    expect(r.marcas.map((m) => m.codigo)).toEqual(["vw"]);
  });

  it("localização SP restringe marcas (apenas VW tem anúncio em SP)", () => {
    const r = computeAvailableFilters(dados, { cidade: "São Paulo", estado: "SP" }, catalogo);
    expect(r.marcas.map((m) => m.codigo)).toEqual(["vw"]);
    expect(r.marcas.map((m) => m.codigo)).not.toContain("honda");
  });

  it("faixa de preço afeta as facetas (até 50k tira o Polo, Argo fica por ser 45k)", () => {
    const r = computeAvailableFilters(dados, { precoMax: 50000 }, catalogo);
    expect(r.modelos.map((m) => m.codigo)).not.toContain("polo");
    expect(r.modelos.map((m) => m.codigo).sort()).toEqual(["argo", "cg", "gol"]);
  });

  it("opcional 'abs' restringe para anúncios que o têm, mantendo a lista de opcionais coocorrentes", () => {
    const r = computeAvailableFilters(dados, { opcionais: ["abs"] }, catalogo);
    expect(r.marcas.map((m) => m.codigo)).toEqual(["vw"]);
    expect(r.opcionais.map((o) => o.codigo).sort()).toEqual(["abs", "ar"]);
  });
});
