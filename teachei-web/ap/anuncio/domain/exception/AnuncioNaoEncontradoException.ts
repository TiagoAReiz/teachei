import { NotFoundError } from "@/ap/shared/errors";
export class AnuncioNaoEncontradoException extends NotFoundError {
  constructor() { super("Anúncio não encontrado"); }
}
