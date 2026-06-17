import { UsuarioSupabaseAdapter } from "@/backend/auth/infrastructure/persistence/UsuarioSupabaseAdapter";
import { PerfilSupabaseAdapter } from "@/backend/perfil/infrastructure/persistence/PerfilSupabaseAdapter";
import { LoginUseCaseImpl } from "@/backend/auth/application/usecase/LoginUseCaseImpl";
import { RegisterUseCaseImpl } from "@/backend/auth/application/usecase/RegisterUseCaseImpl";
import { GoogleAuthUseCaseImpl } from "@/backend/auth/application/usecase/GoogleAuthUseCaseImpl";
import { AlterarSenhaUseCaseImpl } from "@/backend/auth/application/usecase/AlterarSenhaUseCaseImpl";
import { ExcluirContaUseCaseImpl } from "@/backend/auth/application/usecase/ExcluirContaUseCaseImpl";
import { AppError } from "@/backend/shared/errors";

function makeRepo() { return new UsuarioSupabaseAdapter(); }
function makePerfilRepo() { return new PerfilSupabaseAdapter(); }

function errorResponse(err: unknown): Response {
  if (err instanceof AppError) {
    return Response.json({ message: err.message }, { status: err.status });
  }
  console.error(err);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleLogin(req: Request): Promise<Response> {
  try {
    const { email, senha } = await req.json();
    const result = await new LoginUseCaseImpl(makeRepo()).execute(email, senha);
    return Response.json(result);
  } catch (err) { return errorResponse(err); }
}

export async function handleRegister(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const result = await new RegisterUseCaseImpl(makeRepo(), makePerfilRepo()).execute(body);
    return Response.json(result);
  } catch (err) { return errorResponse(err); }
}

export async function handleGoogle(req: Request): Promise<Response> {
  try {
    const { credential, aceitouTermos } = await req.json();
    const result = await new GoogleAuthUseCaseImpl(makeRepo(), makePerfilRepo()).execute(credential, aceitouTermos);
    return Response.json(result);
  } catch (err) { return errorResponse(err); }
}

export async function handleAlterarSenha(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const { senhaAtual, novaSenha } = await req.json();
    await new AlterarSenhaUseCaseImpl(makeRepo()).execute(usuarioId, senhaAtual, novaSenha);
    return new Response(null, { status: 204 });
  } catch (err) { return errorResponse(err); }
}

export async function handleExcluirConta(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await new ExcluirContaUseCaseImpl(makeRepo()).execute(usuarioId);
    return new Response(null, { status: 204 });
  } catch (err) { return errorResponse(err); }
}
