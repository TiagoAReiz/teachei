"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ className, value, onChange, placeholder }: SearchInputProps) {
  const controlled = value !== undefined && onChange !== undefined;

  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(localSearch, 500);
  const lastNavigatedRef = useRef(urlSearch);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (controlled) {
      onChange(e.target.value);
    } else {
      setLocalSearch(e.target.value);
    }
  }, [controlled, onChange]);

  useEffect(() => {
    if (controlled) return;
    const trimmedSearch = debouncedSearch.trim();
    if (trimmedSearch === lastNavigatedRef.current) return;
    lastNavigatedRef.current = trimmedSearch;
    const params = new URLSearchParams(searchParams.toString());
    if (trimmedSearch.length >= 2) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }
    const queryString = params.toString();
    router.push(queryString ? `/feed?${queryString}` : "/feed");
  }, [controlled, debouncedSearch, router, searchParams]);

  useEffect(() => {
    if (controlled) return;
    if (urlSearch !== lastNavigatedRef.current) {
      lastNavigatedRef.current = urlSearch;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSearch(urlSearch);
    }
  }, [controlled, urlSearch]);

  return (
    <div className={className}>
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={controlled ? value : localSearch}
          onChange={handleChange}
          placeholder={placeholder ?? "Buscar por marca ou modelo..."}
          className="w-full bg-background border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-full h-10 pl-11 pr-4 focus:ring-2 focus:ring-primary transition-all text-sm"
        />
      </div>
    </div>
  );
}

// Fallback component for Suspense
export function SearchInputFallback({ className }: SearchInputProps) {
  return (
    <div className={className}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por marca ou modelo..."
          className="w-full bg-background border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-full h-10 pl-11 pr-4 text-sm"
          disabled
        />
      </div>
    </div>
  );
}
