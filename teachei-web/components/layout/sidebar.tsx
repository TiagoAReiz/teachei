"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { FilterPanel } from "./filter-panel";

// Pages that should show the filter sidebar
const FILTER_PAGES = ["/", "/feed"];

export function Sidebar() {
  const pathname = usePathname();

  // Only show on feed pages
  const showFilters = FILTER_PAGES.some(
    (page) => pathname === page || (page !== "/" && pathname.startsWith(page))
  );

  if (!showFilters) return null;

  // Desktop only — on mobile the filters live in the full-screen FilterSidebar
  // (components/intentions/filter-sidebar.tsx) opened from the feed's "Filtrar" button.
  return (
    <aside className="fixed top-32 left-0 h-[calc(100vh-8rem)] z-40 transition-all duration-300 hidden lg:block w-80">
      <Suspense fallback={<div className="w-full h-full bg-surface/50 animate-pulse rounded-[2rem] mx-4" />}>
        <FilterPanel className="h-full shadow-2xl shadow-primary/10" />
      </Suspense>
    </aside>
  );
}
