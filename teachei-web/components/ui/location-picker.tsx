"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEstados, getCidades } from "@/lib/ibge";

export interface LocationPickerProps {
  estado: string;
  cidade: string;
  onEstadoChange: (estado: string) => void;
  onCidadeChange: (cidade: string) => void;
  estadoError?: string;
  cidadeError?: string;
  disabled?: boolean;
  className?: string;
}

export function LocationPicker({
  estado,
  cidade,
  onEstadoChange,
  onCidadeChange,
  estadoError,
  cidadeError,
  disabled = false,
  className,
}: LocationPickerProps) {
  // Fetch states (cached for 1 hour)
  const { data: estados = [], isLoading: isLoadingEstados } = useQuery({
    queryKey: ["ibge", "estados"],
    queryFn: getEstados,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Fetch cities for selected state
  const { data: cidades = [], isLoading: isLoadingCidades } = useQuery({
    queryKey: ["ibge", "cidades", estado],
    queryFn: () => getCidades(estado),
    enabled: !!estado,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  // Clear city when state changes
  useEffect(() => {
    if (estado && cidade) {
      // Check if current city exists in new state's cities
      const cidadeExists = cidades.some((c) => c.nome === cidade);
      if (!cidadeExists && cidades.length > 0) {
        onCidadeChange("");
      }
    }
  }, [estado, cidades, cidade, onCidadeChange]);

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {/* Estado Select */}
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          Estado
        </label>
        <div className="relative">
          <select
            value={estado}
            onChange={(e) => onEstadoChange(e.target.value)}
            disabled={disabled || isLoadingEstados}
            className={cn(
              "w-full appearance-none bg-surface border-0 ring-1 ring-border text-foreground rounded-full h-[52px] px-4 pr-10 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              estadoError && "ring-error focus:ring-error"
            )}
          >
            <option value="">
              {isLoadingEstados ? "Carregando..." : "Selecione"}
            </option>
            {estados.map((e) => (
              <option key={e.sigla} value={e.sigla}>
                {e.nome}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted">
            <ChevronDown size={20} />
          </div>
        </div>
        {estadoError && (
          <p className="mt-2 text-sm text-error">{estadoError}</p>
        )}
      </div>

      {/* Cidade Select */}
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          Cidade
        </label>
        <div className="relative">
          <select
            value={cidade}
            onChange={(e) => onCidadeChange(e.target.value)}
            disabled={disabled || !estado || isLoadingCidades}
            className={cn(
              "w-full appearance-none bg-surface border-0 ring-1 ring-border text-foreground rounded-full h-[52px] px-4 pr-10 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base cursor-pointer",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              cidadeError && "ring-error focus:ring-error"
            )}
          >
            <option value="">
              {!estado
                ? "Selecione o estado"
                : isLoadingCidades
                ? "Carregando..."
                : "Selecione"}
            </option>
            {cidades.map((c) => (
              <option key={c.nome} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted">
            <ChevronDown size={20} />
          </div>
        </div>
        {cidadeError && (
          <p className="mt-2 text-sm text-error">{cidadeError}</p>
        )}
      </div>
    </div>
  );
}
