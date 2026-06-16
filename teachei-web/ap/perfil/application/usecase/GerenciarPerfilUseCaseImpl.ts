import { PerfilNaoEncontradoException } from "@/ap/perfil/domain/exception/PerfilNaoEncontradoException";
import type { GerenciarPerfilUseCase } from "@/ap/perfil/application/ports/in/GerenciarPerfilUseCase";
import type { PerfilRepositoryPort } from "@/ap/perfil/application/ports/out/PerfilRepositoryPort";
import type { Perfil, AtualizarPerfilInput } from "@/ap/perfil/domain/model/Perfil";

export class GerenciarPerfilUseCaseImpl implements GerenciarPerfilUseCase {
  constructor(private repo: PerfilRepositoryPort) {}

  async buscar(usuarioId: string): Promise<Perfil> {
    const p = await this.repo.findByUsuarioId(usuarioId);
    if (!p) throw new PerfilNaoEncontradoException();
    return p;
  }

  async buscarPorId(id: string): Promise<Perfil> {
    const p = await this.repo.findById(id);
    if (!p) throw new PerfilNaoEncontradoException();
    return p;
  }

  async atualizar(usuarioId: string, data: AtualizarPerfilInput): Promise<Perfil> {
    const existing = await this.repo.findByUsuarioId(usuarioId);
    if (!existing) throw new PerfilNaoEncontradoException();
    return this.repo.update(usuarioId, data);
  }

  async criarOuBuscar(usuarioId: string, nome: string): Promise<Perfil> {
    const existing = await this.repo.findByUsuarioId(usuarioId);
    if (existing) return existing;
    return this.repo.save(usuarioId, nome);
  }
}
