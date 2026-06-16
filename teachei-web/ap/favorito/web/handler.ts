import { FavoritoSupabaseAdapter } from "@/ap/favorito/infrastructure/persistence/FavoritoSupabaseAdapter";
import { GerenciarFavoritosUseCaseImpl } from "@/ap/favorito/application/usecase/GerenciarFavoritosUseCaseImpl";
import { AppError } from "@/ap/shared/errors";

function makeUseCase() {
  return new GerenciarFavoritosUseCaseImpl(new FavoritoSupabaseAdapter());
}

function err(e: unknown): Response {
  if (e instanceof AppError) return Response.json({ message: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleListar(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const ids = await makeUseCase().listar(usuarioId);
    return Response.json(ids);
  } catch (e) {
    return err(e);
  }
}

export async function handleAdicionar(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const { anuncioId } = await req.json();
    await makeUseCase().adicionar(usuarioId, anuncioId);
    return new Response(null, { status: 201 });
  } catch (e) {
    return err(e);
  }
}

export async function handleRemover(req: Request, anuncioId: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await makeUseCase().remover(usuarioId, anuncioId);
    return new Response(null, { status: 204 });
  } catch (e) {
    return err(e);
  }
}

export async function handleVerificar(req: Request, anuncioId: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const exists = await makeUseCase().verificar(usuarioId, anuncioId);
    return Response.json({ favorito: exists });
  } catch (e) {
    return err(e);
  }
}
