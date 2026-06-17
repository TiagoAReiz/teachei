"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getIntentions,
  getIntentionById,
  getMyIntentions,
  createIntention,
  updateIntention,
  markAsCompleted,
  deleteIntention,
  getAvailableFilters,
  getAvailableLocations,
  type FiltroSelecaoRequest,
} from "@/lib/intentions";
import type { CreateAnuncioRequest, UpdateAnuncioRequest, IntentionFilters, TipoVeiculo } from "@/types";

/**
 * Hook for paginated intentions with filters
 */
export function useIntentions(filters: IntentionFilters = {}) {
  return useQuery({
    queryKey: ["intentions", filters],
    queryFn: () => getIntentions(filters),
  });
}

/**
 * Hook for infinite scroll intentions
 */
export function useInfiniteIntentions(
  filters: Omit<IntentionFilters, "page"> = {}
) {
  return useInfiniteQuery({
    queryKey: ["intentions", "infinite", filters],
    queryFn: ({ pageParam = 0 }) =>
      getIntentions({ ...filters, page: pageParam, size: 12 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages - 1) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

/**
 * Hook for single intention by ID
 */
export function useIntention(id: string) {
  return useQuery({
    queryKey: ["intention", id],
    queryFn: () => getIntentionById(id),
    enabled: !!id,
  });
}

/**
 * Hook for current user's intentions
 */
export function useMyIntentions() {
  return useQuery({
    queryKey: ["intentions", "mine"],
    queryFn: getMyIntentions,
  });
}

/**
 * Hook for creating a new intention
 */
export function useCreateIntention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnuncioRequest) => createIntention(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intentions"] });
    },
  });
}

/**
 * Hook for updating an existing intention
 */
export function useUpdateIntention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAnuncioRequest;
    }) => updateIntention(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["intentions"] });
      queryClient.invalidateQueries({ queryKey: ["intention", variables.id] });
    },
  });
}

/**
 * Hook for marking an intention as completed
 */
export function useMarkIntentionComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsCompleted(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["intentions"] });
      queryClient.invalidateQueries({ queryKey: ["intention", id] });
    },
  });
}

/**
 * Hook for deleting an intention
 */
export function useDeleteIntention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteIntention(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intentions"] });
    },
  });
}

/**
 * Hook for fetching available filter options based on existing intentions
 */
export function useAvailableFilters(selecao: FiltroSelecaoRequest = {}) {
  return useQuery({
    queryKey: ["intentions", "filters", selecao],
    queryFn: () => getAvailableFilters(selecao),
    staleTime: 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook for fetching available location options from existing intentions.
 * Extracts distinct city/state pairs from intention contact data.
 */
export function useAvailableLocations() {
  return useQuery({
    queryKey: ["intentions", "locations"],
    queryFn: getAvailableLocations,
    staleTime: 5 * 60 * 1000, // 5 minutes - locations change infrequently
    retry: 2,
  });
}
