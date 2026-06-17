import { ValidationError } from "@/backend/shared/errors";
export class AnuncioInvalidoException extends ValidationError {
  constructor(msg: string) { super(msg); }
}
