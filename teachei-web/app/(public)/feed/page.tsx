"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { MainLayout } from "@/components/layout";
import { IntentionGrid, IntentionFilters } from "@/components/intentions";
import { useInfiniteIntentions } from "@/hooks/use-intentions";
import type { TipoVeiculo, SortOption, IntentionFilters as Filters } from "@/types";

function FeedContent() {
  const searchParams = useSearchParams();

  // Parse all filter parameters from URL
  const ordenar = searchParams.get("ordenar") as SortOption | null;
  const marcaCodigo = searchParams.get("marca");
  const modeloCodigo = searchParams.get("modeloCodigo");
  const modelos = searchParams.get("modelos");
  const precoMinStr = searchParams.get("precoMin");
  const precoMaxStr = searchParams.get("precoMax");
  const anoMinStr = searchParams.get("anoMin");
  const anoMaxStr = searchParams.get("anoMax");
  const kmMinStr = searchParams.get("kmMin");
  const kmMaxStr = searchParams.get("kmMax");
  const opcionaisStr = searchParams.get("opcionais");

  const cidade = searchParams.get("cidade");
  const estado = searchParams.get("estado");

  const filters: Omit<Filters, "page"> = {
    tipoVeiculo: (searchParams.get("tipo") as TipoVeiculo) || undefined,
    search: searchParams.get("search") || undefined,
    ordenar: ordenar || undefined,
    marcaCodigo: marcaCodigo || undefined,
    modeloCodigo: modeloCodigo || undefined,
    modelos: modelos ? modelos.split(",").filter(Boolean) : undefined,
    cidade: cidade || undefined,
    estado: estado || undefined,
    precoMin: precoMinStr ? parseInt(precoMinStr, 10) : undefined,
    precoMax: precoMaxStr ? parseInt(precoMaxStr, 10) : undefined,
    anoMin: anoMinStr ? parseInt(anoMinStr, 10) : undefined,
    anoMax: anoMaxStr ? parseInt(anoMaxStr, 10) : undefined,
    kmMin: kmMinStr ? parseInt(kmMinStr, 10) : undefined,
    kmMax: kmMaxStr ? parseInt(kmMaxStr, 10) : undefined,
    opcionais: opcionaisStr ? opcionaisStr.split(",").filter(Boolean) : undefined,
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

function FeedLoading() {
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

export default function FeedPage() {
  return (
    <MainLayout>
      <Suspense fallback={<FeedLoading />}>
        <FeedContent />
      </Suspense>
    </MainLayout>
  );
}
