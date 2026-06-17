"use client";

import { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { getFavoriteIntentions } from "@/lib/favorites";

const LOCAL_KEY = "teachei_saved_intentions";

function getLocal(): string[] {
  try {
    const s = localStorage.getItem(LOCAL_KEY);
    return s ? (JSON.parse(s) as string[]) : [];
  } catch { return []; }
}

function setLocal(ids: string[]): void {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(ids)); } catch {}
}

export function useSavedIntentions() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const authed = isAuthenticated();

  useEffect(() => {
    if (authed) {
      api.get<string[]>("/api/v1/favoritos")
        .then((ids) => { setSavedIds(ids); setIsLoaded(true); })
        .catch(() => { setSavedIds(getLocal()); setIsLoaded(true); });
    } else {
      setSavedIds(getLocal());
      setIsLoaded(true);
    }
  }, [authed]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleSave = useCallback(async (id: string) => {
    const saving = !savedIds.includes(id);
    if (authed) {
      if (saving) {
        await api.post("/api/v1/favoritos", { anuncioId: id }).catch(() => {});
      } else {
        await api.delete(`/api/v1/favoritos/${id}`).catch(() => {});
      }
    }
    setSavedIds((prev) => {
      const next = saving ? [...prev, id] : prev.filter((x) => x !== id);
      if (!authed) setLocal(next);
      return next;
    });
  }, [savedIds, authed]);

  const save = useCallback(async (id: string) => {
    if (savedIds.includes(id)) return;
    if (authed) await api.post("/api/v1/favoritos", { anuncioId: id }).catch(() => {});
    setSavedIds((prev) => { const next = [...prev, id]; if (!authed) setLocal(next); return next; });
  }, [savedIds, authed]);

  const unsave = useCallback(async (id: string) => {
    if (authed) await api.delete(`/api/v1/favoritos/${id}`).catch(() => {});
    setSavedIds((prev) => { const next = prev.filter((x) => x !== id); if (!authed) setLocal(next); return next; });
  }, [authed]);

  const clearAll = useCallback(async () => {
    setSavedIds([]);
    if (!authed) setLocal([]);
  }, [authed]);

  return { savedIds, isSaved, toggleSave, save, unsave, clearAll, isLoaded };
}

/**
 * Hook for the authenticated user's favorite intentions, paginated.
 * `enabled` deve ser true só quando o usuário está autenticado.
 */
export function useInfiniteFavorites(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["favorites", "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      getFavoriteIntentions({ page: pageParam, size: 12 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages - 1 ? lastPage.page + 1 : undefined,
    enabled,
  });
}
