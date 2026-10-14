import { supabase } from "@/backend/shared/db/supabase";
import type { AvaliacaoRepositoryPort } from "@/backend/avaliacao/application/ports/out/AvaliacaoRepositoryPort";
import type { Venda, Avaliacao, AvaliacaoComAutor, VendaPendente, Reputacao } from "@/backend/avaliacao/domain/model/Avaliacao";

function toVenda(r: Record<string, unknown>): Venda {
  return {
    id: r.id as string,
    anuncioId: (r.anuncio_id as string | null) ?? null,
    vendedorId: r.vendedor_id as string,
    compradorId: r.comprador_id as string,
    criadoEm: r.criado_em as string,
  };
}

function toAvaliacao(r: Record<string, unknown>): Avaliacao {
  return {
    id: r.id as string,
    vendaId: r.venda_id as string,
    avaliadorId: r.avaliador_id as string,
    avaliadoId: r.avaliado_id as string,
    nota: r.nota as number,
    comentario: (r.comentario as string | null) ?? undefined,
    criadoEm: r.criado_em as string,
  };
}

async function nomesPorUsuario(ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) return new Map();
  const { data } = await supabase.from("perfis").select("usuario_id, nome").in("usuario_id", ids);
  return new Map((data ?? []).map((p) => [p.usuario_id as string, p.nome as string]));
}

export class AvaliacaoSupabaseAdapter implements AvaliacaoRepositoryPort {
  async findVendaByAnuncioVendedor(anuncioId: string, vendedorId: string): Promise<Venda | null> {
    const { data } = await supabase.from("vendas").select("*").eq("anuncio_id", anuncioId).eq("vendedor_id", vendedorId).maybeSingle();
    return data ? toVenda(data) : null;
  }

  async findVendaById(id: string): Promise<Venda | null> {
    const { data } = await supabase.from("vendas").select("*").eq("id", id).maybeSingle();
    return data ? toVenda(data) : null;
  }

  async saveVenda(d: { anuncioId: string; vendedorId: string; compradorId: string }): Promise<Venda> {
    const { data, error } = await supabase.from("vendas").insert({
      anuncio_id: d.anuncioId, vendedor_id: d.vendedorId, comprador_id: d.compradorId,
    }).select().single();
    if (error) throw new Error(error.message);
    return toVenda(data);
  }

  async findAvaliacaoByVenda(vendaId: string): Promise<Avaliacao | null> {
    const { data } = await supabase.from("avaliacoes").select("*").eq("venda_id", vendaId).maybeSingle();
    return data ? toAvaliacao(data) : null;
  }

  async saveAvaliacao(d: Omit<Avaliacao, "id" | "criadoEm">): Promise<Avaliacao> {
    const { data, error } = await supabase.from("avaliacoes").insert({
      venda_id: d.vendaId, avaliador_id: d.avaliadorId, avaliado_id: d.avaliadoId,
      nota: d.nota, comentario: d.comentario ?? null,
    }).select().single();
    if (error) throw new Error(error.message);
    return toAvaliacao(data);
  }

  async findPendentesDoComprador(compradorId: string): Promise<VendaPendente[]> {
    const { data: vendas, error } = await supabase.from("vendas").select("*")
      .eq("comprador_id", compradorId).order("criado_em", { ascending: false });
    if (error) throw new Error(error.message);
    if (!vendas || vendas.length === 0) return [];

    const { data: avaliadas } = await supabase.from("avaliacoes").select("venda_id").in("venda_id", vendas.map((v) => v.id));
    const jaAvaliadas = new Set((avaliadas ?? []).map((a) => a.venda_id as string));
    const pendentes = vendas.filter((v) => !jaAvaliadas.has(v.id as string));
    if (pendentes.length === 0) return [];

    const anuncioIds = pendentes.map((v) => v.anuncio_id as string | null).filter((x): x is string => !!x);
    const [{ data: anuncios }, nomes] = await Promise.all([
      anuncioIds.length ? supabase.from("anuncios").select("id, veiculo").in("id", anuncioIds) : Promise.resolve({ data: [] as { id: string; veiculo: Record<string, unknown> }[] }),
      nomesPorUsuario(pendentes.map((v) => v.vendedor_id as string)),
    ]);
    const veiculos = new Map((anuncios ?? []).map((a) => {
      const v = a.veiculo as { marcaNome?: string; modeloNome?: string };
      return [a.id as string, [v.marcaNome, v.modeloNome].filter(Boolean).join(" ")] as const;
    }));

    return pendentes.map((v) => ({
      vendaId: v.id as string,
      anuncioId: (v.anuncio_id as string | null) ?? null,
      vendedorId: v.vendedor_id as string,
      vendedorNome: nomes.get(v.vendedor_id as string) ?? "Vendedor",
      veiculo: veiculos.get(v.anuncio_id as string) ?? "Veículo",
      criadoEm: v.criado_em as string,
    }));
  }

  async findAvaliacoesDoUsuario(avaliadoId: string, limit: number): Promise<AvaliacaoComAutor[]> {
    const { data, error } = await supabase.from("avaliacoes").select("*")
      .eq("avaliado_id", avaliadoId).order("criado_em", { ascending: false }).limit(limit);
    if (error) throw new Error(error.message);
    const nomes = await nomesPorUsuario([...new Set((data ?? []).map((a) => a.avaliador_id as string))]);
    return (data ?? []).map((a) => ({ ...toAvaliacao(a), avaliadorNome: nomes.get(a.avaliador_id as string) ?? "Comprador" }));
  }

  async getReputacao(avaliadoId: string): Promise<Reputacao> {
    const { data, error } = await supabase.from("avaliacoes").select("nota").eq("avaliado_id", avaliadoId);
    if (error) throw new Error(error.message);
    const notas = (data ?? []).map((r) => r.nota as number);
    if (notas.length === 0) return { media: 0, total: 0 };
    const media = notas.reduce((a, b) => a + b, 0) / notas.length;
    return { media: Math.round(media * 10) / 10, total: notas.length };
  }
}
