import { supabase } from "@/backend/shared/db/supabase";
import type { FavoritoRepositoryPort } from "@/backend/favorito/application/ports/out/FavoritoRepositoryPort";

export class FavoritoSupabaseAdapter implements FavoritoRepositoryPort {
  async findByUsuarioId(usuarioId: string): Promise<string[]> {
    const { data } = await supabase
      .from("favoritos")
      .select("anuncio_id")
      .eq("usuario_id", usuarioId)
      .order("criado_em", { ascending: false });
    return (data ?? []).map((r) => r.anuncio_id as string);
  }

  async save(usuarioId: string, anuncioId: string): Promise<void> {
    await supabase
      .from("favoritos")
      .upsert(
        { usuario_id: usuarioId, anuncio_id: anuncioId },
        { onConflict: "usuario_id,anuncio_id" }
      );
  }

  async delete(usuarioId: string, anuncioId: string): Promise<void> {
    await supabase
      .from("favoritos")
      .delete()
      .eq("usuario_id", usuarioId)
      .eq("anuncio_id", anuncioId);
  }

  async exists(usuarioId: string, anuncioId: string): Promise<boolean> {
    const { count } = await supabase
      .from("favoritos")
      .select("*", { count: "exact", head: true })
      .eq("usuario_id", usuarioId)
      .eq("anuncio_id", anuncioId);
    return (count ?? 0) > 0;
  }
}
