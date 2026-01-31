"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Home, RefreshCw } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";
import { useMinhaAssinatura } from "@/hooks/use-subscriptions";

function SubscriptionPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("id");
  const [pollCount, setPollCount] = useState(0);

  const { data: assinatura, refetch, isLoading } = useMinhaAssinatura();

  // Check if subscription is now active
  const isConfirmed = assinatura?.assinaturaAtiva === true;

  // Poll for subscription activation
  useEffect(() => {
    if (isConfirmed || pollCount >= 20) return;

    const timer = setTimeout(async () => {
      await refetch();
      setPollCount((prev) => prev + 1);
    }, 5000); // Poll every 5 seconds

    return () => clearTimeout(timer);
  }, [isConfirmed, pollCount, refetch]);

  // Redirect if confirmed
  useEffect(() => {
    if (isConfirmed) {
      router.push("/assinatura/sucesso?id=" + subscriptionId);
    }
  }, [isConfirmed, router, subscriptionId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted">Verificando status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="text-warning" size={48} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pagamento pendente
        </h1>
        <p className="text-muted mb-4">
          Seu pagamento está sendo processado. Isso pode levar alguns minutos dependendo do método de pagamento escolhido.
        </p>
        <p className="text-sm text-muted mb-6">
          Se você pagou com boleto, pode levar até 3 dias úteis para confirmar.
        </p>
        
        {pollCount > 0 && pollCount < 20 && (
          <p className="text-xs text-muted mb-4">
            Verificando automaticamente... ({pollCount}/20)
          </p>
        )}

        <div className="space-y-3">
          <Button 
            variant="outline"
            onClick={() => {
              setPollCount(0);
              refetch();
            }} 
            className="w-full"
          >
            <RefreshCw size={20} />
            <span>Verificar novamente</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push("/")} 
            className="w-full"
          >
            <Home size={20} />
            <span>Voltar ao início</span>
          </Button>
        </div>
        {subscriptionId && (
          <p className="text-xs text-muted mt-4">
            Referência: {subscriptionId}
          </p>
        )}
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

export default function SubscriptionPendingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingFallback />}>
          <SubscriptionPendingContent />
        </Suspense>
      </div>
    </div>
  );
}
