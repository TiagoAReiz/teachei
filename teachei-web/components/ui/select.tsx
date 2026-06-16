"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Search } from "lucide-react";

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export interface SelectProps {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  portal?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function Select({
  className,
  label,
  error,
  options,
  placeholder,
  value,
  onChange,
  disabled,
  portal = false,
  searchable = false,
  searchPlaceholder = "Buscar...",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const filtered = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const q = normalizeText(search);
    return options.filter((o) => normalizeText(o.label).includes(q));
  }, [options, search, searchable]);

  const updatePosition = () => {
    if (portal && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inContainer = containerRef.current?.contains(target);
      const inPortal = portal && (target as Element).closest("[data-select-portal]");
      if (!inContainer && !inPortal) {
        setIsOpen(false);
        setSearch("");
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, portal]);

  useEffect(() => {
    if (!isOpen || !portal) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, portal]);

  useEffect(() => {
    if (isOpen && searchable) setTimeout(() => searchRef.current?.focus(), 50);
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) updatePosition();
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (newValue: string) => {
    if (disabled) return;
    onChange?.(newValue);
    setIsOpen(false);
    setSearch("");
  };

  const dropdownContent = (
    <div
      className="bg-surface rounded-[1.5rem] shadow-2xl shadow-primary/20 border border-white/20 overflow-hidden p-2 animate-scale-in origin-top"
      data-select-portal
    >
      {searchable && (
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
      )}
      <div className="max-h-60 overflow-y-auto custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map((option) => {
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
                {isSelected && <Check size={16} className="text-primary flex-shrink-0" />}
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
  );

  return (
    <div className="w-full relative" ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
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

      {isOpen && (
        portal && typeof window !== "undefined"
          ? createPortal(
              <div style={dropdownStyle}>{dropdownContent}</div>,
              document.body
            )
          : <div className="absolute top-full left-0 right-0 mt-2 z-50">{dropdownContent}</div>
      )}

      {error && (
        <p className="mt-2 text-xs text-error font-bold ml-2">{error}</p>
      )}
    </div>
  );
}
