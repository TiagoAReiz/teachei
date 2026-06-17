import { handleMeus } from "@/backend/anuncio/web/handler";
export async function GET(req: Request) { return handleMeus(req); }
