"use client";

import { useState } from "react";
import { ArrowUpDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "RECENTE", label: "Mais recentes" },
  { value: "PRECO_ASC", label: "Menor preço" },
  { value: "PRECO_DESC", label: "Maior preço" },
  { value: "KM_ASC", label: "Menor km" },
  { value: "ANO_DESC", label: "Ano mais novo" },
  { value: "NOME_ASC", label: "A-Z" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl",
          "text-sm font-medium text-foreground hover:bg-muted/10 transition-colors",
          className
        )}
      >
        <ArrowUpDown size={16} />
        <span className="hidden sm:inline">{selectedOption.label}</span>
        <span className="sm:hidden">Ordenar</span>
      </button>

      {/* Bottom Sheet Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Bottom Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-muted/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Ordenar por</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Options */}
            <div className="py-2 max-h-[60vh] overflow-y-auto">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-4",
                    "text-left transition-colors",
                    option.value === value
                      ? "bg-primary/5 text-primary"
                      : "text-foreground hover:bg-muted/5"
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.value === value && <Check size={20} className="text-primary" />}
                </button>
              ))}
            </div>

            {/* Safe area for bottom nav */}
            <div className="h-6" />
          </div>
        </div>
      )}

      {/* Desktop Dropdown */}
      {isOpen && (
        <div
          className="hidden lg:block fixed inset-0 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute top-[200px] right-8 w-56 bg-surface border border-border rounded-xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3",
                    "text-left text-sm transition-colors",
                    option.value === value
                      ? "bg-primary/5 text-primary"
                      : "text-foreground hover:bg-muted/5"
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.value === value && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { SORT_OPTIONS };
