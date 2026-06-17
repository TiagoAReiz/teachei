export interface AlterarSenhaUseCase {
  execute(usuarioId: string, senhaAtual: string, novaSenha: string): Promise<void>;
}
