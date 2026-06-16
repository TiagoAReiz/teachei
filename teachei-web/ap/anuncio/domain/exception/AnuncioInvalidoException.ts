import { ValidationError } from "@/ap/shared/errors";
export class AnuncioInvalidoException extends ValidationError {
  constructor(msg: string) { super(msg); }
}
