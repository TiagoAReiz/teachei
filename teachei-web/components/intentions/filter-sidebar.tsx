"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Car, Bike, Truck, Loader2, AlertCircle, MapPin, ChevronDown, Search } from "lucide-react";
import { Button, Select, CurrencyInput, MileageInput } from "@/components/ui";
import { useAvailableFilters, useAvailableLocations } from "@/hooks/use-intentions";
import { cn } from "@/lib/utils";
import type { TipoVeiculo, AvailableOpcional } from "@/types";

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

const vehicleTypeConfig: Record<TipoVeiculo, { label: string; icon: typeof Car }> = {
  CARRO: { label: "Carros", icon: Car },
  MOTO: { label: "Motos", icon: Bike },
  CAMINHAO: { label: "Caminhões", icon: Truck },
};

export interface FilterState {
  cidade: string;
  estado: string;
  tipo: TipoVeiculo | "";
  marca: string;
  modelo: string; // Base model name (e.g., "Onix")
  versao: string; // Specific version code (e.g., "1234-5")
  modeloCodigos?: string[]; // All version codes for base model (computed when applying)
  opcionais: string[];
  precoMin: number | null;
  precoMax: number | null;
  anoMin: number | null;
  anoMax: number | null;
  kmMin: number | null;
  kmMax: number | null;
}

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

