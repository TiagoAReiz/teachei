import type { Anuncio } from "@/ap/anuncio/domain/model/Anuncio";
export interface AtualizarAnuncioUseCase {
  execute(id: string, usuarioId: string, data: Partial<Omit<Anuncio, "id" | "usuarioId" | "criadoEm">>): Promise<Anuncio>;
}
