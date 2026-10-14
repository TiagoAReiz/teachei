import { handleRegistrarVenda } from "@/backend/avaliacao/web/handler";
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleRegistrarVenda(req, id);
}
