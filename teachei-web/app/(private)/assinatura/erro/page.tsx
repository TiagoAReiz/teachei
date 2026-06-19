"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, Home, RefreshCw } from "lucide-react";
import { Button, Card, CardContent } from "@/components/ui";

function SubscriptionErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("id");

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-destructive" size={48} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pagamento não aprovado
        </h1>
        <p className="text-muted mb-6">
          Houve um problema com seu pagamento. Por favor, tente novamente ou use outro método de pagamento.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={() => router.push("/assinatura")} 
            className="w-full"
          >
            <RefreshCw size={20} />
            <span>Tentar novamente</span>
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

export default function SubscriptionErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingFallback />}>
          <SubscriptionErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
