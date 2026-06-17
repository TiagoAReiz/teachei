import { supabase } from "@/backend/shared/db/supabase";
import type { AnuncioRepositoryPort, AnuncioFilters, PaginatedAnuncios, AvailableFilters } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio, TipoVeiculo } from "@/backend/anuncio/domain/model/Anuncio";

function toAnuncio(row: Record<string, unknown>): Anuncio {
  return {
    id: row.id as string,
    usuarioId: row.usuario_id as string,
    tipo: row.tipo as TipoVeiculo,
    status: row.status as Anuncio["status"],
    veiculo: row.veiculo as Anuncio["veiculo"],
    contato: row.contato as Anuncio["contato"],
    observacoes: row.observacoes as string | undefined,
    criadoEm: row.criado_em as string,
    expiraEm: row.expira_em as string | undefined,
  };
}

export class AnuncioSupabaseAdapter implements AnuncioRepositoryPort {
  async findAll(filters: AnuncioFilters): Promise<PaginatedAnuncios> {
    const page = filters.page ?? 0;
    const size = filters.size ?? 20;
    const from = page * size;
    const to = from + size - 1;

    let query = supabase.from("anuncios").select("*", { count: "exact" });

    if (filters.usuarioId) query = query.eq("usuario_id", filters.usuarioId);
    if (filters.tipoVeiculo) query = query.eq("tipo", filters.tipoVeiculo);
    if (filters.status) query = query.eq("status", filters.status);
    else if (!filters.incluirTodosStatus) query = query.eq("status", "ATIVO");

    const search = filters.search?.trim();
    if (search) {
      const term = search.replace(/[%,()]/g, " ");
      query = query.or(`veiculo->>marcaNome.ilike.%${term}%,veiculo->>modeloNome.ilike.%${term}%`);
    }

    if (filters.cidade) query = query.eq("contato->>cidade", filters.cidade);
    if (filters.estado) query = query.eq("contato->>estado", filters.estado);

    if (filters.marcaCodigo) query = query.eq("veiculo->>marcaCodigo", filters.marcaCodigo);

    if (filters.modeloCodigo) {
      query = query.eq("veiculo->>modeloCodigo", filters.modeloCodigo);
    } else if (filters.modelos && filters.modelos.length > 0) {
      query = query.in("veiculo->>modeloCodigo", filters.modelos);
    }

    if (filters.anoMin !== undefined) {
      query = query.filter("veiculo->anos", "cs", `[${filters.anoMin}]`);
    }

    if (filters.precoMin !== undefined) {
      query = query.filter("veiculo->precoMaximo", "gte", filters.precoMin);
    }
    if (filters.precoMax !== undefined) {
      query = query.filter("veiculo->precoMaximo", "lte", filters.precoMax);
    }

    if (filters.kmMax !== undefined) {
      query = query.filter("veiculo->quilometragemMaxima", "lte", filters.kmMax);
    }
    if (filters.kmMin !== undefined) {
      query = query.filter("veiculo->quilometragemMinima", "gte", filters.kmMin);
    }

    if (filters.opcionais && filters.opcionais.length > 0) {
      query = query.filter("veiculo->opcionais", "cs", JSON.stringify(filters.opcionais));
    }

    const ordenar = filters.ordenar ?? "RECENTE";
    if (ordenar === "RECENTE") query = query.order("criado_em", { ascending: false });
    else if (ordenar === "PRECO_ASC") query = query.order("veiculo->precoMaximo", { ascending: true });
    else if (ordenar === "PRECO_DESC") query = query.order("veiculo->precoMaximo", { ascending: false });

    query = query.range(from, to);
    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const totalElements = count ?? 0;
    const totalPages = Math.ceil(totalElements / size);
    return {
      content: (data ?? []).map(toAnuncio),
      totalElements, totalPages, page, size,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    };
  }

  async findById(id: string): Promise<Anuncio | null> {
    const { data } = await supabase.from("anuncios").select("*").eq("id", id).single();
    return data ? toAnuncio(data) : null;
  }

  async findByUsuarioId(usuarioId: string): Promise<Anuncio[]> {
    const { data } = await supabase.from("anuncios").select("*").eq("usuario_id", usuarioId).order("criado_em", { ascending: false });
    return (data ?? []).map(toAnuncio);
  }

  async save(data: Omit<Anuncio, "id" | "criadoEm">): Promise<Anuncio> {
    const { data: row, error } = await supabase.from("anuncios").insert({
      usuario_id: data.usuarioId, tipo: data.tipo, status: data.status,
      veiculo: data.veiculo, contato: data.contato,
      observacoes: data.observacoes ?? null, expira_em: data.expiraEm ?? null,
    }).select().single();
    if (error) throw new Error(error.message);
    return toAnuncio(row);
  }

  async update(id: string, data: Partial<Anuncio>): Promise<Anuncio> {
    const patch: Record<string, unknown> = {};
    if (data.status) patch.status = data.status;
    if (data.veiculo) patch.veiculo = data.veiculo;
    if (data.contato) patch.contato = data.contato;
    if (data.observacoes !== undefined) patch.observacoes = data.observacoes;

    const { data: row, error } = await supabase.from("anuncios").update(patch).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return toAnuncio(row);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("anuncios").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async getAvailableFilters(tipo?: TipoVeiculo): Promise<AvailableFilters> {
    let anunciosQuery = supabase.from("anuncios").select("tipo, veiculo, contato").eq("status", "ATIVO");
    if (tipo) anunciosQuery = anunciosQuery.eq("tipo", tipo);

    const [anunciosResult, opcionaisResult] = await Promise.all([
      anunciosQuery,
      supabase.from("opcionais").select("codigo, label, tipos").eq("ativo", true).order("ordem"),
    ]);

    const rows = anunciosResult.data ?? [];
    const tipos = [...new Set(rows.map((r) => r.tipo))] as TipoVeiculo[];
    const marcaMap = new Map<string, { codigo: string; nome: string }>();
    const modeloMap = new Map<string, { codigo: string; nome: string; baseNome: string }>();
    const locMap = new Map<string, { cidade: string; estado: string }>();

    for (const r of rows) {
      const v = r.veiculo as Anuncio["veiculo"];
      const c = r.contato as Anuncio["contato"];
      if (v.marcaCodigo && v.marcaNome) marcaMap.set(v.marcaCodigo, { codigo: v.marcaCodigo, nome: v.marcaNome });
      if (v.modeloCodigo && v.modeloNome) modeloMap.set(v.modeloCodigo, { codigo: v.modeloCodigo, nome: v.modeloNome, baseNome: v.modeloBaseNome ?? v.modeloNome });
      if (c.cidade && c.estado) locMap.set(`${c.cidade}|${c.estado}`, { cidade: c.cidade, estado: c.estado });
    }

    const opcionais = (opcionaisResult.data ?? [])
      .filter(op => !tipo || op.tipos.length === 0 || op.tipos.includes(tipo))
      .map(op => ({ codigo: op.codigo, label: op.label }));

    return {
      tipos,
      marcas: [...marcaMap.values()],
      modelos: [...modeloMap.values()],
      opcionais,
      localizacoes: [...locMap.values()],
    };
  }
}
