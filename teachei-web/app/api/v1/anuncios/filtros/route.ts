import { handleFiltros } from "@/ap/anuncio/web/handler";
export async function GET(req: Request) { return handleFiltros(req); }
