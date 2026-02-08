"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FilterPanel } from "./filter-panel";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pages that should show the filter sidebar
const FILTER_PAGES = ["/", "/feed"];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Only show on feed pages
  const showFilters = FILTER_PAGES.some(
    (page) => pathname === page || (page !== "/" && pathname.startsWith(page))
  );

  if (!showFilters) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-surface shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Suspense fallback={<div className="w-full h-full bg-surface/50 animate-pulse" />}>
          <FilterPanel 
            className="h-full"
            onCloseMobile={onClose}
          />
        </Suspense>
      </aside>

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed top-32 left-0 h-[calc(100vh-8rem)] z-40 transition-all duration-300",
          "hidden lg:block",
          "w-80"
        )}
      >
        <Suspense fallback={<div className="w-full h-full bg-surface/50 animate-pulse rounded-[2rem] mx-4" />}>
          <FilterPanel 
            className="h-full shadow-2xl shadow-primary/10"
          />
        </Suspense>
      </aside>
    </>
  );
}



