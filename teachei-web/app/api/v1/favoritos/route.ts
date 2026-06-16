import { handleListar, handleAdicionar } from "@/ap/favorito/web/handler";

export async function GET(req: Request) {
  return handleListar(req);
}

export async function POST(req: Request) {
  return handleAdicionar(req);
}
