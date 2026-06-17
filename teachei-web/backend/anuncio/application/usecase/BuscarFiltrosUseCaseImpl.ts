import type { BuscarFiltrosUseCase } from "@/backend/anuncio/application/ports/in/BuscarFiltrosUseCase";
import type { AvailableFilters, AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { FiltroSelecao } from "@/backend/anuncio/domain/model/FiltroSelecao";

export class BuscarFiltrosUseCaseImpl implements BuscarFiltrosUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}
  execute(selecao: FiltroSelecao): Promise<AvailableFilters> {
    return this.repo.getAvailableFilters(selecao);
  }
}
