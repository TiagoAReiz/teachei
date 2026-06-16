import { NotFoundError } from "@/ap/shared/errors";

export class PerfilNaoEncontradoException extends NotFoundError {
  constructor() {
    super("Perfil não encontrado");
  }
}
