import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export interface BuscarAnuncioUseCase {
  execute(id: string): Promise<Anuncio>;
}
