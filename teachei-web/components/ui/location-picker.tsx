"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEstados, getCidades } from "@/lib/ibge";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

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

interface SearchableDropdownProps {
  label: string;
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  searchPlaceholder: string;
  emptyMessage: string;
}

function SearchableDropdown({
  label,
  value,
  placeholder,
  options,
  onChange,
  isLoading,
  disabled,
  error,
  searchPlaceholder,
  emptyMessage,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = normalizeText(search);
    return options.filter((o) => normalizeText(o.label).includes(q));
  }, [options, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        !(target as Element).closest("[data-location-dropdown]")
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen]);

  const handleToggle = () => {
    if (disabled || isLoading) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled || isLoading}
        className={cn(
          "w-full flex items-center justify-between bg-background/50 border-2 border-transparent text-foreground rounded-full h-[56px] px-6 transition-all duration-300 text-sm font-bold shadow-inner hover:bg-white hover:shadow-lg hover:shadow-primary/5",
          isOpen && "bg-white shadow-lg shadow-primary/10 border-primary/10 ring-2 ring-primary/20",
          (disabled || isLoading) && "opacity-50 cursor-not-allowed hover:bg-background/50 hover:shadow-none",
          error && "border-error/50 bg-error/5 text-error"
        )}
      >
        <span className={cn("truncate", !selected && "text-muted-foreground font-medium")}>
          {isLoading ? "Carregando..." : (selected ? selected.label : placeholder)}
        </span>
        <ChevronDown
          size={20}
          className={cn(
            "text-muted-foreground transition-transform duration-300 ml-2 flex-shrink-0",
            isOpen && "rotate-180 text-primary",
            error && "text-error"
          )}
        />
      </button>

      {error && <p className="mt-2 text-xs text-error font-bold ml-2">{error}</p>}

      {isOpen && typeof window !== "undefined" && createPortal(
        <div style={dropdownStyle} data-location-dropdown>
          <div className="bg-surface rounded-[1.5rem] shadow-2xl shadow-primary/20 border border-white/20 overflow-hidden p-2 animate-scale-in origin-top">
            <div className="relative mb-1 px-1 pt-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-background/60 text-foreground placeholder:text-muted text-sm rounded-xl h-9 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div className="max-h-52 overflow-y-auto custom-scrollbar">
              {filtered.length > 0 ? (
                filtered.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-white hover:text-primary hover:shadow-md hover:shadow-primary/5"
                      )}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check size={16} className="text-primary flex-shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-sm text-muted text-center font-medium">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
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
  const { data: estados = [], isLoading: isLoadingEstados } = useQuery({
    queryKey: ["ibge", "estados"],
    queryFn: getEstados,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  const { data: cidades = [], isLoading: isLoadingCidades } = useQuery({
    queryKey: ["ibge", "cidades", estado],
    queryFn: () => getCidades(estado),
    enabled: !!estado,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (estado && cidade && cidades.length > 0) {
      if (!cidades.some((c) => c.nome === cidade)) {
        onCidadeChange("");
      }
    }
  }, [estado, cidades, cidade, onCidadeChange]);

  const estadoOptions = estados.map((e) => ({ value: e.sigla, label: e.nome }));
  const cidadeOptions = cidades.map((c) => ({ value: c.nome, label: c.nome }));

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <SearchableDropdown
        label="Estado"
        value={estado}
        placeholder="Selecione"
        options={estadoOptions}
        onChange={onEstadoChange}
        isLoading={isLoadingEstados}
        disabled={disabled}
        error={estadoError}
        searchPlaceholder="Buscar estado..."
        emptyMessage="Nenhum estado encontrado"
      />
      <SearchableDropdown
        label="Cidade"
        value={cidade}
        placeholder={!estado ? "Selecione o estado" : "Selecione"}
        options={cidadeOptions}
        onChange={onCidadeChange}
        isLoading={isLoadingCidades}
        disabled={disabled || !estado}
        error={cidadeError}
        searchPlaceholder="Buscar cidade..."
        emptyMessage="Nenhuma cidade encontrada"
      />
    </div>
  );
}
