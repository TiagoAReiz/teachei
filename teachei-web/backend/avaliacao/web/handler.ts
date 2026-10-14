import { AnuncioSupabaseAdapter } from "@/backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter";
import { AvaliacaoSupabaseAdapter } from "@/backend/avaliacao/infrastructure/persistence/AvaliacaoSupabaseAdapter";
import { RegistrarVendaUseCaseImpl } from "@/backend/avaliacao/application/usecase/RegistrarVendaUseCaseImpl";
import { AvaliarVendaUseCaseImpl } from "@/backend/avaliacao/application/usecase/AvaliarVendaUseCaseImpl";
import { AppError } from "@/backend/shared/errors";

function err(e: unknown): Response {
  if (e instanceof AppError) return Response.json({ message: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleRegistrarVenda(req: Request, anuncioId: string): Promise<Response> {
  try {
    const vendedorId = req.headers.get("X-Usuario-Id")!;
    const venda = await new RegistrarVendaUseCaseImpl(new AvaliacaoSupabaseAdapter(), new AnuncioSupabaseAdapter()).execute(anuncioId, vendedorId);
    return Response.json(venda, { status: 201 });
  } catch (e) { return err(e); }
}

export async function handleAvaliar(req: Request): Promise<Response> {
  try {
    const compradorId = req.headers.get("X-Usuario-Id")!;
    const body = await req.json();
    const avaliacao = await new AvaliarVendaUseCaseImpl(new AvaliacaoSupabaseAdapter()).execute(compradorId, {
      vendaId: String(body.vendaId ?? ""),
      nota: Number(body.nota),
      comentario: typeof body.comentario === "string" ? body.comentario : undefined,
    });
    return Response.json(avaliacao, { status: 201 });
  } catch (e) { return err(e); }
}

export async function handlePendentes(req: Request): Promise<Response> {
  try {
    const compradorId = req.headers.get("X-Usuario-Id")!;
    return Response.json(await new AvaliacaoSupabaseAdapter().findPendentesDoComprador(compradorId));
  } catch (e) { return err(e); }
}

export async function handlePorUsuario(_req: Request, usuarioId: string): Promise<Response> {
  try {
    const repo = new AvaliacaoSupabaseAdapter();
    const [reputacao, avaliacoes] = await Promise.all([repo.getReputacao(usuarioId), repo.findAvaliacoesDoUsuario(usuarioId, 20)]);
    return Response.json({ ...reputacao, avaliacoes });
  } catch (e) { return err(e); }
}
