import { handleListar, handleCriar } from "@/backend/anuncio/web/handler";
export async function GET(req: Request) { return handleListar(req); }
export async function POST(req: Request) { return handleCriar(req); }
