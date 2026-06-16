"use client";

import { useState, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Plus, Home, Bookmark, FileText, Headphones, Gauge, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { NotificationsDropdown } from "@/components/notifications";
import { useAuth } from "@/hooks/use-auth";
import { SearchInput, SearchInputFallback } from "./search-input";
import { cn } from "@/lib/utils";

// Navigation items for icon nav
const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/favorites", icon: Bookmark, label: "Favoritos" },
  { href: "/my-intentions", icon: FileText, label: "Meus Anúncios" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setShowMobileSearch(false);
      }
    }

    if (showMobileSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileSearch]);

  return (
    <header className="fixed top-4 left-4 right-4 z-[900]">
      <div className="max-w-7xl mx-auto bg-surface-glass backdrop-blur-md border border-white/20 shadow-lg shadow-primary/5 rounded-[2rem] px-6 h-20 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-6">
          {/* Logo - goes to /feed if authenticated, / otherwise */}
          <Logo size="sm" className="hidden sm:flex" href={isAuthenticated ? "/feed" : "/"} />
          <Logo size="xs" className="sm:hidden" href={isAuthenticated ? "/feed" : "/"} />

          {/* Icon Navigation (Desktop) */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-2 bg-background/50 p-1.5 rounded-full border border-white/20">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/feed" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 relative group",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                        : "text-muted hover:text-foreground hover:bg-white"
                    )}
                    title={item.label}
                  >
                    <Icon size={20} />
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* Search Bar (Desktop) - Centered and prominent */}
        <Suspense fallback={<SearchInputFallback className="hidden md:flex flex-1 max-w-lg mx-auto" />}>
          <SearchInput className="hidden md:flex flex-1 max-w-lg mx-auto" />
        </Suspense>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Toggle */}
          <button
            ref={searchButtonRef}
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Abrir busca"
            aria-expanded={showMobileSearch}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white text-muted hover:text-primary hover:shadow-lg transition-all"
          >
            <Search size={20} />
          </button>

          {/* Contact */}
          <Link
            href="/contato"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-muted hover:text-primary hover:shadow-lg transition-all"
            title="Fale Conosco"
          >
            <Headphones size={20} />
          </Link>
          {isAuthenticated ? (
            <>
              {/* Create Button */}
              <Button
                size="sm"
                onClick={() => router.push("/create")}
                className="hidden sm:flex shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                <Plus size={18} />
                <span>Anunciar</span>
              </Button>
              {/* Mobile create button hidden as it exists in bottom nav */}
              <Button
                size="icon"
                variant="primary"
                onClick={() => router.push("/create")}
                className="hidden h-10 w-10 shadow-lg"
              >
                <Plus size={20} />
              </Button>

              {/* Notifications */}
              <NotificationsDropdown
                notifications={[]}
                onNotificationClick={(notification) => {
                  if (notification.href) {
                    router.push(notification.href);
                  }
                }}
              />

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="Abrir menu do usuário"
                  aria-haspopup="menu"
                  aria-expanded={showUserMenu}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white hover:shadow-md transition-all border-2 border-transparent hover:border-primary/10"
                >
                  <Avatar src={user?.avatarUrl} fotoUrl={user?.fotoUrl} fallback={user?.nome} size="sm" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-[1001]"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-4 w-64 bg-surface rounded-3xl shadow-2xl shadow-primary/10 border border-white/20 z-[1002] py-3 animate-scale-in origin-top-right overflow-hidden">
                      <div className="px-6 py-4 bg-gradient-to-br from-primary/5 to-transparent border-b border-border/50">
                        <p className="font-bold text-foreground truncate text-lg">{user?.nome}</p>
                        <p className="text-xs text-muted truncate font-medium">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                             <Home size={14} />
                          </div>
                          Meu Perfil
                        </Link>
                        <Link
                          href="/my-intentions"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                             <FileText size={14} />
                          </div>
                          Minhas Intenções
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                             <Gauge size={14} />
                          </div>
                          Configurações
                        </Link>
                        <hr className="my-2 border-border/50" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-error hover:bg-error/5 rounded-2xl transition-colors"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Entrar
              </Button>
              <Button size="sm" onClick={() => router.push("/register")}>
                Criar Conta
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search - Floating below header */}
      {showMobileSearch && (
        <Suspense fallback={<SearchInputFallback className="md:hidden mt-4 px-4" />}>
          <div ref={mobileSearchRef} className="md:hidden mt-4 px-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <SearchInput className="shadow-lg rounded-full" />
          </div>
        </Suspense>
      )}
    </header>
  );
}
