import { handleAvaliar } from "@/backend/avaliacao/web/handler";
export async function POST(req: Request) { return handleAvaliar(req); }
