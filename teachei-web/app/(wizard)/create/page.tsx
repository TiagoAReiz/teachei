"use client";

import { useRouter } from "next/navigation";
import { Car, Bike, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCreateIntentionStore } from "@/stores/create-intention-store";
import type { TipoVeiculo } from "@/types";

const categories: { value: TipoVeiculo; label: string; description: string; icon: typeof Car }[] = [
  {
    value: "CARRO",
    label: "Carro",
    description: "Sedans, hatches, SUVs e mais",
    icon: Car,
  },
  {
    value: "MOTO",
    label: "Moto",
    description: "Motos esportivas, custom e scooters",
    icon: Bike,
  },
  {
    value: "CAMINHAO",
    label: "Caminhão",
    description: "Leves, médios e pesados",
    icon: Truck,
  },
];

export default function CreateCategoryPage() {
  const router = useRouter();
  const { tipoVeiculo, setTipoVeiculo } = useCreateIntentionStore();

  const handleContinue = () => {
    if (tipoVeiculo) {
      router.push("/create/vehicle");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Qual tipo de veículo você procura?
        </h1>
        <p className="text-muted">
          Escolha a categoria para começar
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = tipoVeiculo === category.value;

          return (
            <button
              key={category.value}
              onClick={() => setTipoVeiculo(category.value)}
              className={cn(
                "w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-surface hover:bg-muted/10"
              )}
            >
              <div
                className={cn(
                  "h-14 w-14 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-colors",
                  isSelected ? "bg-primary text-white" : "bg-muted/10 text-muted"
                )}
              >
                <Icon size={28} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{category.label}</h3>
                <p className="text-sm text-muted">{category.description}</p>
              </div>
              <div
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-muted"
                )}
              >
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleContinue}
        disabled={!tipoVeiculo}
        className="w-full"
        size="lg"
      >
        <span>Continuar</span>
        <ArrowRight size={20} />
      </Button>
    </div>
  );
}



