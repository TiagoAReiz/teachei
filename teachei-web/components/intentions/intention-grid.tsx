"use client";

import Link from "next/link";

import { IntentionCard } from "./intention-card";
import { SkeletonCard } from "@/components/ui/skeleton";
import type { Anuncio } from "@/types";
import { Search } from "lucide-react";

interface IntentionGridProps {
  intentions: Anuncio[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function IntentionGrid({
  intentions,
  isLoading,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: IntentionGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (intentions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mb-6">
          <Search className="text-muted" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nenhuma intenção encontrada
        </h3>
        <p className="text-muted text-center max-w-sm">
          Tente ajustar os filtros ou faça uma nova busca para encontrar o que procura.
        </p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Enquanto isso, que tal conferir nossas dicas?
          </p>
          <Link
            href="/guias"
            className="text-primary hover:underline text-sm font-medium"
          >
            Ver Guias e Dicas Automotivas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {intentions.map((intention) => (
          <IntentionCard key={intention.id} intention={intention} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-6 py-3 bg-surface border border-border rounded-full text-foreground font-medium hover:bg-muted/10 transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? "Carregando..." : "Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
}



