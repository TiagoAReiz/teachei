"use client";

import { useState, useMemo, type ReactNode } from "react";
import { Search, X } from "lucide-react";
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

export interface SearchableListItem {
  id: string;
  label: string;
  sublabel?: string;
}

export interface SearchableListProps<T extends SearchableListItem> {
  items: T[];
  selectedId?: string | null;
  onSelect: (item: T) => void;
  placeholder?: string;
  emptyMessage?: string;
  maxHeight?: string;
  renderItem?: (item: T, isSelected: boolean, highlightedLabel: ReactNode) => ReactNode;
  className?: string;
}

export function SearchableList<T extends SearchableListItem>({
  items,
  selectedId,
  onSelect,
  placeholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado",
  maxHeight = "max-h-60",
  renderItem,
  className,
}: SearchableListProps<T>) {
  const [search, setSearch] = useState("");

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    
    const normalizedSearch = normalizeText(search);
    return items.filter((item) => {
      const normalizedLabel = normalizeText(item.label);
      const normalizedSublabel = item.sublabel ? normalizeText(item.sublabel) : "";
      return normalizedLabel.includes(normalizedSearch) || 
             normalizedSublabel.includes(normalizedSearch);
    });
  }, [items, search]);

  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className={cn("border border-border rounded-xl overflow-hidden", className)}>
      {/* Search Input */}
      <div className="sticky top-0 bg-surface border-b border-border p-2">
        <div className="relative">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" 
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-background border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-lg h-10 pl-10 pr-10 focus:ring-2 focus:ring-primary transition-all text-sm"
          />
          {search && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className={cn("overflow-y-auto p-2 space-y-1", maxHeight)}>
        {filteredItems.length === 0 ? (
          <div className="p-4 text-center text-muted text-sm">
            {search ? `${emptyMessage} "${search}"` : emptyMessage}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isSelected = selectedId === item.id;
            const highlightedLabel = highlightMatch(item.label, search);

            if (renderItem) {
              return (
                <div key={item.id} onClick={() => onSelect(item)}>
                  {renderItem(item, isSelected, highlightedLabel)}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left",
                  isSelected
                    ? "bg-primary text-white"
                    : "hover:bg-muted/10"
                )}
              >
                <span className="font-medium">{highlightedLabel}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
