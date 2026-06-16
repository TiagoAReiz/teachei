import { handleBuscarPerfil, handleAtualizarPerfil, handleExcluirConta } from "@/ap/perfil/web/handler";

export async function GET(req: Request) {
  return handleBuscarPerfil(req);
}

export async function PUT(req: Request) {
  return handleAtualizarPerfil(req);
}

export async function DELETE(req: Request) {
  return handleExcluirConta(req);
}
