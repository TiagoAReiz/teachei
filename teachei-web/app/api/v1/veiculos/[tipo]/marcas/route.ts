import { handleMarcas } from "@/ap/veiculo/web/handler";

export async function GET(_: Request, { params }: { params: Promise<{ tipo: string }> }) {
  const { tipo } = await params;
  return handleMarcas(tipo);
}
