"use client";

import { Card, CardContent } from "@/components/ui";
import { useReputacao } from "@/hooks/use-avaliacoes";
import { formatRelativeTime } from "@/lib/utils";
import { StarRating } from "./star-rating";

/** Nota média e últimas avaliações recebidas por um vendedor (perfil público). */
export function Reputation({ usuarioId }: { usuarioId: string }) {
  const { data } = useReputacao(usuarioId);
  if (!data || data.total === 0) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-semibold text-foreground">Avaliações</h2>
          <StarRating value={data.media} />
          <span className="text-sm text-muted">{data.media.toFixed(1)} ({data.total})</span>
        </div>
        <ul className="space-y-4">
          {data.avaliacoes.map((a) => (
            <li key={a.id}>
              <div className="flex items-center gap-2">
                <StarRating value={a.nota} size={14} />
                <span className="text-sm font-medium text-foreground">{a.avaliadorNome}</span>
                <span className="text-xs text-muted">{formatRelativeTime(a.criadoEm)}</span>
              </div>
              {a.comentario && <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{a.comentario}</p>}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
