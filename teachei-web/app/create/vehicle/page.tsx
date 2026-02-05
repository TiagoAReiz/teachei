"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, ChevronRight, ChevronDown, Check, Search, X } from "lucide-react";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useBrands, useModels } from "@/hooks/use-vehicles";
import { useCreateIntentionStore } from "@/stores/create-intention-store";
import { groupModelsByBase, getVersionName } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

/**
 * Normalize text for search (remove accents, lowercase)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Highlight matching text in a string
 */
function highlightMatch(text: string, query: string): ReactNode {
  if (!query.trim()) return text;
  
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  const index = normalizedText.indexOf(normalizedQuery);
  
  if (index === -1) return text;
  
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  
  return (
    <>
      {before}
      <span className="font-bold text-primary">{match}</span>
      {after}
    </>
  );
}

/**
 * Search input component
 */
function SearchInput({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder: string;
}) {
  return (
    <div className="sticky top-0 z-10 pb-2 -mx-2 px-2 bg-background">
      <div className="relative">
        <Search 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" 
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-muted/5 border border-border text-foreground placeholder:text-muted rounded-xl h-11 pl-10 pr-10 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
        />
        {value && (
          <button
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function CreateVehiclePage() {
  const router = useRouter();
  const {
    tipoVeiculo,
    marcaCodigo,
    marcaNome,
    modeloBaseNome,
    versoesSelecionadas,
    todasVersoes,
    setMarca,
    setModeloBase,
    toggleVersao,
    setTodasVersoes,
  } = useCreateIntentionStore();

  // Search states
  const [brandSearch, setBrandSearch] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [versionSearch, setVersionSearch] = useState("");

  // Redirect if no type selected
  useEffect(() => {
    if (!tipoVeiculo) {
      router.push("/create");
    }
  }, [tipoVeiculo, router]);

  const { data: brands, isLoading: isLoadingBrands } = useBrands(tipoVeiculo);
  const { data: models, isLoading: isLoadingModels } = useModels(tipoVeiculo, marcaCodigo);

  // Group models by base name
  const groupedModels = useMemo(() => {
    if (!models) return [];
    return groupModelsByBase(models);
  }, [models]);

  // Filter brands by search
  const filteredBrands = useMemo(() => {
    if (!brands) return [];
    if (!brandSearch.trim()) return brands;
    
    const normalizedSearch = normalizeText(brandSearch);
    return brands.filter((brand) => 
      normalizeText(brand.nome).includes(normalizedSearch)
    );
  }, [brands, brandSearch]);

  // Filter models by search
  const filteredModels = useMemo(() => {
    if (!groupedModels.length) return [];
    if (!modelSearch.trim()) return groupedModels;
    
    const normalizedSearch = normalizeText(modelSearch);
    return groupedModels.filter((group) => 
      normalizeText(group.baseName).includes(normalizedSearch)
    );
  }, [groupedModels, modelSearch]);

  // Get the currently selected group's versions
  const currentGroup = useMemo(() => {
    if (!modeloBaseNome) return null;
    return groupedModels.find(g => g.baseName === modeloBaseNome);
  }, [groupedModels, modeloBaseNome]);

  // Filter versions by search
  const filteredVersions = useMemo(() => {
    if (!currentGroup) return [];
    if (!versionSearch.trim()) return currentGroup.versoes;
    
    const normalizedSearch = normalizeText(versionSearch);
    return currentGroup.versoes.filter((version) => 
      normalizeText(version.nome).includes(normalizedSearch)
    );
  }, [currentGroup, versionSearch]);

  const handleSelectBrand = (codigo: string, nome: string) => {
    setMarca(codigo, nome);
    setModelSearch("");
    setVersionSearch("");
  };

  const handleSelectBase = (baseName: string) => {
    setModeloBase(baseName);
    setVersionSearch("");
  };

  const handleToggleVersion = (codigo: string, nome: string) => {
    toggleVersao({ codigo, nome });
  };

  const handleSelectAll = () => {
    if (!currentGroup) return;
    
    if (todasVersoes) {
      // Deselect all
      setTodasVersoes(false);
    } else {
      // Select all versions
      const allVersions = currentGroup.versoes.map(v => ({
        codigo: v.codigo,
        nome: v.nome,
      }));
      setTodasVersoes(true, allVersions);
    }
  };

  const handleContinue = () => {
    if (marcaCodigo && versoesSelecionadas.length > 0) {
      router.push("/create/specs");
    }
  };

  const canContinue = marcaCodigo && versoesSelecionadas.length > 0;

  if (!tipoVeiculo) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Qual veículo você procura?
        </h1>
        <p className="text-muted">
          Selecione a marca, modelo e versões desejadas
        </p>
      </div>

      {/* Brand Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Marca
        </label>
        
        {isLoadingBrands ? (
          <div className="space-y-2 border border-border rounded-xl p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="border border-border rounded-xl p-2">
            <SearchInput
              value={brandSearch}
              onChange={setBrandSearch}
              placeholder="Buscar marca..."
            />
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredBrands.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm">
                  Nenhuma marca encontrada para &quot;{brandSearch}&quot;
                </div>
              ) : (
                filteredBrands.map((brand) => {
                  const isSelected = marcaCodigo === brand.codigo;
                  return (
                    <button
                      key={brand.codigo}
                      onClick={() => handleSelectBrand(brand.codigo, brand.nome)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left",
                        isSelected
                          ? "bg-primary text-white"
                          : "hover:bg-muted/10"
                      )}
                    >
                      <span className="font-medium">
                        {isSelected ? brand.nome : highlightMatch(brand.nome, brandSearch)}
                      </span>
                      <ChevronRight size={18} className={isSelected ? "text-white" : "text-muted"} />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Model Selection (Grouped) */}
      {marcaCodigo && (
        <div className="space-y-3 animate-slide-up">
          <label className="block text-sm font-medium text-foreground">
            Modelo
          </label>
          
          {isLoadingModels ? (
            <div className="space-y-2 border border-border rounded-xl p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-xl p-2">
              <SearchInput
                value={modelSearch}
                onChange={setModelSearch}
                placeholder="Buscar modelo..."
              />
              <div className="max-h-72 overflow-y-auto space-y-1">
                {filteredModels.length === 0 ? (
                  <div className="p-4 text-center text-muted text-sm">
                    Nenhum modelo encontrado para &quot;{modelSearch}&quot;
                  </div>
                ) : (
                  filteredModels.map((group) => {
                    const isSelected = modeloBaseNome === group.baseName;
                    const versionCount = group.versoes.length;
                    
                    return (
                      <button
                        key={group.baseName}
                        onClick={() => handleSelectBase(group.baseName)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left",
                          isSelected
                            ? "bg-primary text-white"
                            : "hover:bg-muted/10"
                        )}
                      >
                        <div>
                          <span className="font-medium">
                            {isSelected ? group.baseName : highlightMatch(group.baseName, modelSearch)}
                          </span>
                          <span className={cn(
                            "ml-2 text-sm",
                            isSelected ? "text-white/80" : "text-muted"
                          )}>
                            ({versionCount} {versionCount === 1 ? "versão" : "versões"})
                          </span>
                        </div>
                        {isSelected ? (
                          <ChevronDown size={18} className="text-white" />
                        ) : (
                          <ChevronRight size={18} className="text-muted" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Version Selection (Multi-select) */}
      {currentGroup && (
        <div className="space-y-3 animate-slide-up">
          <label className="block text-sm font-medium text-foreground">
            Versões do {modeloBaseNome}
          </label>
          
          <div className="border border-border rounded-xl p-2 space-y-2">
            {/* Search for versions */}
            {currentGroup.versoes.length > 5 && (
              <SearchInput
                value={versionSearch}
                onChange={setVersionSearch}
                placeholder="Buscar versão..."
              />
            )}

            {/* Select All Option */}
            <button
              onClick={handleSelectAll}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left border-b border-border pb-3 mb-1",
                todasVersoes
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/10"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                todasVersoes ? "bg-primary border-primary" : "border-muted"
              )}>
                {todasVersoes && (
                  <Check size={14} className="text-white" />
                )}
              </div>
              <span className="font-medium">Selecionar todas as versões</span>
            </button>

            {/* Individual Versions */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredVersions.length === 0 ? (
                <div className="p-4 text-center text-muted text-sm">
                  Nenhuma versão encontrada para &quot;{versionSearch}&quot;
                </div>
              ) : (
                filteredVersions.map((version) => {
                  const isSelected = versoesSelecionadas.some(v => v.codigo === version.codigo);
                  const versionName = getVersionName(version.nome, modeloBaseNome || "");
                  
                  return (
                    <button
                      key={version.codigo}
                      onClick={() => handleToggleVersion(version.codigo, version.nome)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/10"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                        isSelected ? "bg-primary border-primary" : "border-muted"
                      )}>
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                      <span className="font-medium">
                        {isSelected ? versionName : highlightMatch(versionName, versionSearch)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {versoesSelecionadas.length > 0 && (
            <p className="text-sm text-success">
              {todasVersoes 
                ? "Todas as versões selecionadas" 
                : `${versoesSelecionadas.length} versão(ões) selecionada(s)`
              }
            </p>
          )}
        </div>
      )}

      {/* Selected Summary */}
      {marcaNome && versoesSelecionadas.length > 0 && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl animate-scale-in">
          <p className="text-sm text-muted mb-1">Selecionado:</p>
          <p className="font-bold text-foreground">
            {marcaNome} {modeloBaseNome}
          </p>
          {todasVersoes ? (
            <p className="text-sm text-muted mt-1">Todas as versões</p>
          ) : versoesSelecionadas.length > 1 ? (
            <p className="text-sm text-muted mt-1">
              {versoesSelecionadas.length} versões selecionadas
            </p>
          ) : (
            <p className="text-sm text-muted mt-1">
              {getVersionName(versoesSelecionadas[0].nome, modeloBaseNome || "")}
            </p>
          )}
        </div>
      )}

      <Button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full"
        size="lg"
      >
        <span>Continuar</span>
        <ArrowRight size={20} />
      </Button>
    </div>
  );
}
