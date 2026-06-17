# Filtros Facetados Encadeados — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer cada filtro do feed mostrar apenas opções compatíveis com todas as outras seleções ativas (facetado total, com auto-exclusão por faceta).

**Architecture:** A regra de facetamento vira uma função de domínio pura (`computeAvailableFilters`), testada com Vitest. O adapter Supabase só carrega os anúncios `ATIVO` + catálogo de opcionais e delega à função. Porta, use case e handler passam a transportar um objeto `FiltroSelecao` completo. No front, o `FilterSidebar` usa um único fetch baseado no estado local e passa a tirar a localização da faceta.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Supabase JS, TanStack Query, Vitest.

---

## Nota sobre git

Há edições de UI desta sessão ainda não commitadas (`components/layout/header.tsx`, `app/(main)/profile/page.tsx`, `components/layout/mobile-nav.tsx`) que **não** fazem parte desta feature. Cada `git add` abaixo lista caminhos explícitos — não use `git add -A` para não misturar essas mudanças. Antes do primeiro commit, crie a branch de feature:

```bash
git checkout -b feat/filtros-facetados
```

(As edições de UI não commitadas vão junto para a branch; isso é esperado e podem ser commitadas à parte depois.)

## File Structure

- **Create** `backend/anuncio/domain/model/FiltroSelecao.ts` — tipo `FiltroSelecao` (entrada das facetas). Vive no domínio para ser compartilhado por porta, use case e service sem ciclo.
- **Create** `backend/anuncio/domain/service/FiltroFacetService.ts` — função pura `computeAvailableFilters(anuncios, selecao, opcionaisCatalog)`.
- **Create** `backend/anuncio/domain/service/FiltroFacetService.test.ts` — testes Vitest da função pura.
- **Modify** `backend/anuncio/application/ports/out/AnuncioRepositoryPort.ts` — assinatura `getAvailableFilters(selecao: FiltroSelecao)`.
- **Modify** `backend/anuncio/application/ports/in/BuscarFiltrosUseCase.ts` — `execute(selecao: FiltroSelecao)`.
- **Modify** `backend/anuncio/application/usecase/BuscarFiltrosUseCaseImpl.ts` — repassa `selecao`.
- **Modify** `backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts` — carrega dados e chama `computeAvailableFilters`.
- **Modify** `backend/anuncio/web/handler.ts` — `handleFiltros` lê todos os parâmetros.
- **Modify** `lib/intentions.ts` — `getAvailableFilters(selecao)` serializa todos os campos.
- **Modify** `hooks/use-intentions.ts` — `useAvailableFilters(selecao)`.
- **Modify** `components/intentions/filter-sidebar.tsx` — fetch único, localização via faceta, saneamento.

---

## Task 1: Função pura de facetamento (`computeAvailableFilters`)

**Files:**
- Create: `backend/anuncio/domain/model/FiltroSelecao.ts`
- Create: `backend/anuncio/domain/service/FiltroFacetService.ts`
- Test: `backend/anuncio/domain/service/FiltroFacetService.test.ts`

- [ ] **Step 1: Criar o tipo `FiltroSelecao`**

Create `backend/anuncio/domain/model/FiltroSelecao.ts`:

```ts
import type { TipoVeiculo } from "./Anuncio";

export interface FiltroSelecao {
  tipo?: TipoVeiculo;
  marcaCodigo?: string;
  modeloBaseNome?: string; // nome base do modelo (ex.: "Gol") — usado nas facetas
  modelos?: string[];      // códigos de versão (usado pela listagem; opcional aqui)
  modeloCodigo?: string;   // versão específica
  cidade?: string;
  estado?: string;
  opcionais?: string[];
  precoMin?: number;
  precoMax?: number;
  anoMin?: number;
  anoMax?: number;
  kmMin?: number;
  kmMax?: number;
}
```

- [ ] **Step 2: Escrever os testes (falhando)**

