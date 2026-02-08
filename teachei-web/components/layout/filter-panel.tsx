"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Car, Bike, Truck, ChevronLeft, ChevronRight, ChevronDown, MapPin } from "lucide-react";
import { Button, Select, CurrencyInput, MileageInput } from "@/components/ui";
import { useAvailableFilters, useAvailableLocations } from "@/hooks/use-intentions";
import { cn, generateYearOptions } from "@/lib/utils";
import type { TipoVeiculo } from "@/types";

const vehicleTypeConfig: Record<TipoVeiculo, { label: string; icon: typeof Car }> = {
  CARRO: { label: "Carros", icon: Car },
  MOTO: { label: "Motos", icon: Bike },
  CAMINHAO: { label: "Caminhões", icon: Truck },
};

interface FilterState {
  cidade: string;
  estado: string;
  tipo: TipoVeiculo | "";
  marca: string;
  modelo: string; // Base model name (e.g., "Onix")
  versao: string; // Specific version code (e.g., "1234-5")
  opcionais: string[];
  precoMin: number | null;
  precoMax: number | null;
  anoMin: number | null;
  anoMax: number | null;
  kmMin: number | null;
  kmMax: number | null;
}

interface FilterPanelProps {
  className?: string;
  onCloseMobile?: () => void;
}

