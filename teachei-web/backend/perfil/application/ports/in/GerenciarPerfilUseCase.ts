import type { Perfil, AtualizarPerfilInput } from "@/backend/perfil/domain/model/Perfil";

export interface GerenciarPerfilUseCase {
  buscar(usuarioId: string): Promise<Perfil>;
  buscarPorId(id: string): Promise<Perfil>;
  atualizar(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil>;
  criarOuBuscar(usuarioId: string, nome: string): Promise<Perfil>;
}