Create `backend/anuncio/domain/service/FiltroFacetService.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { computeAvailableFilters } from "./FiltroFacetService";
import type { Anuncio } from "../model/Anuncio";

type Partial0 = Partial<Anuncio["veiculo"]> & Partial<Anuncio["contato"]>;

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
  anuncio({ tipo: "CARRO", marcaCodigo: "fiat", marcaNome: "Fiat", modeloCodigo: "argo", modeloNome: "Argo", precoMaximo: 60000, cidade: "São Paulo", estado: "SP", opcionais: [] }),
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
    // opcional só de MOTO some; "ar" (todos) e "abs" (CARRO) ficam
    expect(r.opcionais.map((o) => o.codigo).sort()).toEqual(["abs", "ar"]);
  });

  it("marca VW restringe os modelos a Gol e Polo", () => {
    const r = computeAvailableFilters(dados, { marcaCodigo: "vw" }, catalogo);
    expect(r.modelos.map((m) => m.codigo).sort()).toEqual(["gol", "polo"]);
  });

  it("auto-exclusão: com marca VW, a faceta de marcas ainda lista Fiat", () => {
    const r = computeAvailableFilters(dados, { marcaCodigo: "vw" }, catalogo);
    expect(r.marcas.map((m) => m.codigo).sort()).toEqual(["fiat", "vw"]);
  });

  it("modeloBaseNome 'Gol' restringe as localizações às do Gol", () => {
    const r = computeAvailableFilters(dados, { modeloBaseNome: "Gol" }, catalogo);
    expect(r.localizacoes).toEqual([{ cidade: "São Paulo", estado: "SP" }]);
    expect(r.marcas.map((m) => m.codigo)).toEqual(["vw"]);
  });

  it("localização SP restringe marcas (sem Honda de PE)", () => {
    const r = computeAvailableFilters(dados, { cidade: "São Paulo", estado: "SP" }, catalogo);
    expect(r.marcas.map((m) => m.codigo).sort()).toEqual(["fiat", "vw"]);
  });

  it("faixa de preço afeta as facetas (até 50k tira o Polo)", () => {
    const r = computeAvailableFilters(dados, { precoMax: 50000 }, catalogo);
    expect(r.modelos.map((m) => m.codigo)).not.toContain("polo");
    expect(r.modelos.map((m) => m.codigo).sort()).toEqual(["argo", "cg", "gol"]);
  });

  it("opcional 'abs' restringe para anúncios que o têm, mantendo a lista de opcionais coocorrentes", () => {
    const r = computeAvailableFilters(dados, { opcionais: ["abs"] }, catalogo);
    expect(r.marcas.map((m) => m.codigo)).toEqual(["vw"]);
    // auto-exclusão: 'abs' continua disponível para desmarcar, e 'ar' coocorre
    expect(r.opcionais.map((o) => o.codigo).sort()).toEqual(["abs", "ar"]);
  });
});
```

- [ ] **Step 3: Rodar os testes e confirmar que falham**

Run: `npx vitest run backend/anuncio/domain/service/FiltroFacetService.test.ts`
Expected: FAIL com "Failed to resolve import ./FiltroFacetService" (arquivo ainda não existe).

- [ ] **Step 4: Implementar `computeAvailableFilters`**

Create `backend/anuncio/domain/service/FiltroFacetService.ts`:

```ts
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

  // Opcionais presentes nos anúncios compatíveis (auto-excluindo o filtro de opcionais)
  const presentes = new Set<string>();
  for (const a of aplicar(anuncios, selecao, "opcionais")) {
    for (const o of a.veiculo.opcionais ?? []) presentes.add(o);
  }
  const opcionais = opcionaisCatalog
    .filter((op) => !selecao.tipo || op.tipos.length === 0 || op.tipos.includes(selecao.tipo))
    .filter((op) => presentes.has(op.codigo))
    .map((op) => ({ codigo: op.codigo, label: op.label }));

  return {
    tipos,
    marcas: [...marcaMap.values()],
    modelos: [...modeloMap.values()],
    opcionais,
    localizacoes: [...locMap.values()],
  };
}
```

- [ ] **Step 5: Rodar os testes e confirmar que passam**

Run: `npx vitest run backend/anuncio/domain/service/FiltroFacetService.test.ts`
Expected: PASS (todos os casos).

- [ ] **Step 6: Commit**

```bash
git checkout -b feat/filtros-facetados   # pular se a branch já existir
git add backend/anuncio/domain/model/FiltroSelecao.ts backend/anuncio/domain/service/FiltroFacetService.ts backend/anuncio/domain/service/FiltroFacetService.test.ts
git commit -m "feat: função pura de facetamento de filtros com testes"
```

---

## Task 2: Atualizar porta e use case para `FiltroSelecao`

**Files:**
- Modify: `backend/anuncio/application/ports/out/AnuncioRepositoryPort.ts:52`
- Modify: `backend/anuncio/application/ports/in/BuscarFiltrosUseCase.ts`
- Modify: `backend/anuncio/application/usecase/BuscarFiltrosUseCaseImpl.ts`

