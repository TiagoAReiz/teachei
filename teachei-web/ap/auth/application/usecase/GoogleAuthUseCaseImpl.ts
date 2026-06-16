import { OAuth2Client } from "google-auth-library";
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

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

async function verifyGoogleToken(credential: string): Promise<GoogleTokenPayload> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) throw new ValidationError("Google token inválido");
    if (!payload.email_verified) throw new ValidationError("Email Google não verificado");
    return { sub: payload.sub, email: payload.email, name: payload.name };
  } catch (e) {
    if (e instanceof ValidationError) throw e;
    throw new ValidationError("Google token inválido");
  }
}

export class GoogleAuthUseCaseImpl implements GoogleAuthUseCase {
  constructor(private repo: UsuarioRepositoryPort) {}

  async execute(credential: string, aceitouTermos?: boolean): Promise<AuthResult> {
    const googlePayload = await verifyGoogleToken(credential);

    let usuario = await this.repo.findByGoogleId(googlePayload.sub);

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
      }
    }

    const token = await signToken({ sub: usuario.id, email: usuario.email });
    return { token, usuarioId: usuario.id, email: usuario.email, expiresIn: TOKEN_EXPIRES_IN, tokenType: "Bearer" };
  }
}
