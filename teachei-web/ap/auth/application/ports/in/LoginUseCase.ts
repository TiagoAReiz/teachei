import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";

export interface LoginUseCase {
  execute(email: string, senha: string): Promise<AuthResult>;
}