- [ ] **Step 1: Atualizar a porta de saída**

Em `AnuncioRepositoryPort.ts`, adicionar o import e trocar a assinatura:

```ts
import type { FiltroSelecao } from "@/backend/anuncio/domain/model/FiltroSelecao";
```

```ts
  getAvailableFilters(selecao: FiltroSelecao): Promise<AvailableFilters>;
```

(remove a antiga `getAvailableFilters(tipo?, marcaCodigo?)`.)

- [ ] **Step 2: Atualizar a porta de entrada**

Substituir todo o conteúdo de `BuscarFiltrosUseCase.ts`:

```ts
import type { AvailableFilters } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { FiltroSelecao } from "@/backend/anuncio/domain/model/FiltroSelecao";

export interface BuscarFiltrosUseCase {
  execute(selecao: FiltroSelecao): Promise<AvailableFilters>;
}
```

- [ ] **Step 3: Atualizar a implementação do use case**

Substituir todo o conteúdo de `BuscarFiltrosUseCaseImpl.ts`:

```ts
import type { BuscarFiltrosUseCase } from "@/backend/anuncio/application/ports/in/BuscarFiltrosUseCase";
import type { AvailableFilters, AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { FiltroSelecao } from "@/backend/anuncio/domain/model/FiltroSelecao";

export class BuscarFiltrosUseCaseImpl implements BuscarFiltrosUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  execute(selecao: FiltroSelecao): Promise<AvailableFilters> {
    return this.repo.getAvailableFilters(selecao);
  }
}
```

- [ ] **Step 4: Verificar tipos (vai falhar no adapter/handler — esperado até as Tasks 3 e 4)**

Run: `npx tsc --noEmit`
Expected: erros restantes apenas em `AnuncioSupabaseAdapter.ts` (assinatura antiga) e `handler.ts` (chamada antiga). Sem erros nos três arquivos desta task.

- [ ] **Step 5: Commit**

```bash
git add backend/anuncio/application/ports/out/AnuncioRepositoryPort.ts backend/anuncio/application/ports/in/BuscarFiltrosUseCase.ts backend/anuncio/application/usecase/BuscarFiltrosUseCaseImpl.ts
git commit -m "refactor: porta de filtros passa a receber FiltroSelecao"
```

---

## Task 3: Adapter delega para `computeAvailableFilters`

**Files:**
- Modify: `backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts:126-160`

- [ ] **Step 1: Adicionar imports no topo do arquivo**

```ts
import { computeAvailableFilters } from "@/backend/anuncio/domain/service/FiltroFacetService";
import type { FiltroSelecao } from "@/backend/anuncio/domain/model/FiltroSelecao";
```

- [ ] **Step 2: Reescrever `getAvailableFilters`**

Substituir o método inteiro (linhas ~126-160) por:

```ts
  async getAvailableFilters(selecao: FiltroSelecao): Promise<AvailableFilters> {
    const [anunciosResult, opcionaisResult] = await Promise.all([
      supabase.from("anuncios").select("*").eq("status", "ATIVO"),
      supabase.from("opcionais").select("codigo, label, tipos").eq("ativo", true).order("ordem"),
    ]);

    const anuncios = (anunciosResult.data ?? []).map(toAnuncio);
    const catalogo = (opcionaisResult.data ?? []).map((op) => ({
      codigo: op.codigo as string,
      label: op.label as string,
      tipos: (op.tipos ?? []) as string[],
    }));

    return computeAvailableFilters(anuncios, selecao, catalogo);
  }
```

Nota: passamos a usar `select("*")` para que `toAnuncio` receba todos os campos (`id`, `usuario_id`, etc.) que ele lê.

- [ ] **Step 3: Rodar os testes da função pura (continuam verdes)**

Run: `npx vitest run backend/anuncio/domain/service/FiltroFacetService.test.ts`
Expected: PASS.

- [ ] **Step 4: Verificar tipos (resta só o handler)**

Run: `npx tsc --noEmit`
Expected: erro restante apenas em `handler.ts` (chamada `execute(tipo, marcaCodigo)`).

- [ ] **Step 5: Commit**

```bash
git add backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter.ts
git commit -m "feat: adapter de filtros usa cálculo facetado em memória"
```

---

## Task 4: Handler lê todos os filtros da query string

**Files:**
- Modify: `backend/anuncio/web/handler.ts:132-140`

- [ ] **Step 1: Reescrever `handleFiltros`**

