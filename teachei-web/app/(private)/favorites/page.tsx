"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui";
import { IntentionCard } from "@/components/intentions";
import { useSavedIntentions, useInfiniteFavorites } from "@/hooks/use-saved-intentions";
import { getIntentionById } from "@/lib/intentions";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

const PAGE_SIZE = 12;

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface overflow-hidden border border-border animate-pulse">
      <div className="h-48 bg-muted/20" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-muted/20 rounded-full w-3/4" />
          <div className="h-4 bg-muted/20 rounded-full w-1/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted/20 rounded-full w-16" />
          <div className="h-6 bg-muted/20 rounded-full w-16" />
          <div className="h-6 bg-muted/20 rounded-full w-12" />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="h-4 bg-muted/20 rounded-full w-24" />
          <div className="h-4 bg-muted/20 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const authed = isAuthenticated();

  // Caminho autenticado: paginação real no servidor.
  const infinite = useInfiniteFavorites(authed);

  // Caminho anônimo: paginação no cliente sobre os IDs do localStorage.
  const { savedIds, isLoaded } = useSavedIntentions();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const anonIds = authed ? [] : savedIds.slice(0, visibleCount);
  const anonQueries = useQueries({
    queries: anonIds.map((id) => ({
      queryKey: ["intention", id],
      queryFn: () => getIntentionById(id),
      enabled: !authed && isLoaded,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = authed
    ? infinite.isLoading
    : !isLoaded || anonQueries.some((q) => q.isLoading);

  const intentions = authed
    ? infinite.data?.pages.flatMap((p) => p.content) ?? []
    : anonQueries
        .map((q) => q.data)
        .filter((d): d is NonNullable<typeof d> => !!d);

  const totalCount = authed
    ? infinite.data?.pages[0]?.totalElements ?? 0
    : savedIds.length;

  const hasMore = authed ? !!infinite.hasNextPage : visibleCount < savedIds.length;
  const isLoadingMore = authed ? infinite.isFetchingNextPage : false;
  const loadMore = authed
    ? () => infinite.fetchNextPage()
    : () => setVisibleCount((c) => c + PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Salvos</h1>
          <div className="h-4 bg-muted/20 rounded-full w-20 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Bookmark className="text-primary" size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Nenhum favorito ainda
        </h2>
        <p className="text-muted text-center max-w-sm mb-6">
          Salve intenções de compra para encontrá-las facilmente depois.
          Clique no ícone de salvar em qualquer intenção para adicioná-la aqui.
        </p>
        <Link href="/feed">
          <Button>Explorar intenções</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Salvos</h1>
        <span className="text-sm text-muted">
          {totalCount} {totalCount === 1 ? "intenção" : "intenções"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {intentions.map((intention) => (
          <IntentionCard key={intention.id} intention={intention} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={loadMore}
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
