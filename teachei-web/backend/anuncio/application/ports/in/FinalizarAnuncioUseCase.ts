import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";
export interface FinalizarAnuncioUseCase {
  execute(id: string, usuarioId: string): Promise<Anuncio>;
}