export function FilterPanel({ className, onCloseMobile }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpcionaisOpen, setIsOpcionaisOpen] = useState(false);

  // Parse current filters from URL
  const [filters, setFilters] = useState<FilterState>({
    cidade: searchParams.get("cidade") || "",
    estado: searchParams.get("estado") || "",
    tipo: (searchParams.get("tipo") as TipoVeiculo) || "",
    marca: searchParams.get("marca") || "",
    modelo: searchParams.get("modelo") || "",
    versao: searchParams.get("versao") || "",
    opcionais: searchParams.get("opcionais")?.split(",").filter(Boolean) || [],
    precoMin: searchParams.get("precoMin") ? parseInt(searchParams.get("precoMin")!) : null,
    precoMax: searchParams.get("precoMax") ? parseInt(searchParams.get("precoMax")!) : null,
    anoMin: searchParams.get("anoMin") ? parseInt(searchParams.get("anoMin")!) : null,
    anoMax: searchParams.get("anoMax") ? parseInt(searchParams.get("anoMax")!) : null,
    kmMin: searchParams.get("kmMin") ? parseInt(searchParams.get("kmMin")!) : null,
    kmMax: searchParams.get("kmMax") ? parseInt(searchParams.get("kmMax")!) : null,
  });

  // Fetch available filter options based on existing intentions
  // Always pass null for tipo to get all available types (we want to show all type buttons)
  // Only marca is filtered based on the selected type
  const { data: availableFilters, isLoading: isLoadingFilters, error: filtersError } = useAvailableFilters(
    null, // Always get all types to show all available type buttons
    filters.marca || null
  );
  
  // Fetch types and brands filtered by selected type (for brand/model options)
  const { data: filteredOptions, isLoading: isLoadingFilteredOptions, error: filteredOptionsError } = useAvailableFilters(
    filters.tipo || null,
    filters.marca || null
  );

  const { data: availableLocations } = useAvailableLocations();

  // Build year options (includes next year)
  const allYearOptions = generateYearOptions(30);
  
  // Filter max year options based on selected min year
  const yearOptionsMin = allYearOptions;
  const yearOptionsMax = useMemo(() => {
    if (!filters.anoMin) return allYearOptions;
    return allYearOptions.filter(opt => parseInt(opt.value) >= filters.anoMin!);
  }, [allYearOptions, filters.anoMin]);
  
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

  const handleLocalizacaoChange = (value: string) => {
    if (value) {
      const [cidade, estado] = value.split("|");
      const newFilters = { ...filters, cidade, estado };
      setFilters(newFilters);
      applyFilters(newFilters);
    } else {
      const newFilters = { ...filters, cidade: "", estado: "" };
      setFilters(newFilters);
      applyFilters(newFilters);
    }
  };

  const applyFilters = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (newFilters.cidade) params.set("cidade", newFilters.cidade);
    if (newFilters.estado) params.set("estado", newFilters.estado);
    if (newFilters.tipo) params.set("tipo", newFilters.tipo);
    if (newFilters.marca) params.set("marca", newFilters.marca);
    
    // Handle model/version filtering
    if (newFilters.modelo) {
      // Keep the base model name for UI state
      params.set("modelo", newFilters.modelo);
      
      if (newFilters.versao) {
        // Specific version selected - send that version code
        params.set("modeloCodigo", newFilters.versao);
      } else {
        // No specific version - send all version codes for this base model
        const versions = groupedModels.get(newFilters.modelo);
        if (versions && versions.length > 0) {
          const allCodes = versions.map((v) => v.codigo).join(",");
          params.set("modelos", allCodes);
        }
      }
    }
    
    if (newFilters.opcionais.length > 0) params.set("opcionais", newFilters.opcionais.join(","));
    if (newFilters.precoMin !== null) params.set("precoMin", newFilters.precoMin.toString());
    if (newFilters.precoMax !== null) params.set("precoMax", newFilters.precoMax.toString());
    if (newFilters.anoMin !== null) params.set("anoMin", newFilters.anoMin.toString());
    if (newFilters.anoMax !== null) params.set("anoMax", newFilters.anoMax.toString());
    if (newFilters.kmMin !== null) params.set("kmMin", newFilters.kmMin.toString());
    if (newFilters.kmMax !== null) params.set("kmMax", newFilters.kmMax.toString());
    
    // Keep search param if exists
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleTipoChange = (tipo: TipoVeiculo | "") => {
    // Clear optionals when changing vehicle type (they are type-specific)
    const newFilters = { ...filters, tipo, marca: "", modelo: "", versao: "", opcionais: [] };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleMarcaChange = (marca: string) => {
    const newFilters = { ...filters, marca, modelo: "", versao: "" };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleModeloChange = (modelo: string) => {
    const newFilters = { ...filters, modelo, versao: "" };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleVersaoChange = (versao: string) => {
    const newFilters = { ...filters, versao };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const toggleOpcional = (opcional: string) => {
    const newOpcionais = filters.opcionais.includes(opcional)
      ? filters.opcionais.filter((o) => o !== opcional)
      : [...filters.opcionais, opcional];
    const newFilters = { ...filters, opcionais: newOpcionais };
    setFilters(newFilters);
    applyFilters(newFilters);
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
    applyFilters(cleared);
    onCloseMobile?.();
  };

  const handleApply = () => {
    applyFilters(filters);
    onCloseMobile?.();
  };

  return (
    <div className={cn("w-72 mx-4 my-4 h-[calc(100%-2rem)] bg-surface border-0 shadow-xl shadow-primary/5 rounded-[2rem] flex flex-col overflow-hidden transition-all duration-300", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-4 bg-gradient-to-b from-primary/5 to-transparent">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          Filtros
        </h2>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-2 rounded-full text-muted hover:text-primary hover:bg-white hover:shadow-md transition-all lg:hidden"
            title="Fechar filtros"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 custom-scrollbar">
        {localizacaoOptions.length > 1 && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              Localização
            </label>
            <Select
              options={localizacaoOptions}
              value={filters.cidade && filters.estado ? `${filters.cidade}|${filters.estado}` : ""}
              onChange={(e) => handleLocalizacaoChange(e.target.value)}
              disabled={isLoadingFilters}
              className="text-sm bg-background/50 border-0 shadow-inner rounded-xl h-12"
            />
          </div>
        )}
        {/* Vehicle Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
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
                    "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-300 w-full group",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30 transform scale-[1.02]"
                      : "bg-background/50 text-muted-foreground hover:bg-white hover:text-primary hover:shadow-md"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-xl transition-colors",
                    isActive ? "bg-white/20" : "bg-white group-hover:bg-primary/10"
                  )}>
                    <Icon size={16} />
                  </div>
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand */}
        {marcaOptions.length > 1 && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Marca
            </label>
            <Select
              options={marcaOptions}
              value={filters.marca}
              onChange={(e) => handleMarcaChange(e.target.value)}
              disabled={isLoadingFilters}
              className="text-sm bg-background/50 border-0 shadow-inner rounded-xl h-12"
            />
          </div>
        )}

        {/* Model */}
        {modeloOptions.length > 1 && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Modelo
            </label>
            <Select
              options={modeloOptions}
              value={filters.modelo}
              onChange={(e) => handleModeloChange(e.target.value)}
              disabled={isLoadingFilters}
              className="text-sm bg-background/50 border-0 shadow-inner rounded-xl h-12"
            />
          </div>
        )}

        {/* Version (shown when base model is selected and has versions) */}
        {filters.modelo && versaoOptions.length > 1 && (
          <div className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Versão
            </label>
            <Select
              options={versaoOptions}
              value={filters.versao}
              onChange={(e) => handleVersaoChange(e.target.value)}
              className="text-sm bg-background/50 border-0 shadow-inner rounded-xl h-12"
            />
          </div>
        )}

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setIsOpcionaisOpen(!isOpcionaisOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-transparent hover:border-primary/20 hover:shadow-lg transition-all shadow-sm text-sm font-bold text-foreground group"
          >
            <span className="flex items-center gap-2">
              Opcionais
              {filters.opcionais.length > 0 && (
                <span className="min-w-5 h-5 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full px-1.5 shadow-md shadow-primary/30">
                  {filters.opcionais.length}
                </span>
              )}
            </span>
            <ChevronDown size={16} className={cn("transition-transform text-muted-foreground group-hover:text-primary", isOpcionaisOpen && "rotate-180")} />
          </button>
          {isOpcionaisOpen && (() => {
            const opcionaisData = filters.tipo ? filteredOptions?.opcionais : availableFilters?.opcionais;
            const isLoading = filters.tipo ? isLoadingFilteredOptions : isLoadingFilters;
            const hasError = filters.tipo ? filteredOptionsError : filtersError;

            if (hasError) {
              return (
                <p className="text-xs text-error py-2 font-medium">
                  Erro ao carregar opcionais.
                </p>
              );
            }
            if (isLoading) {
              return (
                <div className="py-4 flex justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              );
            }
            if (opcionaisData && opcionaisData.length > 0) {
              return (
                <div className="grid grid-cols-1 gap-2 p-2 bg-background/30 rounded-2xl">
                  {opcionaisData.map((option) => {
                    const isSelected = filters.opcionais.includes(option.codigo);
                    return (
                      <button
                        key={option.codigo}
                        onClick={() => toggleOpcional(option.codigo)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left text-xs font-medium",
                          isSelected
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "hover:bg-white hover:text-foreground hover:shadow-sm text-muted-foreground"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          isSelected ? "bg-primary border-primary" : "border-muted-foreground/30 bg-white"
                        )}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="truncate">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              );
            }
            return (
              <p className="text-xs text-muted py-2">
                Nenhum opcional disponível.
              </p>
            );
          })()}
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Faixa de Preço
          </label>
          <div className="grid grid-cols-2 gap-3">
            <CurrencyInput
              label=""
              placeholder="Mínimo"
              value={filters.precoMin}
              onChange={(value) => setFilters((prev) => ({ ...prev, precoMin: value }))}
              className="bg-white shadow-sm border-0 rounded-xl h-10 text-sm"
            />
            <CurrencyInput
              label=""
              placeholder="Máximo"
              value={filters.precoMax}
              onChange={(value) => setFilters((prev) => ({ ...prev, precoMax: value }))}
              className="bg-white shadow-sm border-0 rounded-xl h-10 text-sm"
            />
          </div>
          {priceError && (
            <p className="text-xs text-error font-bold bg-error/10 p-2 rounded-lg">{priceError}</p>
          )}
        </div>

        {/* Mileage Range */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Quilometragem
          </label>
          <div className="grid grid-cols-2 gap-3">
            <MileageInput
              label=""
              placeholder="Mínima"
              value={filters.kmMin}
              onChange={(value) => setFilters((prev) => ({ ...prev, kmMin: value }))}
              className="bg-white shadow-sm border-0 rounded-xl h-10 text-sm"
            />
            <MileageInput
              label=""
              placeholder="Máxima"
              value={filters.kmMax}
              onChange={(value) => setFilters((prev) => ({ ...prev, kmMax: value }))}
              className="bg-white shadow-sm border-0 rounded-xl h-10 text-sm"
            />
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Faixa de Ano
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Select
              options={[{ value: "", label: "De" }, ...yearOptionsMin]}
              value={filters.anoMin?.toString() || ""}
              onChange={(e) => {
                const newMin = e.target.value ? parseInt(e.target.value) : null;
                setFilters((prev) => {
                  // Reset max if it would become invalid
                  const newMax = prev.anoMax && newMin && prev.anoMax < newMin ? null : prev.anoMax;
                  return { ...prev, anoMin: newMin, anoMax: newMax };
                });
              }}
              className="text-sm bg-white shadow-sm border-0 rounded-xl h-10"
            />
            <Select
              options={[{ value: "", label: "Até" }, ...yearOptionsMax]}
              value={filters.anoMax?.toString() || ""}
              onChange={(e) => setFilters((prev) => ({ 
                ...prev, 
                anoMax: e.target.value ? parseInt(e.target.value) : null 
              }))}
              className="text-sm bg-white shadow-sm border-0 rounded-xl h-10"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-surface border-t border-border/50 flex gap-3">
        <Button variant="ghost" onClick={handleClear} className="flex-1 text-xs font-bold text-muted-foreground hover:text-foreground" size="sm">
          Limpar
        </Button>
        <Button onClick={handleApply} className="flex-1 text-xs font-bold shadow-lg shadow-primary/20" size="sm" disabled={!!priceError}>
          Aplicar
        </Button>
      </div>
    </div>
  );
}
