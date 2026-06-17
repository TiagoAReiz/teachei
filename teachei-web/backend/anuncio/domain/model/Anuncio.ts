import type { StatusAnuncio } from "./StatusAnuncio";

export type TipoVeiculo = "CARRO" | "MOTO" | "CAMINHAO";

export interface VeiculoInfo {
  marcaCodigo?: string;
  marcaNome?: string;
  modeloCodigo?: string;
  modeloNome?: string;
  modeloBaseNome?: string;
  versoes?: { codigo: string; nome: string }[];
  todasVersoes?: boolean;
  anos: number[];
  cores: string[];
  precoMaximo: number;
  precoFipeReferencia?: number;
  quilometragemMinima?: number;
  quilometragemMaxima?: number;
  opcionais?: string[];
  dadosManuais: boolean;
  fotoReferenciaUrl?: string;
}

export interface ContatoInfo {
  whatsapp?: string;
  whatsappLink?: string;
  instagram?: string;
  cidade?: string;
  estado?: string;
}

export interface Anuncio {
  id: string;
  usuarioId: string;
  tipo: TipoVeiculo;
  status: StatusAnuncio;
  veiculo: VeiculoInfo;
  contato: ContatoInfo;
  observacoes?: string;
  criadoEm: string;
  expiraEm?: string;
}
