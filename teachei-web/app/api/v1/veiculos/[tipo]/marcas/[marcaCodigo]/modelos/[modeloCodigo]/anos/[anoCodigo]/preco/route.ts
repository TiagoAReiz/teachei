import { handlePreco } from "@/backend/veiculo/web/handler";

export async function GET(_: Request, { params }: { params: Promise<{ tipo: string; marcaCodigo: string; modeloCodigo: string; anoCodigo: string }> }) {
  const { tipo, marcaCodigo, modeloCodigo, anoCodigo } = await params;
  return handlePreco(tipo, marcaCodigo, modeloCodigo, anoCodigo);
}
