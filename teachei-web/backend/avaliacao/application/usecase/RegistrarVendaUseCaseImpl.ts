import { ForbiddenError, ValidationError } from "@/backend/shared/errors";
import { AnuncioNaoEncontradoException } from "@/backend/anuncio/domain/exception/AnuncioNaoEncontradoException";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { AvaliacaoRepositoryPort } from "@/backend/avaliacao/application/ports/out/AvaliacaoRepositoryPort";
import type { Venda } from "@/backend/avaliacao/domain/model/Avaliacao";

/** O vendedor declara que vendeu para o dono da intenção. Idempotente por (anúncio, vendedor). */
export class RegistrarVendaUseCaseImpl {
  constructor(private repo: AvaliacaoRepositoryPort, private anuncios: AnuncioRepositoryPort) {}

  async execute(anuncioId: string, vendedorId: string): Promise<Venda> {
    const anuncio = await this.anuncios.findById(anuncioId);
    if (!anuncio) throw new AnuncioNaoEncontradoException();
    if (anuncio.usuarioId === vendedorId) throw new ForbiddenError("Você não pode registrar venda na sua própria intenção");
    if (anuncio.status === "CANCELADO") throw new ValidationError("Esta intenção foi cancelada");

    const existente = await this.repo.findVendaByAnuncioVendedor(anuncioId, vendedorId);
    if (existente) return existente;
    return this.repo.saveVenda({ anuncioId, vendedorId, compradorId: anuncio.usuarioId });
  }
}
