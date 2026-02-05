"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Zap, Shield, Star } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { usePlanos, useMinhaAssinatura, useCriarAssinatura } from "@/hooks/use-subscriptions";
import { redirectToSubscriptionCheckout, type PlanoAssinatura } from "@/lib/subscriptions";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function AssinaturaPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<PlanoAssinatura | null>(null);

  const { data: planos, isLoading: isLoadingPlanos } = usePlanos();
  const { data: assinaturaAtual, isLoading: isLoadingAssinatura } = useMinhaAssinatura();
  const { mutate: criarAssinatura, isPending } = useCriarAssinatura();

  const handleSelectPlan = (planoId: PlanoAssinatura) => {
    setSelectedPlan(planoId);
  };

  const handleSubscribe = () => {
    if (!selectedPlan) {
      error("Selecione um plano");
      return;
    }

    criarAssinatura(selectedPlan, {
      onSuccess: (preference) => {
        success("Redirecionando para pagamento...");
        redirectToSubscriptionCheckout(preference);
      },
      onError: (err) => {
        error(err.message || "Erro ao criar assinatura");
      },
    });
  };

  const planBenefits = [
    "Acesso a informações de contato dos compradores",
    "Visualize WhatsApp e Instagram ilimitados",
    "Envie propostas diretamente aos interessados",
    "Suporte prioritário",
  ];

  const planHighlights: Record<PlanoAssinatura, { icon: typeof Star; label: string }> = {
    INDIVIDUAL: { icon: Zap, label: "Início rápido" },
    TRIMESTRAL: { icon: Star, label: "Melhor custo-benefício" },
    ANUAL: { icon: Shield, label: "Máxima economia" },
  };

  if (isLoadingPlanos || isLoadingAssinatura) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // User already has active subscription
  if (assinaturaAtual?.assinaturaAtiva) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-success" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Você já é assinante!
              </h1>
              <p className="text-muted mb-4">
                Seu plano {assinaturaAtual.planoNome} está ativo até{" "}
                {new Date(assinaturaAtual.dataFim!).toLocaleDateString("pt-BR")}.
              </p>
              <p className="text-sm text-success mb-6">
                {assinaturaAtual.diasRestantes} dias restantes
              </p>
              <div className="space-y-3">
                <Button onClick={() => router.push("/feed")} className="w-full">
                  Explorar intenções
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/settings")}
                  className="w-full"
                >
                  Gerenciar assinatura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Escolha seu plano
          </h1>
          <p className="text-muted max-w-xl mx-auto">
            Assine para acessar informações de contato dos compradores e enviar suas propostas diretamente.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8 pt-4">
          {planos?.map((plano) => {
            const isSelected = selectedPlan === plano.id;
            const highlight = planHighlights[plano.id];
            const Icon = highlight.icon;
            const isBestValue = plano.id === "TRIMESTRAL";

            return (
              <div key={plano.id} className="relative">
                {isBestValue && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                    Recomendado
                  </div>
                )}
                <Card
                  className={cn(
                    "cursor-pointer transition-all h-full",
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "hover:border-muted",
                    isBestValue && "border-primary/50 shadow-lg"
                  )}
                  onClick={() => handleSelectPlan(plano.id)}
                >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/10" : "bg-muted/10"
                    )}>
                      <Icon size={20} className={isSelected ? "text-primary" : "text-muted"} />
                    </div>
                    <span className="text-sm text-muted">{highlight.label}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {plano.nome}
                  </h3>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {plano.precoFormatado}
                    </span>
                    <span className="text-muted text-sm">
                      /{plano.duracaoDias} dias
                    </span>
                  </div>

                  {plano.recorrente && (
                    <p className="text-xs text-muted mb-4">
                      Renovação automática
                    </p>
                  )}

                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted"
                  )}>
                    {isSelected && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Benefits */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              O que você ganha com a assinatura:
            </h3>
            <ul className="space-y-3">
              {planBenefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-success/10">
                    <Check size={14} className="text-success" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <Button
          onClick={handleSubscribe}
          className="w-full"
          size="lg"
          disabled={!selectedPlan}
          isLoading={isPending}
        >
          <CreditCard size={20} />
          <span>Assinar agora</span>
        </Button>

        <p className="text-center text-xs text-muted mt-4">
          Pagamento seguro via Mercado Pago. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
}
