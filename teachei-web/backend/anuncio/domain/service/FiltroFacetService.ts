import type { Anuncio } from "../model/Anuncio";
import type { FiltroSelecao } from "../model/FiltroSelecao";
import type { AvailableFilters } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";

export interface OpcionalCatalogItem {
  codigo: string;
  label: string;
  tipos: string[]; // vazio = todos os tipos
}

type Dimensao = "tipo" | "marca" | "modelo" | "local" | "opcionais";

function modeloCodigos(s: FiltroSelecao): string[] {
  if (s.modelos && s.modelos.length > 0) return s.modelos;
  if (s.modeloCodigo) return [s.modeloCodigo];
  return [];
}

function baseNomeDe(a: Anuncio): string | undefined {
  return a.veiculo.modeloBaseNome ?? a.veiculo.modeloNome;
}

function matchTipo(a: Anuncio, s: FiltroSelecao): boolean {
  return !s.tipo || a.tipo === s.tipo;
}
function matchMarca(a: Anuncio, s: FiltroSelecao): boolean {
  return !s.marcaCodigo || a.veiculo.marcaCodigo === s.marcaCodigo;
}
function matchModelo(a: Anuncio, s: FiltroSelecao): boolean {
  const codes = modeloCodigos(s);
  if (codes.length > 0) return !!a.veiculo.modeloCodigo && codes.includes(a.veiculo.modeloCodigo);
  if (s.modeloBaseNome) return baseNomeDe(a) === s.modeloBaseNome;
  return true;
}
function matchLocal(a: Anuncio, s: FiltroSelecao): boolean {
  if (!s.cidade && !s.estado) return true;
  return a.contato.cidade === s.cidade && a.contato.estado === s.estado;
}
function matchOpcionais(a: Anuncio, s: FiltroSelecao): boolean {
  if (!s.opcionais || s.opcionais.length === 0) return true;
  const tem = a.veiculo.opcionais ?? [];
  return s.opcionais.every((o) => tem.includes(o));
}
function matchPreco(a: Anuncio, s: FiltroSelecao): boolean {
  const p = a.veiculo.precoMaximo;
  if (s.precoMin != null && p < s.precoMin) return false;
  if (s.precoMax != null && p > s.precoMax) return false;
  return true;
}
function matchAno(a: Anuncio, s: FiltroSelecao): boolean {
  if (s.anoMin == null && s.anoMax == null) return true;
  return (a.veiculo.anos ?? []).some(
    (y) => (s.anoMin == null || y >= s.anoMin) && (s.anoMax == null || y <= s.anoMax),
  );
}
function matchKm(a: Anuncio, s: FiltroSelecao): boolean {
  const aMin = a.veiculo.quilometragemMinima ?? 0;
  const aMax = a.veiculo.quilometragemMaxima ?? Number.POSITIVE_INFINITY;
  if (s.kmMin != null && aMax < s.kmMin) return false;
  if (s.kmMax != null && aMin > s.kmMax) return false;
  return true;
}

// Aplica todos os predicados EXCETO o da dimensão `except` (auto-exclusão).
// Preço/ano/km não têm faceta de lista própria, então sempre se aplicam.
function aplicar(anuncios: Anuncio[], s: FiltroSelecao, except: Dimensao): Anuncio[] {
  return anuncios.filter(
    (a) =>
      (except === "tipo" || matchTipo(a, s)) &&
      (except === "marca" || matchMarca(a, s)) &&
      (except === "modelo" || matchModelo(a, s)) &&
      (except === "local" || matchLocal(a, s)) &&
      (except === "opcionais" || matchOpcionais(a, s)) &&
      matchPreco(a, s) &&
      matchAno(a, s) &&
      matchKm(a, s),
  );
}

export function computeAvailableFilters(
  anuncios: Anuncio[],
  selecao: FiltroSelecao,
  opcionaisCatalog: OpcionalCatalogItem[],
): AvailableFilters {
  const tipos = [...new Set(aplicar(anuncios, selecao, "tipo").map((a) => a.tipo))];

  const marcaMap = new Map<string, { codigo: string; nome: string }>();
  for (const a of aplicar(anuncios, selecao, "marca")) {
    const { marcaCodigo, marcaNome } = a.veiculo;
    if (marcaCodigo && marcaNome) marcaMap.set(marcaCodigo, { codigo: marcaCodigo, nome: marcaNome });
  }

  const modeloMap = new Map<string, { codigo: string; nome: string; baseNome: string }>();
  for (const a of aplicar(anuncios, selecao, "modelo")) {
    const { modeloCodigo, modeloNome, modeloBaseNome } = a.veiculo;
    if (modeloCodigo && modeloNome) {
      modeloMap.set(modeloCodigo, { codigo: modeloCodigo, nome: modeloNome, baseNome: modeloBaseNome ?? modeloNome });
    }
  }

  const locMap = new Map<string, { cidade: string; estado: string }>();
  for (const a of aplicar(anuncios, selecao, "local")) {
    const { cidade, estado } = a.contato;
    if (cidade && estado) locMap.set(`${cidade}|${estado}`, { cidade, estado });
  }

  // Auto-exclusão por-item: opcional `o` está disponível se existe anúncio que:
  // 1. casa todos os predicados não-opcionais
  // 2. tem todos os opcionais selecionados EXCETO `o`
  // 3. tem `o`
  const selectedOpcionais = selecao.opcionais ?? [];
  const baseMatch = (a: Anuncio) =>
    matchTipo(a, selecao) &&
    matchMarca(a, selecao) &&
    matchModelo(a, selecao) &&
    matchLocal(a, selecao) &&
    matchPreco(a, selecao) &&
    matchAno(a, selecao) &&
    matchKm(a, selecao);

  const opcionais = opcionaisCatalog
    .filter((op) => !selecao.tipo || op.tipos.length === 0 || op.tipos.includes(selecao.tipo))
    .filter((op) => {
      const outrosSelecionados = selectedOpcionais.filter((o) => o !== op.codigo);
      return anuncios.some(
        (a) =>
          baseMatch(a) &&
          outrosSelecionados.every((o) => (a.veiculo.opcionais ?? []).includes(o)) &&
          (a.veiculo.opcionais ?? []).includes(op.codigo),
      );
    })
    .map((op) => ({ codigo: op.codigo, label: op.label }));

  return {
    tipos,
    marcas: [...marcaMap.values()],
    modelos: [...modeloMap.values()],
    opcionais,
    localizacoes: [...locMap.values()],
  };
}
