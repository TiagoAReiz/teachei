import { AnuncioNaoEncontradoException } from "@/backend/anuncio/domain/exception/AnuncioNaoEncontradoException";
import { AnuncioService } from "@/backend/anuncio/domain/service/AnuncioService";
import type { ExcluirAnuncioUseCase } from "@/backend/anuncio/application/ports/in/ExcluirAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
export class ExcluirAnuncioUseCaseImpl implements ExcluirAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string, usuarioId: string): Promise<void> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    AnuncioService.verificarProprietario(a, usuarioId);
    await this.repo.delete(id);
  }
}
