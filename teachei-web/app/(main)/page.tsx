"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IntentionGrid, IntentionFilters } from "@/components/intentions";
import { useInfiniteIntentions } from "@/hooks/use-intentions";
import type { TipoVeiculo, SortOption, IntentionFilters as Filters } from "@/types";

function HomeContent() {
  const searchParams = useSearchParams();
  
  // Handle model filter - can be single modeloCodigo or comma-separated modelos
  const modeloCodigo = searchParams.get("modeloCodigo") || undefined;
  const modelos = searchParams.get("modelos")?.split(",").filter(Boolean) || undefined;
  
  const filters: Omit<Filters, "page"> = {
    tipoVeiculo: (searchParams.get("tipo") as TipoVeiculo) || undefined,
    search: searchParams.get("search") || undefined,
    marcaCodigo: searchParams.get("marca") || undefined,
    modeloCodigo: modeloCodigo,
    modelos: modelos,
    anoMin: searchParams.get("anoMin") ? parseInt(searchParams.get("anoMin")!) : undefined,
    anoMax: searchParams.get("anoMax") ? parseInt(searchParams.get("anoMax")!) : undefined,
    precoMin: searchParams.get("precoMin") ? parseInt(searchParams.get("precoMin")!) : undefined,
    precoMax: searchParams.get("precoMax") ? parseInt(searchParams.get("precoMax")!) : undefined,
    opcionais: searchParams.get("opcionais")?.split(",").filter(Boolean) || undefined,
    ordenar: (searchParams.get("ordenar") as SortOption) || undefined,
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteIntentions(filters);

  // Flatten paginated results
  const intentions = data?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="p-4 lg:p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Feed de Intenções
        </h1>
        <p className="text-muted">
          Descubra o que compradores estão procurando
        </p>
      </div>

      {/* Filters */}
      <IntentionFilters className="mb-6" />

      {/* Grid */}
      <IntentionGrid
        intentions={intentions}
        isLoading={isLoading}
        onLoadMore={() => fetchNextPage()}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />
    </div>
  );
}

function HomeLoading() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-muted/20 rounded animate-pulse mb-2" />
        <div className="h-5 w-72 bg-muted/20 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted/20 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}



