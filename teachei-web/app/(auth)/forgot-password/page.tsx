"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button, Input } from "@/components/ui";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    // TODO: Implement password reset API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-success" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Email enviado!
          </h1>
          <p className="text-muted mb-8">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft size={20} />
              <span>Voltar para o login</span>
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Esqueceu sua senha?
        </h1>
        <p className="text-muted">
          Digite seu email e enviaremos instruções para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          icon={<Mail size={20} />}
          error={errors.email?.message}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Enviar instruções
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          <ArrowLeft size={18} />
          <span>Voltar para o login</span>
        </Link>
      </div>
    </AuthLayout>
  );
}



