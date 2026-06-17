import { AnuncioNaoEncontradoException } from "@/backend/anuncio/domain/exception/AnuncioNaoEncontradoException";
import type { BuscarAnuncioUseCase } from "@/backend/anuncio/application/ports/in/BuscarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";
export class BuscarAnuncioUseCaseImpl implements BuscarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string): Promise<Anuncio> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    return a;
  }
}
