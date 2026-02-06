import api from "./api";
import { API_ENDPOINTS } from "@/constants/config";
import {
  TipoVeiculo,
  Marca,
  Modelo,
  Ano,
  MarcasResponse,
  ModelosResponse,
  AnosResponse,
  PrecoFipeResponse,
  FiltrosDisponiveis,
  OpcionalOption,
} from "@/types";

export const vehiclesService = {
  /**
   * Get vehicle brands for a given type
   * Backend returns { marcas: [...] }, we unwrap it
   */
  async getMarcas(tipoVeiculo: TipoVeiculo): Promise<Marca[]> {
    const tipo = tipoVeiculo.toLowerCase();
    const response = await api.get<MarcasResponse>(
      API_ENDPOINTS.VEHICLE_BRANDS(tipo)
    );
    return response.data.marcas;
  },

  /**
   * Get models for a given brand
   * Backend returns { modelos: [...] }, we unwrap it
   */
  async getModelos(
    tipoVeiculo: TipoVeiculo,
    marcaCodigo: string
  ): Promise<Modelo[]> {
    const tipo = tipoVeiculo.toLowerCase();
    const response = await api.get<ModelosResponse>(
      API_ENDPOINTS.VEHICLE_MODELS(tipo, marcaCodigo)
    );
    return response.data.modelos;
  },

  /**
   * Get years for a given model
   * Backend returns { anos: [...] }, we unwrap it
   */
  async getAnos(
    tipoVeiculo: TipoVeiculo,
    marcaCodigo: string,
    modeloCodigo: string
  ): Promise<Ano[]> {
    const tipo = tipoVeiculo.toLowerCase();
    const response = await api.get<AnosResponse>(
      API_ENDPOINTS.VEHICLE_YEARS(tipo, marcaCodigo, modeloCodigo)
    );
    return response.data.anos;
  },

  /**
   * Get FIPE price for a specific vehicle
   */
  async getPrecoFipe(
    tipoVeiculo: TipoVeiculo,
    marcaCodigo: string,
    modeloCodigo: string,
    anoCodigo: string
  ): Promise<PrecoFipeResponse> {
    const tipo = tipoVeiculo.toLowerCase();
    const response = await api.get<PrecoFipeResponse>(
      API_ENDPOINTS.VEHICLE_PRICE(tipo, marcaCodigo, modeloCodigo, anoCodigo)
    );
    return response.data;
  },

  /**
   * Get available optionals, optionally filtered by vehicle type.
   * When no type is provided, returns all optionals from all types.
   */
  async getOpcionais(tipoVeiculo?: TipoVeiculo | null): Promise<OpcionalOption[]> {
    const params: Record<string, string> = {};
    if (tipoVeiculo) {
      params.tipo = tipoVeiculo;
    }
    const response = await api.get<FiltrosDisponiveis>(
      API_ENDPOINTS.INTENTIONS_FILTERS,
      { params }
    );
    return response.data.opcionais || [];
  },
};
