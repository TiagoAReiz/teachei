import type { AvailableFilters } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { FiltroSelecao } from "@/backend/anuncio/domain/model/FiltroSelecao";

export interface BuscarFiltrosUseCase {
  execute(selecao: FiltroSelecao): Promise<AvailableFilters>;
}
