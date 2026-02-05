import { create } from "zustand";
import { TipoVeiculo, Marca, Modelo } from "@/types";

interface CreateIntentionState {
  // Step 1 - Category
  tipoVeiculo: TipoVeiculo | null;
  
  // Step 2 - Vehicle
  marca: Marca | null;
  modelo: Modelo | null;
  
  // Step 3 - Specs
  anoMinimo: number | null;
  anoMaximo: number | null;
  cores: string[];
  precoMinimo: number | null;
  precoMaximo: number | null;
  transmissao: string | null;
  combustivel: string | null;
  opcionais: string[];  // Array of optional codes
  observacoes: string;
  
  // Actions
  setTipoVeiculo: (tipo: TipoVeiculo) => void;
  setMarca: (marca: Marca) => void;
  setModelo: (modelo: Modelo) => void;
  setAnoMinimo: (ano: number | null) => void;
  setAnoMaximo: (ano: number | null) => void;
  setCores: (cores: string[]) => void;
  setPrecoMinimo: (preco: number | null) => void;
  setPrecoMaximo: (preco: number | null) => void;
  setTransmissao: (transmissao: string | null) => void;
  setCombustivel: (combustivel: string | null) => void;
  setOpcionais: (opcionais: string[]) => void;
  toggleOpcional: (codigo: string) => void;
  setObservacoes: (observacoes: string) => void;
  reset: () => void;
}

const initialState = {
  tipoVeiculo: null,
  marca: null,
  modelo: null,
  anoMinimo: null,
  anoMaximo: null,
  cores: [],
  precoMinimo: null,
  precoMaximo: null,
  transmissao: null,
  combustivel: null,
  opcionais: [],
  observacoes: "",
};

export const useCreateIntentionStore = create<CreateIntentionState>((set, get) => ({
  ...initialState,
  
  setTipoVeiculo: (tipoVeiculo) => set({ tipoVeiculo, marca: null, modelo: null, opcionais: [] }),
  setMarca: (marca) => set({ marca, modelo: null }),
  setModelo: (modelo) => set({ modelo }),
  setAnoMinimo: (anoMinimo) => set({ anoMinimo }),
  setAnoMaximo: (anoMaximo) => set({ anoMaximo }),
  setCores: (cores) => set({ cores }),
  setPrecoMinimo: (precoMinimo) => set({ precoMinimo }),
  setPrecoMaximo: (precoMaximo) => set({ precoMaximo }),
  setTransmissao: (transmissao) => set({ transmissao }),
  setCombustivel: (combustivel) => set({ combustivel }),
  setOpcionais: (opcionais) => set({ opcionais }),
  toggleOpcional: (codigo) => {
    const current = get().opcionais;
    if (current.includes(codigo)) {
      set({ opcionais: current.filter((c) => c !== codigo) });
    } else {
      set({ opcionais: [...current, codigo] });
    }
  },
  setObservacoes: (observacoes) => set({ observacoes }),
  reset: () => set(initialState),
}));



