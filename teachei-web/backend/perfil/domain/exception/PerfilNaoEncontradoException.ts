import { NotFoundError } from "@/backend/shared/errors";

export class PerfilNaoEncontradoException extends NotFoundError {
  constructor() {
    super("Perfil não encontrado");
  }
}
