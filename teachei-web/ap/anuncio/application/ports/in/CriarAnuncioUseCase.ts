import type { Anuncio, TipoVeiculo } from "@/ap/anuncio/domain/model/Anuncio";
export interface CriarAnuncioInput {
  tipo: TipoVeiculo; marcaCodigo?: string; marcaNome?: string;
  modeloCodigo?: string; modeloNome?: string; modeloBaseNome?: string;
  versoes?: { codigo: string; nome: string }[]; todasVersoes?: boolean;
  anos: number[]; cores: string[]; precoMaximo: number;
  quilometragemMinima?: number; quilometragemMaxima?: number;
  opcionais?: string[]; observacoes?: string; dadosManuais?: boolean;
  cidade?: string; estado?: string; fotoReferenciaUrl?: string;
}
export interface CriarAnuncioUseCase {
  execute(usuarioId: string, data: CriarAnuncioInput): Promise<Anuncio>;
}
