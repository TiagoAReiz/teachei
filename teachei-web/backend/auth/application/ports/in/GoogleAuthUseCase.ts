import type { AuthResult } from "@/backend/auth/domain/model/AuthResult";

export interface GoogleAuthUseCase {
  execute(credential: string, aceitouTermos?: boolean): Promise<AuthResult>;
}
