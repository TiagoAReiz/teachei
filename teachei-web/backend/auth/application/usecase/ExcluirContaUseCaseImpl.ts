import { NotFoundError } from "@/backend/shared/errors";
import type { ExcluirContaUseCase } from "@/backend/auth/application/ports/in/ExcluirContaUseCase";
import type { UsuarioRepositoryPort } from "@/backend/auth/application/ports/out/UsuarioRepositoryPort";

export class ExcluirContaUseCaseImpl implements ExcluirContaUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(usuarioId: string): Promise<void> {
    const usuario = await this.repo.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuário não encontrado");
    await this.repo.delete(usuarioId);
  }
}
