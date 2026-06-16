import { handleBuscarPerfilPorId } from "@/ap/perfil/web/handler";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return handleBuscarPerfilPorId(req, id);
}
