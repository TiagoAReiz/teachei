import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? (() => { throw new Error("JWT_SECRET não definido"); })()
);

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
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  return { sub: payload.sub as string, email: payload["email"] as string };
}

export const TOKEN_EXPIRES_IN = EXPIRES_IN;
