import { FavoritoSupabaseAdapter } from "@/backend/favorito/infrastructure/persistence/FavoritoSupabaseAdapter";
import { GerenciarFavoritosUseCaseImpl } from "@/backend/favorito/application/usecase/GerenciarFavoritosUseCaseImpl";
import { AnuncioSupabaseAdapter } from "@/backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter";
import { ListarAnunciosFavoritosUseCaseImpl } from "@/backend/favorito/application/usecase/ListarAnunciosFavoritosUseCaseImpl";
import { AppError } from "@/backend/shared/errors";

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

export async function handleListarAnuncios(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const p = new URL(req.url).searchParams;
    const page = p.get("page") ? Number(p.get("page")) : 0;
    const size = p.get("size") ? Number(p.get("size")) : 12;
    const result = await new ListarAnunciosFavoritosUseCaseImpl(
      new FavoritoSupabaseAdapter(),
      new AnuncioSupabaseAdapter(),
    ).execute(usuarioId, page, size);
    return Response.json(result);
  } catch (e) { return err(e); }
}
