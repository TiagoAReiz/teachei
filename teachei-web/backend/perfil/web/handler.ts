import { PerfilSupabaseAdapter } from "@/backend/perfil/infrastructure/persistence/PerfilSupabaseAdapter";
import { GerenciarPerfilUseCaseImpl } from "@/backend/perfil/application/usecase/GerenciarPerfilUseCaseImpl";
import { ExcluirContaUseCaseImpl } from "@/backend/auth/application/usecase/ExcluirContaUseCaseImpl";
import { UsuarioSupabaseAdapter } from "@/backend/auth/infrastructure/persistence/UsuarioSupabaseAdapter";
import { AppError } from "@/backend/shared/errors";
import { uploadBase64Image, deleteStorageImage } from "@/backend/shared/storage/uploadImage";

function makeUseCase() {
  return new GerenciarPerfilUseCaseImpl(new PerfilSupabaseAdapter());
}

function err(e: unknown): Response {
  if (e instanceof AppError) return Response.json({ message: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleBuscarPerfil(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const perfil = await makeUseCase().buscar(usuarioId);
    return Response.json(perfil);
  } catch (e) {
    return err(e);
  }
}

export async function handleAtualizarPerfil(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const body = await req.json();

    if (body.removerFoto) {
      delete body.removerFoto;
      const perfil = await makeUseCase().buscar(usuarioId);
      if (perfil.fotoUrl) await deleteStorageImage("profile", perfil.fotoUrl);
      body.fotoUrl = null;
    } else if (body.foto) {
      const base64 = body.foto as string;
      delete body.foto;
      body.fotoUrl = await uploadBase64Image("profile", `${usuarioId}/${Date.now()}`, base64);
    }

    const perfil = await makeUseCase().atualizar(usuarioId, body);
    return Response.json(perfil);
  } catch (e) {
    return err(e);
  }
}

export async function handleExcluirConta(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await new ExcluirContaUseCaseImpl(new UsuarioSupabaseAdapter()).execute(usuarioId);
    return new Response(null, { status: 204 });
  } catch (e) {
    return err(e);
  }
}

export async function handleBuscarPerfilPorId(_req: Request, id: string): Promise<Response> {
  try {
    const perfil = await makeUseCase().buscar(id);
    return Response.json(perfil);
  } catch (e) {
    return err(e);
  }
}
