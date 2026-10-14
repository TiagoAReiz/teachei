"use client";

import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import { Button, Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useRegistrarVenda } from "@/hooks/use-avaliacoes";

/** Vendedor avisa que vendeu para o dono da intenção; o comprador então pode avaliá-lo. */
export function SoldButton({ anuncioId }: { anuncioId: string }) {
  const [aberto, setAberto] = useState(false);
  const [feito, setFeito] = useState(false);
  const { mutate, isPending } = useRegistrarVenda();
  const { success, error } = useToast();

  const confirmar = () =>
    mutate(anuncioId, {
      onSuccess: () => { setFeito(true); setAberto(false); success("Pronto! O comprador poderá avaliar você."); },
      onError: (e) => error(e.message || "Erro ao registrar venda"),
    });

  if (feito) {
    return <p className="mt-4 text-sm text-muted flex items-center gap-2"><BadgeCheck size={16} /> Venda registrada. Aguardando a avaliação do comprador.</p>;
  }

  return (
    <>
      <Button variant="outline" className="w-full mt-4" onClick={() => setAberto(true)}>
        <BadgeCheck size={18} />
        Vendi para este comprador
      </Button>
      <Dialog isOpen={aberto} onClose={() => setAberto(false)}>
        <DialogHeader onClose={() => setAberto(false)}>
          <DialogTitle>Confirmar venda</DialogTitle>
          <DialogDescription>
            Você está dizendo que fechou negócio com o dono desta intenção. Ele receberá um convite para avaliar você.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAberto(false)}>Cancelar</Button>
          <Button onClick={confirmar} disabled={isPending}>Confirmar</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
