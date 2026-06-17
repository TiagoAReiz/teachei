import { handleVerificar } from "@/backend/favorito/web/handler";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ anuncioId: string }> }
) {
  const { anuncioId } = await params;
  return handleVerificar(req, anuncioId);
}
