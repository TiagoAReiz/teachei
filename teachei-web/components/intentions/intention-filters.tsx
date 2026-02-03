"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterSidebar, type FilterState } from "./filter-sidebar";
import { SortDropdown } from "./sort-dropdown";
import type { TipoVeiculo, SortOption } from "@/types";

const vehicleTypeLabels: Record<string, string> = {
  CARRO: "Carros",
  MOTO: "Motos",
  CAMINHAO: "Caminhões",
};

interface IntentionFiltersProps {
  className?: string;
}

export function IntentionFilters({ className }: IntentionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Parse current filters from URL
  const currentFilters: FilterState = useMemo(() => ({
    tipo: (searchParams.get("tipo") as TipoVeiculo) || "",
    marca: searchParams.get("marca") || "",
    modelo: searchParams.get("modelo") || "",
    versao: searchParams.get("versao") || "",
    opcionais: searchParams.get("opcionais")?.split(",").filter(Boolean) || [],
    precoMin: searchParams.get("precoMin") ? parseInt(searchParams.get("precoMin")!) : null,
    precoMax: searchParams.get("precoMax") ? parseInt(searchParams.get("precoMax")!) : null,
    anoMin: searchParams.get("anoMin") ? parseInt(searchParams.get("anoMin")!) : null,
    anoMax: searchParams.get("anoMax") ? parseInt(searchParams.get("anoMax")!) : null,
  }), [searchParams]);

  const currentSearch = searchParams.get("search") || "";
  const currentSort = (searchParams.get("ordenar") as SortOption) || "RECENTE";

  // Count active filters (excluding search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentFilters.tipo) count++;
    if (currentFilters.marca) count++;
    if (currentFilters.modelo) count++;
    if (currentFilters.versao) count++;
    if (currentFilters.opcionais.length > 0) count++;
    if (currentFilters.precoMin !== null || currentFilters.precoMax !== null) count++;
    if (currentFilters.anoMin !== null || currentFilters.anoMax !== null) count++;
    return count;
  }, [currentFilters]);

  const hasFilters = activeFilterCount > 0 || currentSearch;

  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "RECENTE") {
      params.delete("ordenar");
    } else {
      params.set("ordenar", sort);
    }
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const handleApplyFilters = (filters: FilterState) => {
    const params = new URLSearchParams();
    
    // Preserve search
    if (currentSearch) {
      params.set("search", currentSearch);
    }
    
    // Preserve sort order
    if (currentSort !== "RECENTE") {
      params.set("ordenar", currentSort);
    }
    
    // Apply new filters
    if (filters.tipo) params.set("tipo", filters.tipo);
    if (filters.marca) params.set("marca", filters.marca);
    
    // Handle model/version filtering
    if (filters.modelo) {
      // Keep the base model name for UI state
      params.set("modelo", filters.modelo);
      
      if (filters.modeloCodigos && filters.modeloCodigos.length > 0) {
        if (filters.modeloCodigos.length === 1) {
          // Single version - use modeloCodigo
          params.set("modeloCodigo", filters.modeloCodigos[0]);
        } else {
          // Multiple versions - use modelos (comma-separated)
          params.set("modelos", filters.modeloCodigos.join(","));
        }
      }
    }
    
    if (filters.opcionais.length > 0) params.set("opcionais", filters.opcionais.join(","));
    if (filters.precoMin !== null) params.set("precoMin", filters.precoMin.toString());
    if (filters.precoMax !== null) params.set("precoMax", filters.precoMax.toString());
    if (filters.anoMin !== null) params.set("anoMin", filters.anoMin.toString());
    if (filters.anoMax !== null) params.set("anoMax", filters.anoMax.toString());

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  const clearFilters = () => {
    if (currentSearch) {
      router.push(`/?search=${encodeURIComponent(currentSearch)}`);
    } else {
      router.push("/");
    }
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    
    // Clear dependent filters
    if (key === "tipo") {
      params.delete("marca");
      params.delete("modelo");
      params.delete("versao");
      params.delete("modeloCodigo");
      params.delete("modelos");
    }
    if (key === "marca") {
      params.delete("modelo");
      params.delete("versao");
      params.delete("modeloCodigo");
      params.delete("modelos");
    }
    if (key === "modelo") {
      params.delete("versao");
      params.delete("modeloCodigo");
      params.delete("modelos");
    }
    if (key === "versao") {
      params.delete("modeloCodigo");
      params.delete("modelos");
    }
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  // Remove range filters (min and max) in a single navigation
  const removeRangeFilter = (minKey: string, maxKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(minKey);
    params.delete(maxKey);
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mobile Filter/Sort Bar - Sticky below search */}
      <div className="flex items-center gap-3 lg:hidden sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted/10 transition-colors"
        >
          <Filter size={16} />
          <span>Filtrar</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full px-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        <SortDropdown
          value={currentSort}
          onChange={handleSortChange}
          className="flex-1"
        />

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted hover:text-foreground transition-colors whitespace-nowrap"
          >
            Limpar
          </button>
        )}
      </div>
      
      {/* Desktop Sort - hidden on mobile */}
      <div className="hidden lg:flex items-center justify-end">
        <SortDropdown
          value={currentSort}
          onChange={handleSortChange}
        />
      </div>

      {/* Active Filters Display */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {currentFilters.tipo && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              {vehicleTypeLabels[currentFilters.tipo] || currentFilters.tipo}
              <button
                onClick={() => removeFilter("tipo")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {currentFilters.marca && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              Marca selecionada
              <button
                onClick={() => removeFilter("marca")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}
          
          {currentFilters.modelo && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              {currentFilters.modelo}
              <button
                onClick={() => removeFilter("modelo")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {currentFilters.versao && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              Versão selecionada
              <button
                onClick={() => removeFilter("versao")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {currentFilters.opcionais.length > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              {currentFilters.opcionais.length} opcional(is)
              <button
                onClick={() => removeFilter("opcionais")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {(currentFilters.precoMin !== null || currentFilters.precoMax !== null) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              Faixa de preço
              <button
                onClick={() => removeRangeFilter("precoMin", "precoMax")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {(currentFilters.anoMin !== null || currentFilters.anoMax !== null) && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              Faixa de ano
              <button
                onClick={() => removeRangeFilter("anoMin", "anoMax")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}

          {currentSearch && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              &quot;{currentSearch}&quot;
              <button
                onClick={() => removeFilter("search")}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        initialFilters={currentFilters}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
