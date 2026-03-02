"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { Footer } from "./footer";
import { AuthGuard } from "@/components/auth";
import { cn } from "@/lib/utils";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",           // Main feed
  "/feed",       // Feed page
  "/intention",  // Public intention view
  "/user",       // Public user profiles
  "/termos",     // Terms of service
  "/privacidade", // Privacy policy
  "/contato",    // Contact page
  "/guias",      // Guides and tips
  "/sobre"       // About page
];

// Pages that should show the filter sidebar
const FILTER_PAGES = ["/", "/feed"];


interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function MainLayout({ children, showSidebar = true, className }: MainLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if current page should show filter sidebar
  const showFilters = FILTER_PAGES.some(
    (page) => pathname === page || (page !== "/" && pathname.startsWith(page))
  );

  // Calculate sidebar width for margin - always full width now
  const sidebarWidth = showSidebar && showFilters ? "lg:ml-80" : "";

  return (
    <AuthGuard publicRoutes={PUBLIC_ROUTES}>
      <div className="min-h-screen bg-background">
        <Header />

        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

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



