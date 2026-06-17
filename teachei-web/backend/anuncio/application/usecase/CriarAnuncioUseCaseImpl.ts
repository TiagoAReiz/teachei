import { AnuncioService } from "@/backend/anuncio/domain/service/AnuncioService";
import type { CriarAnuncioUseCase, CriarAnuncioInput } from "@/backend/anuncio/application/ports/in/CriarAnuncioUseCase";
import type { AnuncioRepositoryPort } from "@/backend/anuncio/application/ports/out/AnuncioRepositoryPort";
import type { Anuncio } from "@/backend/anuncio/domain/model/Anuncio";

export class CriarAnuncioUseCaseImpl implements CriarAnuncioUseCase {
  constructor(private repo: AnuncioRepositoryPort) {}

  async execute(usuarioId: string, data: CriarAnuncioInput): Promise<Anuncio> {
    AnuncioService.validarAnuncio({ tipo: data.tipo, precoMaximo: data.precoMaximo, anos: data.anos, cores: data.cores });
    const expiraEm = AnuncioService.calcularExpiracao().toISOString();
    return this.repo.save({
      usuarioId, tipo: data.tipo, status: "ATIVO",
      veiculo: {
        marcaCodigo: data.marcaCodigo, marcaNome: data.marcaNome,
        modeloCodigo: data.modeloCodigo, modeloNome: data.modeloNome,
        modeloBaseNome: data.modeloBaseNome, versoes: data.versoes,
        todasVersoes: data.todasVersoes, anos: data.anos, cores: data.cores,
        precoMaximo: data.precoMaximo, quilometragemMinima: data.quilometragemMinima,
        quilometragemMaxima: data.quilometragemMaxima, opcionais: data.opcionais,
        dadosManuais: data.dadosManuais ?? false, fotoReferenciaUrl: data.fotoReferenciaUrl,
      },
      contato: { cidade: data.cidade, estado: data.estado, whatsapp: data.whatsapp },
      observacoes: data.observacoes, expiraEm,
    });
  }
}
