import { handleAnos } from "@/backend/veiculo/web/handler";

export async function GET(_: Request, { params }: { params: Promise<{ tipo: string; marcaCodigo: string; modeloCodigo: string }> }) {
  const { tipo, marcaCodigo, modeloCodigo } = await params;
  return handleAnos(tipo, marcaCodigo, modeloCodigo);
}
