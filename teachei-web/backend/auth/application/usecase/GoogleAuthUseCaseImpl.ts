import { signToken, TOKEN_EXPIRES_IN } from "@/backend/shared/middleware/jwt";
import { ValidationError } from "@/backend/shared/errors";
import type { GoogleAuthUseCase } from "@/backend/auth/application/ports/in/GoogleAuthUseCase";
import type { UsuarioRepositoryPort } from "@/backend/auth/application/ports/out/UsuarioRepositoryPort";
import type { PerfilRepositoryPort } from "@/backend/perfil/application/ports/out/PerfilRepositoryPort";
import type { AuthResult } from "@/backend/auth/domain/model/AuthResult";

interface GoogleTokenPayload {
  sub: string;
  email: string;
  name?: string;
}

async function verifyGoogleToken(credential: string): Promise<GoogleTokenPayload> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${credential}` },
  });
  if (!res.ok) throw new ValidationError("Google token inválido");
  const data = await res.json();
  if (!data.sub || !data.email) throw new ValidationError("Google token inválido");
  if (!data.email_verified) throw new ValidationError("Email Google não verificado");
  return { sub: data.sub, email: data.email, name: data.name };
}

export class GoogleAuthUseCaseImpl implements GoogleAuthUseCase {
  constructor(
    private repo: UsuarioRepositoryPort,
    private perfilRepo: PerfilRepositoryPort,
  ) {}

  async execute(credential: string, aceitouTermos?: boolean): Promise<AuthResult> {
    const googlePayload = await verifyGoogleToken(credential);

    let usuario = await this.repo.findByGoogleId(googlePayload.sub);
    let isNew = false;

    if (!usuario) {
      const byEmail = await this.repo.findByEmail(googlePayload.email);
      if (byEmail) {
        await this.repo.linkGoogleId(byEmail.id, googlePayload.sub);
        usuario = byEmail;
      } else {
        if (!aceitouTermos) throw new ValidationError("Termos de uso devem ser aceitos");
        usuario = await this.repo.save({
          email: googlePayload.email,
          googleId: googlePayload.sub,
          aceitouTermos: true,
        });
        isNew = true;
      }
    }

    if (isNew) {
      const nome = googlePayload.name ?? googlePayload.email.split("@")[0];
      await this.perfilRepo.save(usuario.id, nome);
    }

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
