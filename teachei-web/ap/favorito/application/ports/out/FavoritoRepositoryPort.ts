export interface FavoritoRepositoryPort {
  findByUsuarioId(usuarioId: string): Promise<string[]>;
  save(usuarioId: string, anuncioId: string): Promise<void>;
  delete(usuarioId: string, anuncioId: string): Promise<void>;
  exists(usuarioId: string, anuncioId: string): Promise<boolean>;
}
