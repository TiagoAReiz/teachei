import { signToken, TOKEN_EXPIRES_IN } from "@/ap/shared/middleware/jwt";
import { ValidationError } from "@/ap/shared/errors";
import type { GoogleAuthUseCase } from "@/ap/auth/application/ports/in/GoogleAuthUseCase";
import type { UsuarioRepositoryPort } from "@/ap/auth/application/ports/out/UsuarioRepositoryPort";
import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";

interface GoogleTokenPayload {
  sub: string;
  email: string;
  name?: string;
}

async function verifyGoogleToken(credential: string): Promise<GoogleTokenPayload> {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`
  );
  if (!res.ok) throw new ValidationError("Google token inválido");
  const data = await res.json();
  if (data.aud !== process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) throw new ValidationError("Google client_id inválido");
  return { sub: data.sub, email: data.email, name: data.name };
}

export class GoogleAuthUseCaseImpl implements GoogleAuthUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(credential: string, aceitouTermos?: boolean): Promise<AuthResult> {
    const googlePayload = await verifyGoogleToken(credential);

    let usuario = await this.repo.findByGoogleId(googlePayload.sub);

    if (!usuario) {
      const byEmail = await this.repo.findByEmail(googlePayload.email);
      if (byEmail) {
        usuario = byEmail;
      } else {
        if (!aceitouTermos) throw new ValidationError("Termos de uso devem ser aceitos");
        usuario = await this.repo.save({
          email: googlePayload.email,
          googleId: googlePayload.sub,
          aceitouTermos: true,
        });
      }
    }

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
