export interface ExcluirContaUseCase {
  execute(usuarioId: string): Promise<void>;
}
