import type { Usuario } from "@/ap/auth/domain/model/Usuario";

export interface UsuarioRepositoryPort {
  findByEmail(email: string): Promise<Usuario | null>;
  findById(id: string): Promise<Usuario | null>;
  findByGoogleId(googleId: string): Promise<Usuario | null>;
  save(data: {
    email: string;
    senhaHash?: string;
    googleId?: string;
    aceitouTermos: boolean;
  }): Promise<Usuario>;
  updateSenha(id: string, novaSenhaHash: string): Promise<void>;
  delete(id: string): Promise<void>;
  linkGoogleId(id: string, googleId: string): Promise<void>;
}
