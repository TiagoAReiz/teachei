import { handleListarAnuncios } from "@/backend/favorito/web/handler";

export async function GET(req: Request) {
  return handleListarAnuncios(req);
}
