import { handlePendentes } from "@/backend/avaliacao/web/handler";
export async function GET(req: Request) { return handlePendentes(req); }