Substituir a função `handleFiltros` por:

```ts
export async function handleFiltros(req: Request): Promise<Response> {
  try {
    const p = new URL(req.url).searchParams;
    const modelosCsv = p.get("modelos");
    const selecao = {
      tipo: (p.get("tipo") as TipoVeiculo | null) || undefined,
      marcaCodigo: p.get("marcaCodigo") || undefined,
      modeloBaseNome: p.get("modeloBaseNome") || undefined,
      modeloCodigo: p.get("modeloCodigo") || undefined,
      modelos: modelosCsv ? modelosCsv.split(",").filter(Boolean) : undefined,
      cidade: p.get("cidade") || undefined,
      estado: p.get("estado") || undefined,
      opcionais: p.getAll("opcionais").filter(Boolean),
      precoMin: p.get("precoMin") ? Number(p.get("precoMin")) : undefined,
      precoMax: p.get("precoMax") ? Number(p.get("precoMax")) : undefined,
      anoMin: p.get("anoMin") ? Number(p.get("anoMin")) : undefined,
      anoMax: p.get("anoMax") ? Number(p.get("anoMax")) : undefined,
      kmMin: p.get("kmMin") ? Number(p.get("kmMin")) : undefined,
      kmMax: p.get("kmMax") ? Number(p.get("kmMax")) : undefined,
    };
    const result = await new BuscarFiltrosUseCaseImpl(makeRepo()).execute(selecao);
    return Response.json(result);
  } catch (e) { return err(e); }
}
```

Nota: `opcionais` é lido com `getAll` (o front envia um parâmetro repetido, igual à listagem). Se vazio, vira `[]`, que o predicado trata como "sem filtro".

- [ ] **Step 2: Verificar tipos (sem erros)**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: sem erros novos.

- [ ] **Step 4: Commit**

```bash
git add backend/anuncio/web/handler.ts
git commit -m "feat: endpoint de filtros aceita todos os filtros ativos"
```

---

## Task 5: `lib/intentions.getAvailableFilters` envia a seleção completa

**Files:**
- Modify: `lib/intentions.ts:116-138`

- [ ] **Step 1: Reescrever `getAvailableFilters`**

Substituir a função por (mantendo o mesmo import de `IntentionFilters` já presente no topo):

