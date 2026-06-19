"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Car, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCreateIntentionStore } from "@/stores/create-intention-store";

const steps = [
  { id: 1, label: "Categoria", path: "/create" },
  { id: 2, label: "Veículo", path: "/create/vehicle" },
  { id: 3, label: "Detalhes", path: "/create/specs" },
  { id: 4, label: "Revisão", path: "/create/review" },
];

export default function CreateLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { reset } = useCreateIntentionStore();

  const currentStepIndex = steps.findIndex((s) => s.path === pathname);
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleBack = () => {
    if (currentStepIndex <= 0) {
      router.push("/feed");
    } else {
      router.push(steps[currentStepIndex - 1].path);
    }
  };

  const handleCancel = () => {
    reset();
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-surface border-b border-border">
        <div className="flex items-center h-16 px-4 lg:px-6">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft size={24} />
          </button>

          <Link href="/feed" className="flex items-center gap-2 text-primary font-extrabold text-xl tracking-tight ml-2">
            <Car size={28} />
            <span className="hidden sm:inline">TeAchei</span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-muted">
              Passo {currentStep} de {steps.length}
            </span>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
              aria-label="Cancelar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 lg:px-6">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex items-center">
                <div
                  className={cn(
                    "flex-1 h-1 rounded-full transition-colors",
                    index < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={cn(
                  "text-xs font-medium",
                  index < currentStep ? "text-primary" : "text-muted"
                )}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-6 max-w-2xl mx-auto">
        {children}
      </main>
    </div>
  );
}



