"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

const roles: { value: UserRole; title: string; description: string; icon: typeof ShoppingBag; color: string }[] = [
  {
    value: "BUYER",
    title: "Comprador Ocasional",
    description: "Estou procurando um veículo pessoal.",
    icon: ShoppingBag,
    color: "bg-blue-100 text-primary",
  },
  {
    value: "SELLER",
    title: "Lojista / Revendedor",
    description: "Compro e vendo veículos profissionalmente.",
    icon: Store,
    color: "bg-purple-100 text-purple-600",
  },
];

function RoleSelectForm() {
  const router = useRouter();
  const { updateProfile, isUpdatingProfile } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (!selectedRole) return;
    
    updateProfile({ role: selectedRole }, {
      onSuccess: () => {
        router.push("/feed");
      },
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-3xl shadow-xl p-6">
        {/* Drag Handle Visual */}
        <div className="w-12 h-1.5 bg-muted/30 rounded-full mx-auto mb-6" />
        
        <h2 className="text-xl font-bold text-foreground text-center mb-2">
          Como você vai usar o TeAchei?
        </h2>
        <p className="text-muted text-center text-sm mb-6 px-4">
          Isso nos ajuda a personalizar sua experiência.
        </p>

        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;

            return (
              <label key={role.value} className="cursor-pointer group block">
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={isSelected}
                  onChange={() => setSelectedRole(role.value)}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    "relative flex items-center p-4 rounded-2xl border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-muted/10"
                  )}
                >
                  <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0", role.color)}>
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{role.title}</h3>
                    <p className="text-xs text-muted mt-1">{role.description}</p>
                  </div>
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted"
                    )}
                  >
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          isLoading={isUpdatingProfile}
          className="w-full mt-6"
          size="lg"
        >
          <span>Continuar</span>
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
}

function RoleSelectFallback() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Suspense fallback={<RoleSelectFallback />}>
        <RoleSelectForm />
      </Suspense>
    </div>
  );
}
