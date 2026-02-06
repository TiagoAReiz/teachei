"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bookmark, Plus, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/favorites", label: "Salvos", icon: Bookmark },
  { href: "/create", label: "Criar", icon: Plus, isMain: true },
  { href: "/my-intentions", label: "Intenções", icon: FileText },
  { href: "/profile", label: "Perfil", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Hide on auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isMain = item.isMain;

          // Require auth for protected routes
          if (!isAuthenticated && ["/favorites", "/create", "/my-intentions", "/profile"].includes(item.href)) {
            return (
              <Link
                key={item.href}
                href="/login"
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                  isMain
                    ? "-mt-4"
                    : "text-muted"
                )}
              >
                {isMain ? (
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30">
                    <Icon size={26} />
                  </div>
                ) : (
                  <>
                    <Icon size={26} />
                    <span className="text-[11px]">{item.label}</span>
                  </>
                )}
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isMain
                  ? "-mt-4"
                  : isActive
                    ? "text-primary"
                    : "text-muted hover:text-foreground"
              )}
            >
              {isMain ? (
                <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 btn-press">
                  <Icon size={26} />
                </div>
              ) : (
                <>
                  <Icon size={26} />
                  <span className="text-[11px]">{item.label}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}



