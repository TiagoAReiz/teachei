"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Footer } from "./footer";
import { AuthGuard } from "@/components/auth";
import { cn } from "@/lib/utils";

// Pages that should show the filter sidebar
const FILTER_PAGES = ["/", "/feed"];


interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function MainLayout({ children, showSidebar = true, className }: MainLayoutProps) {
  const pathname = usePathname();

  // Check if current page should show filter sidebar
  const showFilters = FILTER_PAGES.some(
    (page) => pathname === page || (page !== "/" && pathname.startsWith(page))
  );

  // Calculate sidebar width for margin - always full width now
  const sidebarWidth = showSidebar && showFilters ? "lg:ml-80" : "";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />

        {showSidebar && <Sidebar />}

        <main
          className={cn(
            "min-h-screen pt-32 pb-20 lg:pb-0 transition-all duration-300 flex flex-col",
            sidebarWidth,
            className
          )}
        >
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>

        <MobileNav />
      </div>
    </AuthGuard>
  );
}



