import { handleListar, handleAdicionar } from "@/backend/favorito/web/handler";

export async function GET(req: Request) {
  return handleListar(req);
}

export async function POST(req: Request) {
  return handleAdicionar(req);
}
