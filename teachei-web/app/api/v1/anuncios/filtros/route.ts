import { handleFiltros } from "@/backend/anuncio/web/handler";
export async function GET(req: Request) { return handleFiltros(req); }
