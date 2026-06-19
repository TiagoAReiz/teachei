"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Home, ArrowRight, RefreshCw } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { useMinhaAssinatura } from "@/hooks/use-subscriptions";

function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // subscriptionId can be used for direct status check in the future
  const _subscriptionId = searchParams.get("id");
  void _subscriptionId; // Silence unused variable warning
  const [pollCount, setPollCount] = useState(0);
  const [countdown, setCountdown] = useState(5);

  const { data: assinatura, refetch, isLoading } = useMinhaAssinatura();

  // Determine state based on subscription data
  const isConfirmed = assinatura?.assinaturaAtiva === true;
  const isChecking = !isConfirmed && pollCount < 10;

  // Poll for subscription activation
  useEffect(() => {
    if (isConfirmed || pollCount >= 10) return;

    const timer = setTimeout(async () => {
      await refetch();
      setPollCount((prev) => prev + 1);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isConfirmed, pollCount, refetch]);

  // Countdown for redirect when confirmed
  useEffect(() => {
    if (!isConfirmed) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/feed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, isConfirmed]);

  // Still checking
  if (isChecking || isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="text-primary animate-spin" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Verificando pagamento...
          </h1>
          <p className="text-muted mb-6">
            Aguarde enquanto confirmamos seu pagamento.
          </p>
          <p className="text-sm text-muted">
            Tentativa {pollCount + 1} de 10
          </p>
        </CardContent>
      </Card>
    );
  }

  // Payment pending (webhook didn't confirm after max polls)
  if (!isConfirmed) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="text-warning" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pagamento em processamento
          </h1>
          <p className="text-muted mb-6">
            Seu pagamento está sendo processado. Isso pode levar alguns minutos.
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push("/feed")} className="w-full">
              <span>Ir para o feed</span>
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPollCount(0);
              }}
              className="w-full"
            >
              <RefreshCw size={20} />
              <span>Verificar novamente</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Confirmed!
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-success" size={48} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Assinatura ativada!
        </h1>
        <p className="text-muted mb-4">
          Seu plano {assinatura?.planoNome} está ativo. Agora você pode ver as informações de contato de todos os compradores.
        </p>
        {assinatura?.dataFim && (
          <p className="text-sm text-success mb-6">
            Válido até {new Date(assinatura.dataFim).toLocaleDateString("pt-BR")}
          </p>
        )}
        <p className="text-sm text-muted mb-6">
          Redirecionando em {countdown} segundos...
        </p>
        <div className="space-y-3">
          <Button onClick={() => router.push("/feed")} className="w-full">
            <Home size={20} />
            <span>Explorar intenções</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted">Carregando...</p>
      </CardContent>
    </Card>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingFallback />}>
          <SubscriptionSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
