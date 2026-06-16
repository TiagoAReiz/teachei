import { handleRemover } from "@/ap/favorito/web/handler";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ anuncioId: string }> }
) {
  const { anuncioId } = await params;
  return handleRemover(req, anuncioId);
}
