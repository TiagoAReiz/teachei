import bcrypt from "bcryptjs";
import { CredenciaisInvalidasException } from "@/ap/auth/domain/exception/CredenciaisInvalidasException";
import { NotFoundError } from "@/ap/shared/errors";
import type { AlterarSenhaUseCase } from "@/ap/auth/application/ports/in/AlterarSenhaUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";

export class AlterarSenhaUseCaseImpl implements AlterarSenhaUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(usuarioId: string, senhaAtual: string, novaSenha: string): Promise<void> {
    const usuario = await this.repo.findById(usuarioId);
    if (!usuario) throw new NotFoundError("Usuário não encontrado");
    if (!usuario.senhaHash) throw new CredenciaisInvalidasException();

    const valid = await bcrypt.compare(senhaAtual, usuario.senhaHash);
    if (!valid) throw new CredenciaisInvalidasException();

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
    await this.repo.updateSenha(usuarioId, novaSenhaHash);
  }
}
