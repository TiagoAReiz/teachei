"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FilterPanel } from "./filter-panel";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// Pages that should show the filter sidebar
const FILTER_PAGES = ["/", "/feed"];

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  // Only show filter sidebar on filter-enabled pages
  const showFilters = FILTER_PAGES.some(
    (page) => pathname === page || (page !== "/" && pathname.startsWith(page))
  );

  if (!showFilters) {
    return null;
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed top-24 left-0 h-[calc(100vh-6rem)] z-50 transition-all duration-300 lg:z-30",
          "hidden lg:block",
          isCollapsed ? "w-20" : "w-80"
        )}
      >
        <Suspense fallback={<div className="w-full h-full bg-surface/50 animate-pulse rounded-[2rem] mx-4" />}>
          <FilterPanel 
            isCollapsed={isCollapsed} 
            onToggleCollapse={onToggleCollapse}
            className="h-full shadow-2xl shadow-primary/10"
          />
        </Suspense>
      </aside>

      {/* Sidebar - Mobile (Drawer) */}
      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] z-50 transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Suspense fallback={<div className="w-72 h-full bg-surface animate-pulse" />}>
          <FilterPanel 
            isCollapsed={false} 
            onToggleCollapse={() => onClose?.()}
            className="h-full"
          />
        </Suspense>
      </aside>
    </>
  );
}



