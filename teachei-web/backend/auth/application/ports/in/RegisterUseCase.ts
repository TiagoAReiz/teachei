import type { AuthResult } from "@/backend/auth/domain/model/AuthResult";

export interface RegisterUseCase {
  execute(data: {
    email: string;
    senha: string;
    nome?: string;
    aceitouTermos: boolean;
  }): Promise<AuthResult>;
}
