import { describe, it, expect } from "vitest";
import { GeoService } from "@/backend/anuncio/domain/service/GeoService";

describe("GeoService", () => {
  it("acha coordenadas ignorando acento e caixa", () => {
    expect(GeoService.coordenadas("sao paulo", "SP")).not.toBeNull();
    expect(GeoService.coordenadas("Cidade Inexistente", "SP")).toBeNull();
  });

  it("calcula distância São Paulo–Rio em torno de 360 km", () => {
    const sp = GeoService.coordenadas("São Paulo", "SP")!;
    const rj = GeoService.coordenadas("Rio de Janeiro", "RJ")!;
    const d = GeoService.distanciaKm(sp, rj);
    expect(d).toBeGreaterThan(340);
    expect(d).toBeLessThan(380);
  });

  it("filtra candidatas pelo raio e sempre inclui o centro", () => {
    const candidatas = [
      { cidade: "Campinas", estado: "SP" },
      { cidade: "Rio de Janeiro", estado: "RJ" },
    ];
    const r = GeoService.dentroDoRaio({ cidade: "São Paulo", estado: "SP" }, 150, candidatas);
    expect(r.map((c) => c.cidade)).toEqual(["São Paulo", "Campinas"]);
  });

  it("centro desconhecido devolve só o centro", () => {
    const centro = { cidade: "Xyz", estado: "SP" };
    expect(GeoService.dentroDoRaio(centro, 100, [{ cidade: "Campinas", estado: "SP" }])).toEqual([centro]);
  });
});
