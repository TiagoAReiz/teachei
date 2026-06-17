export interface FavoritoRepositoryPort {
  findByUsuarioId(usuarioId: string): Promise<string[]>;
  findPageByUsuarioId(usuarioId: string, page: number, size: number): Promise<{ ids: string[]; total: number }>;
  save(usuarioId: string, anuncioId: string): Promise<void>;
  delete(usuarioId: string, anuncioId: string): Promise<void>;
  exists(usuarioId: string, anuncioId: string): Promise<boolean>;
}
