"use client";

import { useState } from "react";
import { Card, CardContent, Button, Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useVendasPendentes, useAvaliarVenda } from "@/hooks/use-avaliacoes";
import { StarRating } from "./star-rating";
import type { VendaPendente } from "@/lib/avaliacoes";

/** Lista de vendas que vendedores declararam e que o usuário (comprador) ainda não avaliou. */
export function PendingReviews() {
  const { data: pendentes } = useVendasPendentes();
  const { mutate: avaliar, isPending } = useAvaliarVenda();
  const { success, error } = useToast();
  const [alvo, setAlvo] = useState<VendaPendente | null>(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  if (!pendentes || pendentes.length === 0) return null;

  const fechar = () => { setAlvo(null); setNota(0); setComentario(""); };

  const enviar = () => {
    if (!alvo || nota === 0) return;
    avaliar(
      { vendaId: alvo.vendaId, nota, comentario: comentario.trim() || undefined },
      {
        onSuccess: () => { success("Avaliação enviada. Obrigado!"); fechar(); },
        onError: (e) => error(e.message || "Erro ao enviar avaliação"),
      }
    );
  };

  return (
    <>
      <Card className="mb-6 border-primary/30">
        <CardContent className="p-4">
          <h2 className="font-semibold text-foreground mb-3">Avalie seus vendedores</h2>
          <ul className="space-y-2">
            {pendentes.map((p) => (
              <li key={p.vendaId} className="flex items-center justify-between gap-3">
                <span className="text-sm text-foreground">
                  <strong>{p.vendedorNome}</strong> disse que vendeu um {p.veiculo} para você
                </span>
                <Button size="sm" onClick={() => setAlvo(p)}>Avaliar</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog isOpen={!!alvo} onClose={fechar}>
        <DialogHeader onClose={fechar}>
          <DialogTitle>Avaliar {alvo?.vendedorNome}</DialogTitle>
          <DialogDescription>Como foi o negócio com esse vendedor?</DialogDescription>
        </DialogHeader>
        <div className="px-6 space-y-4">
          <StarRating value={nota} onChange={setNota} size={32} />
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Comentário (opcional)"
            className="w-full rounded-xl border border-border bg-surface p-3 text-foreground"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={fechar}>Cancelar</Button>
          <Button onClick={enviar} disabled={nota === 0 || isPending}>Enviar avaliação</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
