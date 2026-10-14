import { ForbiddenError, NotFoundError, ValidationError } from "@/backend/shared/errors";
import type { AvaliacaoRepositoryPort } from "@/backend/avaliacao/application/ports/out/AvaliacaoRepositoryPort";
import type { Avaliacao } from "@/backend/avaliacao/domain/model/Avaliacao";

const MAX_COMENTARIO = 500;

/** O comprador avalia o vendedor de uma venda registrada, uma única vez. */
export class AvaliarVendaUseCaseImpl {
  constructor(private repo: AvaliacaoRepositoryPort) {}

  async execute(compradorId: string, input: { vendaId: string; nota: number; comentario?: string }): Promise<Avaliacao> {
    if (!Number.isInteger(input.nota) || input.nota < 1 || input.nota > 5) {
      throw new ValidationError("A nota deve ser um inteiro de 1 a 5");
    }
    const comentario = input.comentario?.trim() || undefined;
    if (comentario && comentario.length > MAX_COMENTARIO) {
      throw new ValidationError(`O comentário pode ter no máximo ${MAX_COMENTARIO} caracteres`);
    }

    const venda = await this.repo.findVendaById(input.vendaId);
    if (!venda) throw new NotFoundError("Venda não encontrada");
    if (venda.compradorId !== compradorId) throw new ForbiddenError("Só o comprador pode avaliar esta venda");
    if (await this.repo.findAvaliacaoByVenda(venda.id)) throw new ValidationError("Esta venda já foi avaliada");

    return this.repo.saveAvaliacao({
      vendaId: venda.id,
      avaliadorId: compradorId,
      avaliadoId: venda.vendedorId,
      nota: input.nota,
      comentario,
    });
  }
}
