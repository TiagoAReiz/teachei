import type { AuthResult } from "@/ap/auth/domain/model/AuthResult";

export interface GoogleAuthUseCase {
  execute(credential: string, aceitouTermos?: boolean): Promise<AuthResult>;
}
