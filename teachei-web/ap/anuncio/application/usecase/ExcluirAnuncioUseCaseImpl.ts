import { AnuncioNaoEncontradoException } from "@/ap/anuncio/domain/exception/AnuncioNaoEncontradoException";
import { AnuncioService } from "@/ap/anuncio/domain/service/AnuncioService";
import type { ExcluirAnuncioUseCase } from "@/ap/anuncio/application/ports/in/ExcluirAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
export class ExcluirAnuncioUseCaseImpl implements ExcluirAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string, usuarioId: string): Promise<void> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    AnuncioService.verificarProprietario(a, usuarioId);
    await this.repo.delete(id);
  }
}
