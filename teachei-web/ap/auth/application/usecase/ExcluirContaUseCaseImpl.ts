import { NotFoundError } from "@/ap/shared/errors";
import type { ExcluirContaUseCase } from "@/ap/auth/application/ports/in/ExcluirContaUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";

export class ExcluirContaUseCaseImpl implements ExcluirContaUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(usuarioId: string): Promise<void> {
    const usuario = await this.repo.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuário não encontrado");
    await this.repo.delete(usuarioId);
  }
}
