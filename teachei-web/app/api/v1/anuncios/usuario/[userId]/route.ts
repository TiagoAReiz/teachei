import { handlePorUsuario } from "@/ap/anuncio/web/handler";
export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params; return handlePorUsuario(req, userId);
}
