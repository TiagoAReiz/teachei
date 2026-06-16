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
          className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Mobile: starts below the floating header (top-4 + h-20 = 96px)
          and ends above the bottom nav (h-20 = 80px) with a small gap */}
      <aside
        className={cn(
          "fixed top-24 bottom-24 left-4 right-4 z-[60] bg-surface shadow-xl rounded-[2rem] overflow-hidden transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-[120%]"
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



