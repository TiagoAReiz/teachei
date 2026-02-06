"use client";

import { useState, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { AuthGuard } from "@/components/auth";
import { cn } from "@/lib/utils";

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",           // Main feed
  "/feed",       // Feed page
  "/intention",  // Public intention view
  "/user",       // Public user profiles
  "/termos",     // Terms of service
  "/privacidade" // Privacy policy
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
  // Start with false to match server render, then sync with localStorage on mount
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync with localStorage after mount to avoid hydration mismatch
  // This is a valid pattern for syncing client-only state after hydration
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSidebarCollapsed(true);
    }
  }, []);

  // Handle sidebar collapse toggle
  const handleToggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  // Listen for changes to localStorage from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "sidebar-collapsed" && e.newValue !== null) {
        setIsSidebarCollapsed(e.newValue === "true");
      }
    };
    
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Check if current page should show filter sidebar
  const showFilters = FILTER_PAGES.some(
    (page) => pathname === page || (page !== "/" && pathname.startsWith(page))
  );

  // Calculate sidebar width for margin
  const sidebarWidth = showSidebar && showFilters 
    ? (isSidebarCollapsed ? "lg:ml-12" : "lg:ml-72") 
    : "";

  return (
    <AuthGuard publicRoutes={PUBLIC_ROUTES}>
      <div className="min-h-screen bg-background">
        <Header />
        
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={handleToggleSidebarCollapse}
          />
        )}
        
        <main
          className={cn(
            "min-h-[calc(100vh-4rem)] pb-20 lg:pb-0 transition-all duration-300",
            sidebarWidth,
            className
          )}
        >
          {children}
        </main>
        
        <MobileNav />
      </div>
    </AuthGuard>
  );
}



