import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export interface FinalizarAnuncioUseCase {
  execute(id: string, usuarioId: string): Promise<Anuncio>;
}
