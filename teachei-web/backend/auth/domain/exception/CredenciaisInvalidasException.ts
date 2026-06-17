import { UnauthorizedError } from "@/backend/shared/errors";

export class CredenciaisInvalidasException extends UnauthorizedError {
  constructor() {
    super("Email ou senha inválidos");
  }
}
