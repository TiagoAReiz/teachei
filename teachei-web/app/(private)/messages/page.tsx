"use client";

import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <MessageCircle className="text-primary" size={32} />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        Mensagens em breve
      </h2>
      <p className="text-muted text-center max-w-sm">
        Estamos trabalhando em um sistema de mensagens para você se conectar com compradores e vendedores.
      </p>
    </div>
  );
}



