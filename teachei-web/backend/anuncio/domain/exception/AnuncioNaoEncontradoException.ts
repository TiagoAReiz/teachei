import { NotFoundError } from "@/backend/shared/errors";
export class AnuncioNaoEncontradoException extends NotFoundError {
  constructor() { super("Anúncio não encontrado"); }
}
