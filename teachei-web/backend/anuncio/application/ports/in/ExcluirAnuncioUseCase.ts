export interface ExcluirAnuncioUseCase {
  execute(id: string, usuarioId: string): Promise<void>;
}
