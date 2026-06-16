import { AnuncioSupabaseAdapter } from "@/ap/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter";
import { uploadBase64Image } from "@/ap/shared/storage/uploadImage";
import { CriarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/CriarAnuncioUseCaseImpl";
import { BuscarAnunciosUseCaseImpl } from "@/ap/anuncio/application/usecase/BuscarAnunciosUseCaseImpl";
import { BuscarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/BuscarAnuncioUseCaseImpl";
import { AtualizarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/AtualizarAnuncioUseCaseImpl";
import { ExcluirAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/ExcluirAnuncioUseCaseImpl";
import { FinalizarAnuncioUseCaseImpl } from "@/ap/anuncio/application/usecase/FinalizarAnuncioUseCaseImpl";
import { BuscarFiltrosUseCaseImpl } from "@/ap/anuncio/application/usecase/BuscarFiltrosUseCaseImpl";
import { AppError } from "@/ap/shared/errors";
import type { TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";

function makeRepo() { return new AnuncioSupabaseAdapter(); }
function err(e: unknown): Response {
  if (e instanceof AppError) return Response.json({ message: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ message: "Erro interno" }, { status: 500 });
}

export async function handleListar(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;
    const filters = {
      tipoVeiculo: p.get("tipoVeiculo") as TipoVeiculo | undefined || undefined,
      search: p.get("search") || undefined,
      status: p.get("status") as "ATIVO" | undefined || undefined,
      marcaCodigo: p.get("marcaCodigo") || undefined,
      modeloCodigo: p.get("modeloCodigo") || undefined,
      cidade: p.get("cidade") || undefined,
      estado: p.get("estado") || undefined,
      anoMin: p.get("anoMin") ? Number(p.get("anoMin")) : undefined,
      anoMax: p.get("anoMax") ? Number(p.get("anoMax")) : undefined,
      precoMin: p.get("precoMin") ? Number(p.get("precoMin")) : undefined,
      precoMax: p.get("precoMax") ? Number(p.get("precoMax")) : undefined,
      ordenar: p.get("ordenar") || undefined,
      page: p.get("page") ? Number(p.get("page")) : 0,
      size: p.get("size") ? Number(p.get("size")) : 20,
    };
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute(filters);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleCriar(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const body = await req.json();

    if (body.fotoReferenciaBase64) {
      const base64 = body.fotoReferenciaBase64 as string;
      delete body.fotoReferenciaBase64;
      body.fotoReferenciaUrl = await uploadBase64Image("vehicle", `${usuarioId}/${Date.now()}`, base64);
    }

    const result = await new CriarAnuncioUseCaseImpl(makeRepo()).execute(usuarioId, body);
    return Response.json(result, { status: 201 });
  } catch (e) { return err(e); }
}

export async function handleBuscarPorId(_req: Request, id: string): Promise<Response> {
  try {
    const result = await new BuscarAnuncioUseCaseImpl(makeRepo()).execute(id);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleAtualizar(req: Request, id: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const body = await req.json();
    const repo = makeRepo();

    const existing = await new BuscarAnuncioUseCaseImpl(repo).execute(id);

    let fotoReferenciaUrl = existing.veiculo.fotoReferenciaUrl;
    if (body.fotoReferenciaBase64) {
      fotoReferenciaUrl = await uploadBase64Image("vehicle", `${usuarioId}/${Date.now()}`, body.fotoReferenciaBase64 as string);
    }

    const patch = {
      veiculo: {
        ...existing.veiculo,
        versoes: body.versoes ?? existing.veiculo.versoes,
        todasVersoes: body.todasVersoes ?? existing.veiculo.todasVersoes,
        anos: body.anos ?? existing.veiculo.anos,
        cores: body.cores ?? existing.veiculo.cores,
        precoMaximo: body.precoMaximo ?? existing.veiculo.precoMaximo,
        quilometragemMinima: body.quilometragemMinima ?? existing.veiculo.quilometragemMinima,
        quilometragemMaxima: body.quilometragemMaxima ?? existing.veiculo.quilometragemMaxima,
        opcionais: body.opcionais ?? existing.veiculo.opcionais,
        fotoReferenciaUrl,
      },
      contato: {
        ...existing.contato,
        cidade: body.cidade ?? existing.contato.cidade,
        estado: body.estado ?? existing.contato.estado,
      },
      observacoes: body.observacoes,
    };

    const result = await new AtualizarAnuncioUseCaseImpl(repo).execute(id, usuarioId, patch);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleExcluir(req: Request, id: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    await new ExcluirAnuncioUseCaseImpl(makeRepo()).execute(id, usuarioId);
    return new Response(null, { status: 204 });
  } catch (e) { return err(e); }
}

export async function handleFinalizar(req: Request, id: string): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    const result = await new FinalizarAnuncioUseCaseImpl(makeRepo()).execute(id, usuarioId);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleMeus(req: Request): Promise<Response> {
  try {
    const usuarioId = req.headers.get("X-Usuario-Id")!;
    // incluirTodosStatus: true → shows all statuses for own intentions
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute({ usuarioId, incluirTodosStatus: true, size: 1000 });
    return Response.json(result.content);
  } catch (e) { return err(e); }
}

export async function handleFiltros(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const tipo = url.searchParams.get("tipo") as TipoVeiculo | undefined || undefined;
    const marcaCodigo = url.searchParams.get("marcaCodigo") || undefined;
    const result = await new BuscarFiltrosUseCaseImpl(makeRepo()).execute(tipo, marcaCodigo);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handlePorUsuario(_req: Request, userId: string): Promise<Response> {
  try {
    // Public route: returns only ATIVO (no incluirTodosStatus)
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute({ usuarioId: userId, size: 1000 });
    return Response.json(result.content);
  } catch (e) { return err(e); }
}
