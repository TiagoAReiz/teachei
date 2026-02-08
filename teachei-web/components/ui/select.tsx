"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

export interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function Select({ 
  className, 
  label, 
  error, 
  options, 
  placeholder, 
  value, 
  onChange,
  disabled 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (newValue: string) => {
    if (disabled) return;
    onChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between bg-background/50 border-2 border-transparent text-foreground rounded-full h-[56px] px-6 transition-all duration-300 text-sm font-bold shadow-inner hover:bg-white hover:shadow-lg hover:shadow-primary/5",
          isOpen && "bg-white shadow-lg shadow-primary/10 border-primary/10 ring-2 ring-primary/20",
          disabled && "opacity-50 cursor-not-allowed hover:bg-background/50 hover:shadow-none",
          error && "border-error/50 bg-error/5 text-error",
          className
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-muted-foreground font-medium")}>
          {selectedOption ? selectedOption.label : (placeholder || "Selecione...")}
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 animate-scale-in origin-top">
          <div className="bg-surface rounded-[1.5rem] shadow-2xl shadow-primary/20 border border-white/20 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar p-2">
            {options.length > 0 ? (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group",
                      isSelected 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground hover:bg-white hover:text-primary hover:shadow-md hover:shadow-primary/5"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check size={16} className="text-primary" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-muted text-center font-medium">
                Nenhuma opção
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs text-error font-bold ml-2">{error}</p>
      )}
    </div>
  );
}



