import { AnuncioNaoEncontradoException } from "@/ap/anuncio/domain/exception/AnuncioNaoEncontradoException";
import type { BuscarAnuncioUseCase } from "@/ap/anuncio/application/ports/in/BuscarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/ap/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export class BuscarAnuncioUseCaseImpl implements BuscarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  async execute(id: string): Promise<Anuncio> {
    const a = await this.repo.findById(id);
    if (!a) throw new AnuncioNaoEncontradoException();
    return a;
  }
}
