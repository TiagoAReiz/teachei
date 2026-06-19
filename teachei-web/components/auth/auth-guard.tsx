"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getToken } from "@/lib/api";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const hasToken = typeof window !== "undefined" && !!getToken();

  useEffect(() => {
    if (isLoading) return;
    if (!user && !hasToken) {
      router.replace("/login");
    }
  }, [user, isLoading, hasToken, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user && !hasToken) {
    return null;
  }

  return <>{children}</>;
}
