"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, Share2, Car, Bike, Truck, Gauge } from "lucide-react";
import { Card, CardContent, Badge } from "@/components/ui";
import { cn, formatCurrency, formatRelativeTime, vehicleTypeLabels, formatOpcional, sanitizeUrl } from "@/lib/utils";
import { useSavedIntentions } from "@/hooks/use-saved-intentions";
import type { Anuncio, TipoVeiculo } from "@/types";

// Vehicle type icon mapping
const vehicleTypeIcons: Record<TipoVeiculo, typeof Car> = {
  CARRO: Car,
  MOTO: Bike,
  CAMINHAO: Truck,
};


interface IntentionCardProps {
  intention: Anuncio;
}

export function IntentionCard({ intention }: IntentionCardProps) {
  const { isSaved, toggleSave } = useSavedIntentions();
  const saved = isSaved(intention.id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(intention.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      await navigator.share({
        title: `Procuro ${intention.veiculo.modeloNome}`,
        text: `Confira esta intenção de compra no TeAchei`,
        url: `${window.location.origin}/intention/${intention.id}`,
      });
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/intention/${intention.id}`);
    }
  };

  // Format anos display
  const anosDisplay = (() => {
    const anos = intention.veiculo.anos;
    if (!anos || anos.length === 0) return "Qualquer ano";
    if (anos.length === 1) return anos[0].toString();
    const min = Math.min(...anos);
    const max = Math.max(...anos);
    return min === max ? min.toString() : `${min} - ${max}`;
  })();

  // Format mileage display
  const formatMileage = (km: number) => `${km.toLocaleString("pt-BR")} km`;
  const mileageDisplay = (() => {
    const { quilometragemMinima, quilometragemMaxima } = intention.veiculo;
    if (quilometragemMinima && quilometragemMaxima) {
      return `${formatMileage(quilometragemMinima)} - ${formatMileage(quilometragemMaxima)}`;
    }
    if (quilometragemMinima) return `A partir de ${formatMileage(quilometragemMinima)}`;
    if (quilometragemMaxima) return `Até ${formatMileage(quilometragemMaxima)}`;
    return null;
  })();

  // Get vehicle type icon
  const VehicleIcon = vehicleTypeIcons[intention.tipo] || Car;

  return (
    <Link href={`/intention/${intention.id}`}>
      <Card hoverable className="group h-full">
        {/* Vehicle Image/Icon Area */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          {intention.veiculo.fotoReferenciaUrl ? (
            <Image
              src={sanitizeUrl(intention.veiculo.fotoReferenciaUrl) || ""}
              alt={`${intention.veiculo.marcaNome} ${intention.veiculo.modeloNome}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-muted/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <VehicleIcon size={80} className="text-primary/40" strokeWidth={1.5} />
            </div>
          )}

          {/* Vehicle Type Badge */}
          <Badge variant="default" className="absolute top-3 left-3 bg-primary text-white">
            {vehicleTypeLabels[intention.tipo]}
          </Badge>

          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleSave}
              className={cn(
                "p-2 rounded-full transition-colors",
                saved
                  ? "bg-primary text-white"
                  : "bg-white/80 text-muted hover:bg-white hover:text-foreground"
              )}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 text-muted hover:bg-white hover:text-foreground transition-colors"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Price */}
          {intention.veiculo.precoMaximo && (
            <div className="absolute bottom-3 right-3">
              <span className="bg-white shadow-sm text-foreground font-bold px-3 py-1 rounded-full text-sm">
                até {formatCurrency(intention.veiculo.precoMaximo)}
              </span>
            </div>
          )}
        </div>

        <CardContent className="space-y-3">
          {/* Title - use modeloBaseNome if available, fallback to modeloNome */}
          <div>
            <h3 className="font-bold text-lg text-foreground line-clamp-1">
              {intention.veiculo.marcaNome} {intention.veiculo.modeloBaseNome || intention.veiculo.modeloNome}
            </h3>
            <p className="text-sm text-muted">
              {anosDisplay}
            </p>
          </div>

          {/* Colors */}
          {intention.veiculo.cores && intention.veiculo.cores.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {intention.veiculo.cores.slice(0, 3).map((cor) => (
                <Badge key={cor} variant="outline" size="sm">
                  {cor}
                </Badge>
              ))}
              {intention.veiculo.cores.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{intention.veiculo.cores.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Mileage */}
          {mileageDisplay && (
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <Gauge size={14} />
              <span>{mileageDisplay}</span>
            </div>
          )}

          {/* Versions */}
          {intention.veiculo.todasVersoes ? (
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="default" size="sm">
                Todas as versões
              </Badge>
            </div>
          ) : intention.veiculo.versoes && intention.veiculo.versoes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {intention.veiculo.versoes.slice(0, 2).map((versao) => (
                <Badge key={versao.codigo} variant="default" size="sm">
                  {versao.nome}
                </Badge>
              ))}
              {intention.veiculo.versoes.length > 2 && (
                <Badge variant="default" size="sm">
                  +{intention.veiculo.versoes.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Optionals */}
          {intention.veiculo.opcionais && intention.veiculo.opcionais.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {intention.veiculo.opcionais.slice(0, 2).map((opcional) => (
                <Badge key={opcional} variant="outline" size="sm" className="text-primary border-primary/30">
                  {formatOpcional(opcional)}
                </Badge>
              ))}
              {intention.veiculo.opcionais.length > 2 && (
                <Badge variant="outline" size="sm" className="text-primary border-primary/30">
                  +{intention.veiculo.opcionais.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Location & Time */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <div>
                {intention.contato?.localizacao || intention.contato?.cidade ? (
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {intention.contato.localizacao || [intention.contato.cidade, intention.contato.estado].filter(Boolean).join(", ")}
                  </p>
                ) : null}
                <p className="text-xs text-muted">
                  {formatRelativeTime(intention.criadoEm)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
