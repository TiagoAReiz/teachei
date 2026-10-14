import municipios from "@/backend/anuncio/domain/data/municipios.json";

// Cada item: [nome, uf, latitude, longitude] (fonte: IBGE)
type Municipio = [string, string, number, number];

const EARTH_RADIUS_KM = 6371;

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

const indice = new Map<string, { lat: number; lng: number }>();
for (const [nome, uf, lat, lng] of municipios as Municipio[]) {
  indice.set(`${normalizar(nome)}|${uf.toUpperCase()}`, { lat, lng });
}

export interface Localizacao {
  cidade: string;
  estado: string;
}

export const GeoService = {
  coordenadas(cidade: string, estado: string): { lat: number; lng: number } | null {
    return indice.get(`${normalizar(cidade)}|${estado.toUpperCase()}`) ?? null;
  },

  distanciaKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
    const rad = (g: number) => (g * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
  },

  /** Das localizações candidatas, as que estão a até `raioKm` do centro (inclui o próprio centro). */
  dentroDoRaio(centro: Localizacao, raioKm: number, candidatas: Localizacao[]): Localizacao[] {
    const origem = GeoService.coordenadas(centro.cidade, centro.estado);
    if (!origem) return [centro];
    const resultado = candidatas.filter((c) => {
      const destino = GeoService.coordenadas(c.cidade, c.estado);
      return destino !== null && GeoService.distanciaKm(origem, destino) <= raioKm;
    });
    const jaTemCentro = resultado.some(
      (c) => normalizar(c.cidade) === normalizar(centro.cidade) && c.estado === centro.estado
    );
    return jaTemCentro ? resultado : [centro, ...resultado];
  },
};
