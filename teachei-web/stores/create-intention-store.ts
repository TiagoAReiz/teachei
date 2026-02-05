import { create } from "zustand";
import type { TipoVeiculo, VersaoSelecionada } from "@/types";

interface CreateIntentionState {
  // Step 1: Category
  tipoVeiculo: TipoVeiculo | null;
  
  // Step 2: Vehicle - Base model and versions
  marcaCodigo: string | null;
  marcaNome: string | null;
  modeloBaseNome: string | null; // Base model name (e.g., "Onix")
  versoesSelecionadas: VersaoSelecionada[]; // Selected versions
  todasVersoes: boolean; // If true, all versions are accepted
  
  // Legacy fields for backwards compatibility
  modeloCodigo: string | null;
  modeloNome: string | null;
  
  // Step 3: Specs
  anoMinimo: number | null;
  anoMaximo: number | null;
  cores: string[];
  precoMinimo: number | null;
  precoMaximo: number | null;
  quilometragemMinima: number | null;
  quilometragemMaxima: number | null;
  opcionais: string[];
  observacoes: string;
  
  // Step 4: Location
  cidade: string;
  estado: string;
  
  // Optional reference photo
  fotoReferenciaBase64: string | null;
  
  // Actions
  setTipoVeiculo: (tipo: TipoVeiculo) => void;
  setMarca: (codigo: string, nome: string) => void;
  setModeloBase: (baseName: string) => void;
  setVersoes: (versoes: VersaoSelecionada[]) => void;
  setTodasVersoes: (todas: boolean, allVersions?: VersaoSelecionada[]) => void;
  toggleVersao: (versao: VersaoSelecionada) => void;
  // Legacy setModelo for backwards compatibility
  setModelo: (codigo: string, nome: string) => void;
  setAnos: (min: number | null, max: number | null) => void;
  setCores: (cores: string[]) => void;
  setPreco: (min: number | null, max: number | null) => void;
  setQuilometragem: (min: number | null, max: number | null) => void;
  setOpcionais: (opcionais: string[]) => void;
  setObservacoes: (obs: string) => void;
  setLocalizacao: (cidade: string, estado: string) => void;
  setFotoReferencia: (base64: string | null) => void;
  reset: () => void;
  
  // Helper to get the primary model for API submission
  getPrimaryModel: () => { codigo: string | null; nome: string | null };
  // Helper to get additional versions text for observacoes
  getVersionsText: () => string;
}

const initialState = {
  tipoVeiculo: null,
  marcaCodigo: null,
  marcaNome: null,
  modeloBaseNome: null,
  versoesSelecionadas: [] as VersaoSelecionada[],
  todasVersoes: false,
  modeloCodigo: null,
  modeloNome: null,
  anoMinimo: null,
  anoMaximo: null,
  cores: [],
  precoMinimo: null,
  precoMaximo: null,
  quilometragemMinima: null,
  quilometragemMaxima: null,
  opcionais: [] as string[],
  observacoes: "",
  cidade: "",
  estado: "",
  fotoReferenciaBase64: null,
};

export const useCreateIntentionStore = create<CreateIntentionState>((set, get) => ({
  ...initialState,
  
  setTipoVeiculo: (tipo) => set({ 
    tipoVeiculo: tipo, 
    marcaCodigo: null, 
    marcaNome: null, 
    modeloBaseNome: null,
    versoesSelecionadas: [],
    todasVersoes: false,
    modeloCodigo: null, 
    modeloNome: null,
    opcionais: [], // Clear optionals when changing vehicle type
  }),
  
  setMarca: (codigo, nome) => set({ 
    marcaCodigo: codigo, 
    marcaNome: nome, 
    modeloBaseNome: null,
    versoesSelecionadas: [],
    todasVersoes: false,
    modeloCodigo: null, 
    modeloNome: null 
  }),
  
  setModeloBase: (baseName) => set({ 
    modeloBaseNome: baseName,
    versoesSelecionadas: [],
    todasVersoes: false,
    modeloCodigo: null,
    modeloNome: null,
  }),
  
  setVersoes: (versoes) => {
    const first = versoes[0];
    set({ 
      versoesSelecionadas: versoes,
      todasVersoes: false,
      // Update legacy fields with first selected version
      modeloCodigo: first?.codigo || null,
      modeloNome: first?.nome || null,
    });
  },
  
  setTodasVersoes: (todas, allVersions) => {
    if (todas && allVersions) {
      const first = allVersions[0];
      set({
        todasVersoes: true,
        versoesSelecionadas: allVersions,
        modeloCodigo: first?.codigo || null,
        modeloNome: first?.nome || null,
      });
    } else {
      set({
        todasVersoes: false,
        versoesSelecionadas: [],
        modeloCodigo: null,
        modeloNome: null,
      });
    }
  },
  
  toggleVersao: (versao) => {
    const current = get().versoesSelecionadas;
    const exists = current.some(v => v.codigo === versao.codigo);
    
    let newVersoes: VersaoSelecionada[];
    if (exists) {
      newVersoes = current.filter(v => v.codigo !== versao.codigo);
    } else {
      newVersoes = [...current, versao];
    }
    
    const first = newVersoes[0];
    set({
      versoesSelecionadas: newVersoes,
      todasVersoes: false, // Uncheck "all" when manually toggling
      modeloCodigo: first?.codigo || null,
      modeloNome: first?.nome || null,
    });
  },
  
  // Legacy method for backwards compatibility
  setModelo: (codigo, nome) => set({ 
    modeloCodigo: codigo, 
    modeloNome: nome,
    versoesSelecionadas: [{ codigo, nome }],
    todasVersoes: false,
  }),
  
  setAnos: (min, max) => set({ anoMinimo: min, anoMaximo: max }),
  setCores: (cores) => set({ cores }),
  setPreco: (min, max) => set({ precoMinimo: min, precoMaximo: max }),
  setQuilometragem: (min, max) => set({ quilometragemMinima: min, quilometragemMaxima: max }),
  setOpcionais: (opcionais) => set({ opcionais }),
  setObservacoes: (obs) => set({ observacoes: obs }),
  setLocalizacao: (cidade, estado) => set({ cidade, estado }),
  setFotoReferencia: (base64) => set({ fotoReferenciaBase64: base64 }),
  reset: () => set(initialState),
  
  getPrimaryModel: () => {
    const state = get();
    if (state.versoesSelecionadas.length > 0) {
      return {
        codigo: state.versoesSelecionadas[0].codigo,
        nome: state.versoesSelecionadas[0].nome,
      };
    }
    return {
      codigo: state.modeloCodigo,
      nome: state.modeloNome,
    };
  },
  
  getVersionsText: () => {
    const state = get();
    
    if (state.todasVersoes && state.modeloBaseNome) {
      return `Aceito qualquer versão do modelo ${state.modeloBaseNome}`;
    }
    
    if (state.versoesSelecionadas.length > 1) {
      const versions = state.versoesSelecionadas.map(v => v.nome).join(", ");
      return `Versões aceitas: ${versions}`;
    }
    
    return "";
  },
}));
