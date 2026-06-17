import { AnuncioSupabaseAdapter } from "@/backend/anuncio/infrastructure/persistence/AnuncioSupabaseAdapter";
import { uploadBase64Image } from "@/backend/shared/storage/uploadImage";
import { CriarAnuncioUseCaseImpl } from "@/backend/anuncio/application/usecase/CriarAnuncioUseCaseImpl";
import { BuscarAnunciosUseCaseImpl } from "@/backend/anuncio/application/usecase/BuscarAnunciosUseCaseImpl";
import { BuscarAnuncioUseCaseImpl } from "@/backend/anuncio/application/usecase/BuscarAnuncioUseCaseImpl";
import { AtualizarAnuncioUseCaseImpl } from "@/backend/anuncio/application/usecase/AtualizarAnuncioUseCaseImpl";
import { ExcluirAnuncioUseCaseImpl } from "@/backend/anuncio/application/usecase/ExcluirAnuncioUseCaseImpl";
import { FinalizarAnuncioUseCaseImpl } from "@/backend/anuncio/application/usecase/FinalizarAnuncioUseCaseImpl";
import { BuscarFiltrosUseCaseImpl } from "@/backend/anuncio/application/usecase/BuscarFiltrosUseCaseImpl";
import { AppError } from "@/backend/shared/errors";
import type { TipoVeiculo } from "@/backend/anuncio/domain/model/Anuncio";
import type { StatusAnuncio } from "@/backend/anuncio/domain/model/StatusAnuncio";

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
    const p = new URL(req.url).searchParams;
    const page = p.get("page") ? Number(p.get("page")) : 0;
    const size = p.get("size") ? Number(p.get("size")) : 12;
    const status = (p.get("status") as StatusAnuncio | null) ?? undefined;
    // sem status → incluirTodosStatus (senão o adapter força status=ATIVO)
    const filters = status
      ? { usuarioId, status, page, size }
      : { usuarioId, incluirTodosStatus: true, page, size };
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute(filters);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handleFiltros(req: Request): Promise<Response> {
  try {
    const p = new URL(req.url).searchParams;
    const modelosCsv = p.get("modelos");
    const selecao = {
      tipo: (p.get("tipo") as TipoVeiculo | null) || undefined,
      marcaCodigo: p.get("marcaCodigo") || undefined,
      modeloBaseNome: p.get("modeloBaseNome") || undefined,
      modeloCodigo: p.get("modeloCodigo") || undefined,
      modelos: modelosCsv ? modelosCsv.split(",").filter(Boolean) : undefined,
      cidade: p.get("cidade") || undefined,
      estado: p.get("estado") || undefined,
      opcionais: p.getAll("opcionais").filter(Boolean),
      precoMin: p.get("precoMin") ? Number(p.get("precoMin")) : undefined,
      precoMax: p.get("precoMax") ? Number(p.get("precoMax")) : undefined,
      anoMin: p.get("anoMin") ? Number(p.get("anoMin")) : undefined,
      anoMax: p.get("anoMax") ? Number(p.get("anoMax")) : undefined,
      kmMin: p.get("kmMin") ? Number(p.get("kmMin")) : undefined,
      kmMax: p.get("kmMax") ? Number(p.get("kmMax")) : undefined,
    };
    const result = await new BuscarFiltrosUseCaseImpl(makeRepo()).execute(selecao);
    return Response.json(result);
  } catch (e) { return err(e); }
}

export async function handlePorUsuario(req: Request, userId: string): Promise<Response> {
  try {
    const p = new URL(req.url).searchParams;
    const page = p.get("page") ? Number(p.get("page")) : 0;
    const size = p.get("size") ? Number(p.get("size")) : 12;
    // Rota pública: só ATIVO (sem incluirTodosStatus)
    const result = await new BuscarAnunciosUseCaseImpl(makeRepo()).execute({ usuarioId: userId, page, size });
    return Response.json(result);
  } catch (e) { return err(e); }
}
