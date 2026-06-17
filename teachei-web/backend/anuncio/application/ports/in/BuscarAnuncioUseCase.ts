import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";
export interface BuscarAnuncioUseCase {
  execute(id: string): Promise<Anuncio>;
}
