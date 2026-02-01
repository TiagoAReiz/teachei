"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MessageCircle,
  Calendar,
  Palette,
  DollarSign,
  Eye,
  MapPin,
  Instagram,
  Phone,
  Car,
  Bike,
  Truck,
} from "lucide-react";
import type { TipoVeiculo } from "@/types";

// Vehicle type icon mapping
const vehicleTypeIcons: Record<TipoVeiculo, typeof Car> = {
  CARRO: Car,
  MOTO: Bike,
  CAMINHAO: Truck,
};
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { formatCurrency, formatRelativeTime, formatExpiration, vehicleTypeLabels, getWhatsAppLink, getInstagramLink, formatOpcional } from "@/lib/utils";
import { useSavedIntentions } from "@/hooks/use-saved-intentions";
import type { Anuncio } from "@/types";

interface IntentionDetailsClientProps {
  initialData: Anuncio;
}

export function IntentionDetailsClient({ initialData }: IntentionDetailsClientProps) {
  const router = useRouter();
  const { isSaved, toggleSave } = useSavedIntentions();
  const intention = initialData;
  const saved = isSaved(intention.id);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Procuro ${intention.veiculo.marcaNome} ${intention.veiculo.modeloNome}`,
        text: intention.observacoes || "Confira esta intenção de compra",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const whatsappMessage = `Olá! Vi sua intenção de compra do ${intention.veiculo.marcaNome} ${intention.veiculo.modeloNome} no TeAchei e gostaria de fazer uma proposta.`;

  // Get vehicle type icon
  const VehicleIcon = vehicleTypeIcons[intention.tipo] || Car;

  // Format anos display
  const anosDisplay = (() => {
    const anos = intention.veiculo.anos;
    if (!anos || anos.length === 0) return "Qualquer";
    if (anos.length === 1) return anos[0].toString();
    const min = Math.min(...anos);
    const max = Math.max(...anos);
    return min === max ? min.toString() : `${min} - ${max}`;
  })();

  const specs = [
    {
      icon: Calendar,
      label: "Ano",
      value: anosDisplay,
    },
    {
      icon: DollarSign,
      label: "Orçamento",
      value: intention.veiculo.precoMaximo ? `Até ${formatCurrency(intention.veiculo.precoMaximo)}` : "A combinar",
    },
    {
      icon: Palette,
      label: "Cores",
      value: intention.veiculo.cores.length > 0 ? intention.veiculo.cores.join(", ") : "Qualquer",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6 max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSave(intention.id)}
              className={`p-2 rounded-full transition-colors ${
                saved ? "bg-primary text-white" : "text-muted hover:text-foreground hover:bg-muted/10"
              }`}
            >
              <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
            >
              <Share2 size={22} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pb-24">
        {/* Vehicle Icon Header */}
        <div className="relative h-48 lg:h-56 overflow-hidden">
          <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
            <VehicleIcon size={120} className="text-primary/40" strokeWidth={1} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge variant="default" className="bg-primary text-white">
              {vehicleTypeLabels[intention.tipo]}
            </Badge>
          </div>
        </div>

        <div className="px-4 lg:px-6 -mt-8 relative z-10">
          {/* Title Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">
                    {intention.veiculo.marcaNome} {intention.veiculo.modeloBaseNome || intention.veiculo.modeloNome}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <p className="text-muted flex items-center gap-2">
                      <Eye size={16} />
                      {formatRelativeTime(intention.criadoEm)}
                    </p>
                    {intention.status === "ATIVO" && intention.expiraEm && (
                      <span className="text-sm text-warning flex items-center gap-1">
                        <Calendar size={14} />
                        {formatExpiration(intention.expiraEm)}
                      </span>
                    )}
                  </div>
                </div>
                {intention.veiculo.precoMaximo && (
                  <div className="text-right">
                    <p className="text-sm text-muted">Orçamento</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(intention.veiculo.precoMaximo)}
                    </p>
                  </div>
                )}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {specs.map((spec, index) => {
                  const Icon = spec.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-xl">
                      <div className="p-2 bg-muted/10 rounded-lg">
                        <Icon size={18} className="text-muted" />
                      </div>
                      <div>
                        <p className="text-xs text-muted">{spec.label}</p>
                        <p className="font-medium text-foreground text-sm">{spec.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Versions Section */}
              {(intention.veiculo.todasVersoes || (intention.veiculo.versoes && intention.veiculo.versoes.length > 0)) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Versões aceitas</p>
                  <div className="flex flex-wrap gap-2">
                    {intention.veiculo.todasVersoes ? (
                      <Badge variant="default">Aceita qualquer versão do modelo</Badge>
                    ) : (
                      intention.veiculo.versoes?.map((versao) => (
                        <Badge key={versao.codigo} variant="default">
                          {versao.nome}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Optionals Section */}
              {intention.veiculo.opcionais && intention.veiculo.opcionais.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted mb-2">Opcionais desejados</p>
                  <div className="flex flex-wrap gap-2">
                    {intention.veiculo.opcionais.map((opcional) => (
                      <Badge key={opcional} variant="outline" className="text-primary border-primary/30">
                        {formatOpcional(opcional)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          {intention.observacoes && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground mb-3">Observações do comprador</h2>
                <p className="text-foreground whitespace-pre-wrap">{intention.observacoes}</p>
              </CardContent>
            </Card>
          )}

          {/* Contact Info */}
          {intention.contato && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground mb-4">Contato</h2>
                
                {/* Location - always visible */}
                {(intention.contato.cidade || intention.contato.estado) && (
                  <p className="text-muted flex items-center gap-2 mb-4">
                    <MapPin size={16} />
                    {intention.contato.localizacao || [intention.contato.cidade, intention.contato.estado].filter(Boolean).join(", ")}
                  </p>
                )}
                  
                {/* TODO: Quando for cobrar, trocar 'false' por 'intention.contatoOculto' (ou lógica de assinatura) */}
                {false && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-foreground font-medium mb-2">
                      Informações de contato ocultas
                    </p>
                    <p className="text-sm text-muted mb-4">
                      Assine para ver o WhatsApp e Instagram do comprador e enviar sua proposta.
                    </p>
                    <a href="/assinatura">
                      <Button variant="primary" className="w-full">
                        Ver planos de assinatura
                      </Button>
                    </a>
                  </div>
                )}

                {/* Contato sempre visível por enquanto - TODO: trocar 'true' por '!intention.contatoOculto' quando for cobrar */}
                {true && (
                  <div className="flex items-center gap-3">
                    {intention.contato.instagram && (
                      <a
                        href={getInstagramLink(intention.contato.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full bg-muted/10 text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fixed CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-50">
          <div className="max-w-4xl mx-auto flex gap-3">
            {/* Contact hidden - show subscription CTA */}
            {intention.contatoOculto ? (
              <a href="/assinatura" className="flex-1">
                <Button variant="primary" className="w-full" size="lg">
                  Assine para ver contato
                </Button>
              </a>
            ) : (
              <>
                {intention.contato?.whatsappLink ? (
                  <a
                    href={intention.contato.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="whatsapp" className="w-full" size="lg">
                      <MessageCircle size={20} />
                      Enviar proposta
                    </Button>
                  </a>
                ) : intention.contato?.whatsapp && (
                  <a
                    href={getWhatsAppLink(intention.contato.whatsapp, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="whatsapp" className="w-full" size="lg">
                      <MessageCircle size={20} />
                      Enviar proposta
                    </Button>
                  </a>
                )}
                {intention.contato?.whatsapp && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      window.location.href = `tel:${intention.contato.whatsapp}`;
                    }}
                  >
                    <Phone size={20} />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}



