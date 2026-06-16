import { handleModelos } from "@/ap/veiculo/web/handler";

export async function GET(_: Request, { params }: { params: Promise<{ tipo: string; marcaCodigo: string }> }) {
  const { tipo, marcaCodigo } = await params;
  return handleModelos(tipo, marcaCodigo);
}
