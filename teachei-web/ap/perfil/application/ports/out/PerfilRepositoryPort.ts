import type { Perfil, AtualizarPerfilInput } from "@/ap/perfil/domain/model/Perfil";

export interface PerfilRepositoryPort {
  findByUsuarioId(usuarioId: string): Promise<Perfil | null>;
  findById(id: string): Promise<Perfil | null>;
  save(usuarioId: string, nome: string): Promise<Perfil>;
  update(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil>;
  delete(usuarioId: string): Promise<void>;
}
