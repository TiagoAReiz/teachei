import { AnuncioNaoEncontradoException } from "@/backend/anuncio/domain/exception/AnuncioNaoEncontradoException";
import { AnuncioService } from "@/backend/anuncio/domain/service/AnuncioService";
import type { FinalizarAnuncioUseCase } from "@/backend/anuncio/application/ports/in/FinalizarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";
export class FinalizarAnuncioUseCaseImpl implements FinalizarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string, usuarioId: string): Promise<Anuncio> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    AnuncioService.verificarProprietario(a, usuarioId);
    return this.repo.update(id, { status: "FINALIZADO" });
  }
}
