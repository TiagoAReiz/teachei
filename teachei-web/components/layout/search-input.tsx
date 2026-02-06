"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current URL search value  
  const urlSearch = searchParams.get("search") || "";
  
  // Local input state
  const [localSearch, setLocalSearch] = useState(urlSearch);
  
  // Debounce the local search value
  const debouncedSearch = useDebounce(localSearch, 500);
  
  // Track what we've navigated to prevent loops
  const lastNavigatedRef = useRef(urlSearch);
  
  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  }, []);
  
  // Navigate when debounced value changes
  useEffect(() => {
    const trimmedSearch = debouncedSearch.trim();
    
    // Only navigate if different from what we last navigated to
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
  }, [debouncedSearch, router, searchParams]);
  
  // Sync input when URL changes externally (back button, filter clearing)
  useEffect(() => {
    // Only sync if URL changed to something different than what we navigated to
    if (urlSearch !== lastNavigatedRef.current) {
      lastNavigatedRef.current = urlSearch;
      // Sync local state with URL - this is intentional for external navigation (back button)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSearch(urlSearch);
    }
  }, [urlSearch]);

  return (
    <div className={className}>
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={handleChange}
          placeholder="Buscar por marca ou modelo..."
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
