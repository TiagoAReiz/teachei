import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/ap/shared/middleware/jwt";

const PROTECTED_ROUTES = [
  "/api/v1/perfil",
  "/api/v1/favoritos",
  "/api/v1/anuncios/meus",
];

const PROTECTED_METHODS_ON_ANUNCIOS = ["POST", "PUT", "DELETE"];

function isProtected(req: NextRequest): boolean {
  const { pathname } = req.nextUrl;
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) return true;
  if (pathname.startsWith("/api/v1/anuncios") && PROTECTED_METHODS_ON_ANUNCIOS.includes(req.method)) return true;
  if (pathname.startsWith("/api/v1/auth/senha")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  if (!isProtected(req)) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.delete("X-Usuario-Id");
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("teachei_token")?.value;
  const raw = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken;

  if (!raw) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(raw);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("X-Usuario-Id", payload.sub);
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    return NextResponse.json({ message: "Token inválido ou expirado" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/v1/:path*"],
};
