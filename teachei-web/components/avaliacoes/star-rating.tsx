"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
}

/** Estrelas de 1 a 5; sem `onChange` é só exibição (aceita decimais, arredonda para a mais próxima). */
export function StarRating({ value, onChange, size = 18, className }: StarRatingProps) {
  const arredondado = Math.round(value);
  return (
    <div className={cn("flex items-center gap-0.5", className)} role={onChange ? "radiogroup" : "img"} aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = <Star size={size} className={n <= arredondado ? "fill-yellow-400 text-yellow-400" : "text-muted"} />;
        return onChange ? (
          <button key={n} type="button" role="radio" aria-checked={n === value} aria-label={`${n} estrela${n > 1 ? "s" : ""}`} onClick={() => onChange(n)}>
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}