```ts
export type FiltroSelecaoRequest = IntentionFilters & { modeloBaseNome?: string };

export async function getAvailableFilters(
  selecao: FiltroSelecaoRequest = {}
): Promise<AvailableFilters> {
  const params = new URLSearchParams();

  if (selecao.tipoVeiculo) params.append("tipo", selecao.tipoVeiculo);
  if (selecao.marcaCodigo) params.append("marcaCodigo", selecao.marcaCodigo);
  if (selecao.modeloBaseNome) params.append("modeloBaseNome", selecao.modeloBaseNome);
  if (selecao.modeloCodigo) params.append("modeloCodigo", selecao.modeloCodigo);
  if (selecao.modelos && selecao.modelos.length > 0) {
    params.append("modelos", selecao.modelos.join(","));
  }
  if (selecao.cidade) params.append("cidade", selecao.cidade);
  if (selecao.estado) params.append("estado", selecao.estado);
  if (selecao.opcionais && selecao.opcionais.length > 0) {
    selecao.opcionais.forEach((o) => params.append("opcionais", o));
  }
  if (selecao.precoMin !== undefined) params.append("precoMin", selecao.precoMin.toString());
  if (selecao.precoMax !== undefined) params.append("precoMax", selecao.precoMax.toString());
  if (selecao.anoMin !== undefined) params.append("anoMin", selecao.anoMin.toString());
  if (selecao.anoMax !== undefined) params.append("anoMax", selecao.anoMax.toString());
  if (selecao.kmMin !== undefined) params.append("kmMin", selecao.kmMin.toString());
  if (selecao.kmMax !== undefined) params.append("kmMax", selecao.kmMax.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${API_ENDPOINTS.INTENTION_FILTERS}?${queryString}`
    : API_ENDPOINTS.INTENTION_FILTERS;

  const data = await api.get<AvailableFilters>(url, { requireAuth: false });
  if (!data.localizacoes) data.localizacoes = [];
  return data;
}
```

Nota: a assinatura usa `IntentionFilters` (já existente em `types`) acrescido de `modeloBaseNome` (que não existe em `IntentionFilters`), via `FiltroSelecaoRequest`. O parâmetro `tipo` no backend mapeia para `tipoVeiculo` aqui. Exportar `FiltroSelecaoRequest` para o hook reutilizar.

- [ ] **Step 2: Verificar tipos (vai falhar no hook — esperado até a Task 6)**

Run: `npx tsc --noEmit`
Expected: erro apenas em `hooks/use-intentions.ts` (chamada antiga `getAvailableFilters(tipo, marcaCodigo)`).

- [ ] **Step 3: Commit**

```bash
git add lib/intentions.ts
git commit -m "feat: getAvailableFilters envia seleção completa de filtros"
```

---

## Task 6: `useAvailableFilters(selecao)`

**Files:**
- Modify: `hooks/use-intentions.ts:140-150`

- [ ] **Step 1: Reescrever o hook**

Substituir `useAvailableFilters` por:

```ts
export function useAvailableFilters(selecao: FiltroSelecaoRequest = {}) {
  return useQuery({
    queryKey: ["intentions", "filters", selecao],
    queryFn: () => getAvailableFilters(selecao),
    staleTime: 60 * 1000,
    retry: 2,
  });
}
```

Adicionar `FiltroSelecaoRequest` ao import de `@/lib/intentions` no topo do arquivo (junto com `getAvailableFilters`). O objeto `selecao` na `queryKey` faz o React Query refazer o fetch sempre que qualquer filtro muda.

- [ ] **Step 2: Verificar tipos (vai falhar no FilterSidebar — esperado até a Task 7)**

Run: `npx tsc --noEmit`
Expected: erro apenas em `components/intentions/filter-sidebar.tsx` (duas chamadas antigas de `useAvailableFilters`).

- [ ] **Step 3: Commit**

```bash
git add hooks/use-intentions.ts
git commit -m "refactor: useAvailableFilters recebe a seleção completa"
```

---

## Task 7: `FilterSidebar` — fetch único, localização via faceta, saneamento

**Files:**
- Modify: `components/intentions/filter-sidebar.tsx`

- [ ] **Step 1: Trocar os dois fetches por um único, baseado no estado local**

Em `filter-sidebar.tsx`, substituir o bloco dos dois `useAvailableFilters` + o `useAvailableLocations` (linhas ~54-67) por:

```ts
  // Monta a seleção atual (estado local do painel) para o cálculo facetado.
  // O modelo é enviado por NOME BASE (filters.modelo), não por códigos — assim
  // não dependemos de groupedModels (que vem do próprio fetch), evitando ciclo.
  const selecao: FiltroSelecaoRequest = useMemo(() => ({
    tipoVeiculo: filters.tipo || undefined,
    marcaCodigo: filters.marca || undefined,
    modeloBaseNome: filters.versao ? undefined : (filters.modelo || undefined),
    modeloCodigo: filters.versao || undefined,
    cidade: filters.cidade || undefined,
    estado: filters.estado || undefined,
    opcionais: filters.opcionais.length > 0 ? filters.opcionais : undefined,
    precoMin: filters.precoMin ?? undefined,
    precoMax: filters.precoMax ?? undefined,
    anoMin: filters.anoMin ?? undefined,
    anoMax: filters.anoMax ?? undefined,
    kmMin: filters.kmMin ?? undefined,
    kmMax: filters.kmMax ?? undefined,
  }), [filters]);

  const { data: availableFilters, isLoading: isLoadingFilters } = useAvailableFilters(selecao);
  const isLoadingFilteredOptions = isLoadingFilters;
  const filteredOptions = availableFilters;
```

`selecao` depende apenas de `filters` (estado local), sem `groupedModels` — não há dependência circular. Pode ficar logo após o `useState`/`useEffect` iniciais (antes das derivações). Importar `FiltroSelecaoRequest` de `@/lib/intentions`. As derivações existentes (`availableTypes`, `marcaOptions`, `groupedModels`, etc.) continuam lendo `availableFilters`/`filteredOptions` normalmente.

- [ ] **Step 2: Remover o import e o uso de `useAvailableLocations`**

- Trocar o import (linha ~6):

```ts
import { useAvailableFilters } from "@/hooks/use-intentions";
```

- Remover a linha do `useAvailableLocations`.

- Reescrever `localizacaoOptions` (linhas ~96-108) para usar só a faceta:

```ts
  const localizacaoOptions = useMemo(() => {
    const locs = availableFilters?.localizacoes;
    if (!locs || locs.length === 0) return [];
    return [
      { value: "", label: "Todas as localizações" },
      ...locs.map((loc) => ({
        value: `${loc.cidade}|${loc.estado}`,
        label: `${loc.cidade} - ${loc.estado}`,
      })),
    ];
  }, [availableFilters]);
