"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, Check, ArrowLeft } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  const selectedOption = SORT_OPTIONS.find((o) => o.value === value) || SORT_OPTIONS[0];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, isMobile]);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center gap-2 px-6 py-3 bg-surface border-0 rounded-full",
          "text-sm font-bold text-foreground hover:bg-white hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 shadow-sm",
          isOpen && "ring-2 ring-primary/20",
          className
        )}
      >
        <ArrowUpDown size={18} className="text-primary" />
        <span className="hidden sm:inline">{selectedOption.label}</span>
        <span className="sm:hidden">Ordenar</span>
      </button>

      {/* Mobile Fullscreen Modal */}
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-[60] bg-background animate-in fade-in duration-200">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-surface border-b border-border">
            <div className="flex items-center h-16 px-4">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -ml-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="ml-4 text-lg font-semibold text-foreground">Ordenar por</h1>
            </div>
          </header>

          {/* Options */}
          <div className="p-4">
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              {SORT_OPTIONS.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full flex items-center justify-between px-5 py-4",
                    "text-left transition-colors",
                    index < SORT_OPTIONS.length - 1 && "border-b border-border",
                    option.value === value
                      ? "bg-primary/5"
                      : "hover:bg-muted/5"
                  )}
                >
                  <span className={cn(
                    "text-base font-medium",
                    option.value === value ? "text-primary" : "text-foreground"
                  )}>
                    {option.label}
                  </span>
                  {option.value === value && (
                    <Check size={22} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Dropdown */}
      {isOpen && !isMobile && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {isOpen && !isMobile && (
        <div
          className="absolute top-full right-0 mt-2 w-64 bg-surface rounded-[1.5rem] shadow-2xl shadow-primary/20 border border-white/20 overflow-hidden z-50 animate-scale-in origin-top-right p-2"
          onClick={(e) => e.stopPropagation()}
        >
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl",
                "text-left text-sm font-bold transition-all duration-200",
                option.value === value
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-white hover:text-primary hover:shadow-md hover:shadow-primary/5"
              )}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && <Check size={16} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { SORT_OPTIONS };
