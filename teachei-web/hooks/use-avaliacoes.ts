import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVendasPendentes, avaliarVenda, registrarVenda, fetchReputacao } from "@/lib/avaliacoes";

export function useVendasPendentes(enabled = true) {
  return useQuery({ queryKey: ["vendas-pendentes"], queryFn: fetchVendasPendentes, enabled, staleTime: 60_000 });
}

export function useReputacao(usuarioId: string) {
  return useQuery({ queryKey: ["reputacao", usuarioId], queryFn: () => fetchReputacao(usuarioId), enabled: !!usuarioId });
}

export function useRegistrarVenda() {
  return useMutation({ mutationFn: registrarVenda });
}

export function useAvaliarVenda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: avaliarVenda,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vendas-pendentes"] });
      qc.invalidateQueries({ queryKey: ["reputacao"] });
    },
  });
}
