import { supabase } from "@/ap/shared/db/supabase";
import type { PerfilRepositoryPort } from "@/ap/perfil/application/ports/out/PerfilRepositoryPort";
import type { Perfil, AtualizarPerfilInput } from "@/ap/perfil/domain/model/Perfil";

function toPerfil(row: Record<string, unknown>): Perfil {
  return {
    id: row.id as string,
    usuarioId: row.usuario_id as string,
    nome: row.nome as string,
    bio: row.bio as string | undefined,
    fotoUrl: row.foto_url as string | undefined,
    whatsapp: row.whatsapp as string | undefined,
    instagram: row.instagram as string | undefined,
    facebook: row.facebook as string | undefined,
    cidade: row.cidade as string | undefined,
    estado: row.estado as string | undefined,
    role: (row.role as "BUYER" | "SELLER") ?? "BUYER",
    avaliacaoMedia: 0,
    totalAvaliacoes: 0,
    criadoEm: row.criado_em as string,
  };
}

export class PerfilSupabaseAdapter implements PerfilRepositoryPort {
  async findByUsuarioId(usuarioId: string): Promise<Perfil | null> {
    const { data } = await supabase.from("perfis").select("*").eq("usuario_id", usuarioId).single();
    return data ? toPerfil(data) : null;
  }

  async findById(id: string): Promise<Perfil | null> {
    const { data } = await supabase.from("perfis").select("*").eq("id", id).single();
    return data ? toPerfil(data) : null;
  }

  async save(usuarioId: string, nome: string): Promise<Perfil> {
    const { data, error } = await supabase.from("perfis").insert({ usuario_id: usuarioId, nome }).select().single();
    if (error) throw new Error(error.message);
    return toPerfil(data);
  }

  async update(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil> {
    const patch: Record<string, unknown> = {};
    if (data.nome !== undefined) patch.nome = data.nome;
    if (data.bio !== undefined) patch.bio = data.bio;
    if (data.fotoUrl !== undefined) patch.foto_url = data.fotoUrl ?? null;
    if (data.whatsapp !== undefined) patch.whatsapp = data.whatsapp;
    if (data.instagram !== undefined) patch.instagram = data.instagram;
    if (data.facebook !== undefined) patch.facebook = data.facebook;
    if (data.cidade !== undefined) patch.cidade = data.cidade;
    if (data.estado !== undefined) patch.estado = data.estado;
    if (data.role !== undefined) patch.role = data.role;

    const { data: row, error } = await supabase.from("perfis").update(patch).eq("usuario_id", usuarioId).select().single();
    if (error) throw new Error(error.message);
    return toPerfil(row);
  }

  async delete(usuarioId: string): Promise<void> {
    await supabase.from("perfis").delete().eq("usuario_id", usuarioId);
  }
}
