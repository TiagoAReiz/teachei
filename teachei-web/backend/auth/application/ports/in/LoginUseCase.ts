import type { AuthResult } from "@/backend/auth/domain/model/AuthResult";

export interface LoginUseCase {
  execute(email: string, senha: string): Promise<AuthResult>;
}
