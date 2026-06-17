export interface GerenciarFavoritosUseCase {
  listar(usuarioId: string): Promise<string[]>;
  adicionar(usuarioId: string, anuncioId: string): Promise<void>;
  remover(usuarioId: string, anuncioId: string): Promise<void>;
  verificar(usuarioId: string, anuncioId: string): Promise<boolean>;
}
