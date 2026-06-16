import bcrypt from "bcryptjs";
import { signToken, TOKEN_EXPIRES_IN } from "@/ap/shared/middleware/jwt";
import { ValidationError } from "@/ap/shared/errors";
import type { RegisterUseCase } from "@/ap/auth/application/ports/in/RegisterUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";
import type { PerfilRepositoryPort } from "@/ap/perfil/application/ports/out/PerfilRepositoryPort";
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";

export class RegisterUseCaseImpl implements RegisterUseCase {
  constructor(
    private repo: UsuarioRepositoryPort,
    private perfilRepo: PerfilRepositoryPort,
  ) {}

  async execute(data: { email: string; senha: string; nome?: string; aceitouTermos: boolean }): Promise<AuthResult> {
    if (!data.aceitouTermos) throw new ValidationError("Termos de uso devem ser aceitos");

    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new ValidationError("Email já cadastrado");

    const senhaHash = await bcrypt.hash(data.senha, 10);
    const usuario = await this.repo.save({ email: data.email, senhaHash, aceitouTermos: true });

    const nome = data.nome ?? data.email.split("@")[0];
    await this.perfilRepo.save(usuario.id, nome);

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
