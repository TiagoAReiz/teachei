import { ValidationError } from "@/backend/shared/errors";
import { ForbiddenError } from "@/backend/shared/errors";
import type { Anuncio, TipoVeiculo } from "@/backend/anuncio/domain/model/Anuncio";

const TIPOS_VALIDOS: TipoVeiculo[] = ["CARRO", "MOTO", "CAMINHAO"];

export class AnuncioService {
  static validarAnuncio(data: { tipo: TipoVeiculo; precoMaximo: number; anos: number[]; cores: string[] }): void {
    if (!TIPOS_VALIDOS.includes(data.tipo)) throw new ValidationError("Tipo de veículo inválido");
    if (data.precoMaximo <= 0) throw new ValidationError("Preço máximo deve ser maior que zero");
    if (!data.anos || data.anos.length === 0) throw new ValidationError("Pelo menos um ano deve ser informado");
  }

  static calcularExpiracao(): Date {
    const expira = new Date();
    expira.setDate(expira.getDate() + 30);
    return expira;
  }

  static verificarProprietario(anuncio: Anuncio, usuarioId: string): void {
    if (anuncio.usuarioId !== usuarioId) throw new ForbiddenError("Você não tem permissão para modificar este anúncio");
  }
}
