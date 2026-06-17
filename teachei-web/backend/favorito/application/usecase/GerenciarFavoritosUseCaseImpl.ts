import type { GerenciarFavoritosUseCase } from "@/backend/favorito/application/ports/in/GerenciarFavoritosUseCase";
import type { FavoritoRepositoryPort } from "@/backend/favorito/application/ports/out/FavoritoRepositoryPort";

export class GerenciarFavoritosUseCaseImpl implements GerenciarFavoritosUseCase {
  constructor(private repo: FavoritoRepositoryPort) {}
  listar(usuarioId: string)                        { return this.repo.findByUsuarioId(usuarioId); }
  adicionar(usuarioId: string, anuncioId: string)  { return this.repo.save(usuarioId, anuncioId); }
  remover(usuarioId: string, anuncioId: string)    { return this.repo.delete(usuarioId, anuncioId); }
  verificar(usuarioId: string, anuncioId: string)  { return this.repo.exists(usuarioId, anuncioId); }
}