```

- [ ] **Step 3: Simplificar `opcionaisDisponiveis`**

Como a faceta de opcionais já vem restrita pelo backend, substituir (linhas ~185-191) por:

```ts
  const opcionaisDisponiveis: AvailableOpcional[] = availableFilters?.opcionais ?? [];
```

E no bloco de loading dos opcionais (linha ~427), trocar `(filters.tipo ? isLoadingFilteredOptions : isLoadingFilters)` por apenas `isLoadingFilters`.

- [ ] **Step 4: Sanear seleções órfãs quando as facetas mudam**

Adicionar, depois das declarações de `marcaOptions`, `modeloOptions` e `localizacaoOptions`, um efeito que limpa seleções que deixaram de existir:

```ts
  // Limpa seleções que não existem mais nas facetas (ex.: troquei o tipo e a
  // marca/localização anterior sumiu). Roda só quando há opções carregadas.
  useEffect(() => {
    if (!availableFilters) return;
    setFilters((prev) => {
      let changed = false;
      const next = { ...prev };
      if (next.marca && !availableFilters.marcas.some((m) => m.codigo === next.marca)) {
        next.marca = ""; next.modelo = ""; next.versao = ""; changed = true;
      }
      if (next.cidade && next.estado &&
          !availableFilters.localizacoes.some((l) => l.cidade === next.cidade && l.estado === next.estado)) {
        next.cidade = ""; next.estado = ""; changed = true;
      }
      if (next.opcionais.length > 0) {
        const validos = next.opcionais.filter((o) => availableFilters.opcionais.some((op) => op.codigo === o));
        if (validos.length !== next.opcionais.length) { next.opcionais = validos; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [availableFilters]);
```

`useEffect` já está importado (linha 3). O guard `changed ? next : prev` evita loop de render.

- [ ] **Step 5: Verificar tipos e lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sem erros.

- [ ] **Step 6: Teste manual no navegador**

Run: `npm run dev` e abrir `/feed`. Verificar (com DevTools → Network → filtro `filtros`):
- Selecionar tipo "Carros" → marcas/modelos/localizações/opcionais só de carros; dispara novo GET `/api/v1/anuncios/filtros?tipo=CARRO`.
- Selecionar marca → modelos restringem àquela marca; lista de marcas continua mostrando as outras.
- Selecionar localização primeiro → marcas/modelos restringem àquela localização.
- Selecionar opcional → demais facetas restringem; opcional segue desmarcável.

Expected: cada mudança refaz o GET com os parâmetros acumulados e as listas refletem o encadeamento.

- [ ] **Step 7: Commit**

```bash
git add components/intentions/filter-sidebar.tsx
git commit -m "feat: painel de filtros facetado com encadeamento total"
```

---

## Self-Review (preenchido pelo autor do plano)

- **Cobertura do spec:** seção 1 (FiltroSelecao) → Task 1; seção 2 (adapter/predicados/auto-exclusão) → Tasks 1 e 3; seção 3 (porta/use case/handler) → Tasks 2 e 4; seção 4 (lib) → Task 5; seção 5 (hook) → Task 6; seção 6 (FilterSidebar/localização/saneamento) → Task 7. Tudo coberto.
- **Auto-exclusão:** garantida pela função `aplicar(..., except)` e testada (`marca VW ainda lista Fiat`, `opcional abs mantém abs`).
- **Consistência de tipos:** `FiltroSelecao` (domínio) usado em porta/use case/adapter; `IntentionFilters` (front/types) usado em lib/hook/sidebar — o handler faz a ponte (`tipo` ⇄ `tipoVeiculo`). `computeAvailableFilters(anuncios, selecao, opcionaisCatalog)` tem a mesma assinatura na definição (Task 1) e na chamada (Task 3).
- **Sem placeholders:** todos os passos têm código/ível/comando concretos.

## Observação de risco

O `useEffect` de saneamento (Task 7, Step 4) e o `useMemo` de `selecao` dependem de `groupedModels`/`availableFilters`; ao reordenar declarações no arquivo, garanta que cada hook seja declarado **antes** de quem o consome (regra de hooks do React não exige ordem de definição de variáveis, mas a referência a `groupedModels` dentro de `selecao` exige que `groupedModels` já esteja no escopo). Rodar `npx tsc --noEmit` pega qualquer "used before declaration".
