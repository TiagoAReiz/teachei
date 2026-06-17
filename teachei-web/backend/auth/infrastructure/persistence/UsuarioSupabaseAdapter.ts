import { supabase } from "@/backend/shared/db/supabase";
import type { UsuarioRepositoryPort } from "@/backend/auth/application/ports/out/UsuarioRepositoryPort";
import type { Usuario } from "@/backend/auth/domain/model/Usuario";

function toUsuario(row: Record<string, unknown>): Usuario {
  return {
    id: row.id as string,
    email: row.email as string,
    senhaHash: (row.senha_hash as string) ?? null,
    googleId: (row.google_id as string) ?? null,
    aceitouTermos: row.aceitou_termos as boolean,
    criadoEm: row.criado_em as string,
  };
}

export class UsuarioSupabaseAdapter implements UsuarioRepositoryPort {
  async findByEmail(email: string): Promise<Usuario | null> {
    const { data } = await supabase.from("usuarios").select("*").eq("email", email).single();
    return data ? toUsuario(data) : null;
  }

  async findById(id: string): Promise<Usuario | null> {
    const { data } = await supabase.from("usuarios").select("*").eq("id", id).single();
    return data ? toUsuario(data) : null;
  }

  async findByGoogleId(googleId: string): Promise<Usuario | null> {
    const { data } = await supabase.from("usuarios").select("*").eq("google_id", googleId).single();
    return data ? toUsuario(data) : null;
  }

  async save(input: { email: string; senhaHash?: string; googleId?: string; aceitouTermos: boolean }): Promise<Usuario> {
    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        email: input.email,
        senha_hash: input.senhaHash ?? null,
        google_id: input.googleId ?? null,
        aceitou_termos: input.aceitouTermos,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toUsuario(data);
  }

  async updateSenha(id: string, novaSenhaHash: string): Promise<void> {
    const { error } = await supabase.from("usuarios").update({ senha_hash: novaSenhaHash }).eq("id", id);
    if (error) throw new Error(error.message);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("usuarios").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  async linkGoogleId(id: string, googleId: string): Promise<void> {
    const { error } = await supabase.from("usuarios").update({ google_id: googleId }).eq("id", id);
    if (error) throw new Error(error.message);
  }
}