export function FilterSidebar({ isOpen, onClose, initialFilters, onApply }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [isOpcionaisOpen, setIsOpcionaisOpen] = useState(false);
  const [opcionaisSearch, setOpcionaisSearch] = useState("");

  // Reset local state when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Fetch all available types (regardless of current selection)
  const { data: availableFilters, isLoading: isLoadingFilters, error: filtersError } = useAvailableFilters(
    null, // Always get all types to show all available type buttons
    null
  );
  
  // Fetch brands and models filtered by selected type/brand
  const { data: filteredOptions, isLoading: isLoadingFilteredOptions, error: filteredOptionsError } = useAvailableFilters(
    filters.tipo || null,
    filters.marca || null
  );

  // Fetch available locations from intentions (works independently of backend filters endpoint)
  const { data: availableLocations } = useAvailableLocations();

  
  // Price validation error
  const priceError = useMemo(() => {
    if (filters.precoMin !== null && filters.precoMax !== null && filters.precoMin > filters.precoMax) {
      return "Preço mínimo não pode ser maior que máximo";
    }
    return null;
  }, [filters.precoMin, filters.precoMax]);

  // Build available vehicle types (only those with intentions)
  const availableTypes = useMemo(() => {
    const types: { value: TipoVeiculo | ""; label: string; icon: typeof Car }[] = [
      { value: "", label: "Todos", icon: Car },
    ];
    const tiposList = availableFilters?.tipos;
    if (tiposList) {
      for (const tipo of tiposList) {
        const config = vehicleTypeConfig[tipo];
        if (config) {
          types.push({ value: tipo, label: config.label, icon: config.icon });
        }
      }
    }
    return types;
  }, [availableFilters]);

  // Build location options - use dedicated locations hook (primary), fallback to filters endpoint
  const localizacaoOptions = useMemo(() => {
    const locs = (availableLocations && availableLocations.length > 0)
      ? availableLocations
      : availableFilters?.localizacoes;
    if (!locs || locs.length === 0) return [];
    return [
      { value: "", label: "Todas as localizações" },
      ...locs.map((loc) => ({
        value: `${loc.cidade}|${loc.estado}`,
        label: `${loc.cidade} - ${loc.estado}`,
      })),
    ];
  }, [availableLocations, availableFilters]);

  // Build brand options (filtered by selected type)
  const marcaOptions = useMemo(() => {
    const marcas = filteredOptions?.marcas;
    return [
      { value: "", label: "Todas as marcas" },
      ...(marcas?.map((m) => ({ value: m.codigo, label: m.nome })) || []),
    ];
  }, [filteredOptions]);
  
  // Group models by base name (filtered by selected type and brand)
  const groupedModels = useMemo(() => {
    type ModeloArray = NonNullable<typeof filteredOptions>["modelos"];
    const modelos = filteredOptions?.modelos;
    if (!modelos) return new Map<string, ModeloArray>();
    const groups = new Map<string, ModeloArray>();
    for (const modelo of modelos) {
      const baseName = modelo.baseNome || modelo.nome.split(" ")[0];
      if (!groups.has(baseName)) {
        groups.set(baseName, []);
      }
      groups.get(baseName)!.push(modelo);
    }
    return groups;
  }, [filteredOptions]);

  // Build base model options (grouped)
  const modeloOptions = useMemo(() => [
    { value: "", label: "Todos os modelos" },
    ...Array.from(groupedModels.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([baseName, versions]) => ({
        value: baseName,
        label: versions.length > 1 ? `${baseName} (${versions.length})` : baseName,
      })),
  ], [groupedModels]);

  // Get versions for selected base model
  const currentVersions = useMemo(() => {
    if (!filters.modelo) return [];
    return groupedModels.get(filters.modelo) || [];
  }, [groupedModels, filters.modelo]);

  // Build version options for selected base model
  const versaoOptions = useMemo(() => {
    if (currentVersions.length === 0) return [];
    return [
      { value: "", label: "Todas as versões" },
      ...currentVersions.map((v) => ({
        value: v.codigo,
        label: v.nome.replace(filters.modelo, "").trim() || v.nome,
      })),
    ];
  }, [currentVersions, filters.modelo]);

  const handleLocalizacaoChange = (value: string) => {
    if (value) {
      const [cidade, estado] = value.split("|");
      setFilters((prev) => ({ ...prev, cidade, estado }));
    } else {
      setFilters((prev) => ({ ...prev, cidade: "", estado: "" }));
    }
  };

  const handleTipoChange = (tipo: TipoVeiculo | "") => {
    setFilters((prev) => ({
      ...prev,
      tipo,
      marca: "",
      modelo: "",
      versao: "",
      opcionais: [], // Clear optionals when changing vehicle type
    }));
  };

  // Get available optionals - filtered by tipo when selected, or all when not
  const opcionaisDisponiveis: AvailableOpcional[] = useMemo(() => {
    if (filters.tipo) {
      return filteredOptions?.opcionais || [];
    }
    // Show all opcionais when no tipo is selected
    return availableFilters?.opcionais || [];
  }, [filters.tipo, filteredOptions, availableFilters]);

  const handleMarcaChange = (marca: string) => {
    setFilters((prev) => ({
      ...prev,
      marca,
      modelo: "",
      versao: "",
    }));
  };

  const handleModeloChange = (modelo: string) => {
    setFilters((prev) => ({
      ...prev,
      modelo,
      versao: "",
    }));
  };

  const handleVersaoChange = (versao: string) => {
    setFilters((prev) => ({
      ...prev,
      versao,
    }));
  };

  const toggleOpcional = (opcional: string) => {
    setFilters((prev) => ({
      ...prev,
      opcionais: prev.opcionais.includes(opcional)
        ? prev.opcionais.filter((o) => o !== opcional)
        : [...prev.opcionais, opcional],
    }));
  };

  const handleClear = () => {
    const cleared: FilterState = {
      cidade: "",
      estado: "",
      tipo: "",
      marca: "",
      modelo: "",
      versao: "",
      opcionais: [],
      precoMin: null,
      precoMax: null,
      anoMin: null,
      anoMax: null,
      kmMin: null,
      kmMax: null,
    };
    setFilters(cleared);
    onApply(cleared);
    onClose();
  };

  const handleApply = () => {
    // Compute version codes for the selected model
    const filtersWithCodes: FilterState = { ...filters };
    if (filters.modelo && !filters.versao) {
      // No specific version selected - include all version codes
      const versions = groupedModels.get(filters.modelo);
      if (versions) {
        filtersWithCodes.modeloCodigos = versions.map((v) => v.codigo);
      }
    } else if (filters.versao) {
      // Specific version selected - just that code
      filtersWithCodes.modeloCodigos = [filters.versao];
    }
    onApply(filtersWithCodes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed inset-0 bg-surface z-50 shadow-xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Filtros</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Location */}
          {localizacaoOptions.length > 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                Localização
              </label>
              <Select
                options={localizacaoOptions}
                value={filters.cidade && filters.estado ? `${filters.cidade}|${filters.estado}` : ""}
                onChange={(value) => handleLocalizacaoChange(value)}
                disabled={isLoadingFilters}
              />
            </div>
          )}

          {/* Vehicle Type */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Tipo de Veículo
            </label>
            <div className="flex flex-col gap-2">
              {availableTypes.map((type) => {
                const Icon = type.icon;
                const isActive = filters.tipo === type.value;

                return (
                  <button
                    key={type.value}
                    onClick={() => handleTipoChange(type.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors w-full",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-background border border-border text-foreground hover:bg-muted/10"
                    )}
                  >
                    <Icon size={16} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand */}
          {marcaOptions.length > 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Marca
              </label>
              <Select
                options={marcaOptions}
                value={filters.marca}
                onChange={(value) => handleMarcaChange(value)}
                disabled={isLoadingFilters}
                portal
                searchable
                searchPlaceholder="Buscar marca..."
              />
            </div>
          )}

          {/* Model */}
          {modeloOptions.length > 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Modelo
              </label>
              <Select
                options={modeloOptions}
                value={filters.modelo}
                onChange={(value) => handleModeloChange(value)}
                disabled={isLoadingFilters}
                portal
                searchable
                searchPlaceholder="Buscar modelo..."
              />
            </div>
          )}

          {/* Version (shown when base model is selected and has versions) */}
          {filters.modelo && versaoOptions.length > 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Versão
              </label>
              <Select
                options={versaoOptions}
                value={filters.versao}
                onChange={(value) => handleVersaoChange(value)}
                portal
              />
            </div>
          )}

          {/* Optional Features - collapsible dropdown */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setIsOpcionaisOpen(!isOpcionaisOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                Opcionais
                {filters.opcionais.length > 0 && (
                  <span className="min-w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full px-1">
                    {filters.opcionais.length}
                  </span>
                )}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "text-muted transition-transform duration-200",
                  isOpcionaisOpen && "rotate-180"
                )}
              />
            </button>

            {isOpcionaisOpen && (
              <div className="rounded-xl border border-border bg-background p-3">
                {(filters.tipo ? filteredOptionsError : filtersError) ? (
                  <div className="flex items-center gap-2 py-2 text-error">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Erro ao carregar opcionais</span>
                  </div>
                ) : (filters.tipo ? isLoadingFilteredOptions : isLoadingFilters) ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted">Carregando opcionais...</span>
                  </div>
                ) : opcionaisDisponiveis.length > 0 ? (
                  <>
                    <div className="relative mb-2">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                      <input
                        type="text"
                        value={opcionaisSearch}
                        onChange={(e) => setOpcionaisSearch(e.target.value)}
                        placeholder="Buscar opcional..."
                        className="w-full bg-background/60 border border-border text-foreground placeholder:text-muted text-sm rounded-xl h-8 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto">
                      {opcionaisDisponiveis.filter(o =>
                        !opcionaisSearch.trim() || normalizeText(o.label).includes(normalizeText(opcionaisSearch))
                      ).map((option) => {
                        const isSelected = filters.opcionais.includes(option.codigo);
                        return (
                          <button
                            key={option.codigo}
                            onClick={() => toggleOpcional(option.codigo)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left text-sm",
                              isSelected
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-muted text-foreground"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                              isSelected ? "bg-primary border-primary" : "border-muted"
                            )}>
                              {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="truncate">{option.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted py-1">
                    Nenhum opcional disponível.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Faixa de Preço
            </label>
            <div className="grid grid-cols-2 gap-4">
              <CurrencyInput
                label=""
                placeholder="Mínimo"
                value={filters.precoMin}
                onChange={(value) => setFilters((prev) => ({ ...prev, precoMin: value }))}
              />
              <CurrencyInput
                label=""
                placeholder="Máximo"
                value={filters.precoMax}
                onChange={(value) => setFilters((prev) => ({ ...prev, precoMax: value }))}
              />
            </div>
            {priceError && (
              <p className="text-xs text-error">{priceError}</p>
            )}
          </div>

          {/* Mileage Range */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Quilometragem
            </label>
            <div className="grid grid-cols-2 gap-4">
              <MileageInput
                label=""
                placeholder="Mínima"
                value={filters.kmMin}
                onChange={(value) => setFilters((prev) => ({ ...prev, kmMin: value }))}
              />
              <MileageInput
                label=""
                placeholder="Máxima"
                value={filters.kmMax}
                onChange={(value) => setFilters((prev) => ({ ...prev, kmMax: value }))}
              />
            </div>
          </div>

          {/* Year */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Ano
            </label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Ex: 2020"
              min={1900}
              max={new Date().getFullYear() + 1}
              value={filters.anoMin ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                setFilters((prev) => ({ ...prev, anoMin: val, anoMax: val }));
              }}
              className="w-full bg-background/50 border-2 border-transparent text-foreground rounded-full h-[56px] px-6 text-sm font-bold shadow-inner focus:outline-none focus:bg-white focus:border-primary/10 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-border bg-surface flex gap-3">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            Limpar
          </Button>
          <Button onClick={handleApply} className="flex-1" disabled={!!priceError}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </>
  );
}
