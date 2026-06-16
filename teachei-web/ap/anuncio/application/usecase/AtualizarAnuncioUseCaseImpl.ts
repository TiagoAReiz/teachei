import { AnuncioNaoEncontradoException } from "@/ap/anuncio/domain/exception/AnuncioNaoEncontradoException";
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";
import type { AtualizarAnuncioUseCase } from "@/ap/anuncio/application/ports/in/AtualizarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export class AtualizarAnuncioUseCaseImpl implements AtualizarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string, usuarioId: string, data: Partial<Omit<Anuncio, "id" | "usuarioId" | "criadoEm">>): Promise<Anuncio> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new AnuncioNaoEncontradoException();
    AnuncioService.verificarProprietario(existing, usuarioId);
    return this.repo.update(id, data);
  }
}
