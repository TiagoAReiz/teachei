import bcrypt from "bcryptjs";
import { signToken, TOKEN_EXPIRES_IN } from "@/backend/shared/middleware/jwt";
import { CredenciaisInvalidasException } from "@/backend/auth/domain/exception/CredenciaisInvalidasException";
import type { LoginUseCase } from "@/backend/auth/application/ports/in/LoginUseCase";
import type { UsuarioRepositoryPort } from "@/backend/auth/application/ports/out/UsuarioRepositoryPort";
import type { AuthResult } from "@/backend/auth/domain/model/AuthResult";

export class LoginUseCaseImpl implements LoginUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(email: string, senha: string): Promise<AuthResult> {
    const usuario = await this.repo.findByEmail(email);
    if (!usuario || !usuario.senhaHash) throw new CredenciaisInvalidasException();

    const valid = await bcrypt.compare(senha, usuario.senhaHash);
    if (!valid) throw new CredenciaisInvalidasException();

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
