import { UnauthorizedError } from "@/ap/shared/errors";

export class CredenciaisInvalidasException extends UnauthorizedError {
  constructor() {
    super("Email ou senha inválidos");
  }
}
