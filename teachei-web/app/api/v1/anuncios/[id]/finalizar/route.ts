import { handleFinalizar } from "@/ap/anuncio/web/handler";
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleFinalizar(req, id);
}
