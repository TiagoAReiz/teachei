"use client";

import { useQueries } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui";
import { IntentionCard } from "@/components/intentions";
import { useSavedIntentions } from "@/hooks/use-saved-intentions";
import { getIntentionById } from "@/lib/intentions";
import Link from "next/link";

function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-surface overflow-hidden border border-border animate-pulse">
      {/* Image area */}
      <div className="h-48 bg-muted/20" />
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-muted/20 rounded-full w-3/4" />
          <div className="h-4 bg-muted/20 rounded-full w-1/3" />
        </div>
        {/* Badge row */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted/20 rounded-full w-16" />
          <div className="h-6 bg-muted/20 rounded-full w-16" />
          <div className="h-6 bg-muted/20 rounded-full w-12" />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="h-4 bg-muted/20 rounded-full w-24" />
          <div className="h-4 bg-muted/20 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { savedIds, isLoaded } = useSavedIntentions();

  const intentionQueries = useQueries({
    queries: savedIds.map((id) => ({
      queryKey: ["intention", id],
      queryFn: () => getIntentionById(id),
      enabled: isLoaded && savedIds.length > 0,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = !isLoaded || intentionQueries.some((q) => q.isLoading);
  const savedIntentions = intentionQueries
    .map((q) => q.data)
    .filter((data): data is NonNullable<typeof data> => !!data);

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

  if (savedIds.length === 0) {
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
          {savedIntentions.length} {savedIntentions.length === 1 ? "intenção" : "intenções"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedIntentions.map((intention) => (
          <IntentionCard key={intention.id} intention={intention} />
        ))}
      </div>
    </div>
  );
}
