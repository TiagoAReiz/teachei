import { handlePorUsuario } from "@/backend/avaliacao/web/handler";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handlePorUsuario(req, id);
}
