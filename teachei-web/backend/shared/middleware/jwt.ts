import { SignJWT, jwtVerify } from "jose";

let secret: Uint8Array | undefined;

// Lido no primeiro uso (não na importação) para que `next build` não dependa do segredo.
function getSecret(): Uint8Array {
  if (secret) return secret;
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET não definido");
  secret = new TextEncoder().encode(value);
  return secret;
}

const EXPIRES_IN = 60 * 60; // 1 hora em segundos

export interface JwtPayload {
  sub: string;
  email: string;
}

export async function signToken(payload: JwtPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
  return { sub: payload.sub as string, email: payload["email"] as string };
}

export const TOKEN_EXPIRES_IN = EXPIRES_IN;
