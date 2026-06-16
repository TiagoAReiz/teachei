import { handleBuscarPorId, handleAtualizar, handleExcluir } from "@/ap/anuncio/web/handler";
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleBuscarPorId(req, id);
}
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleAtualizar(req, id);
}
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; return handleExcluir(req, id);
}
