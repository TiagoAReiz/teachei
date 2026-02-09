"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthLayout } from "@/components/layout/auth-layout";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { login, isLoggingIn, loginError, googleLogin, isGoogleLoggingIn, googleLoginError, isAuthenticated, isLoading } = useAuth({ redirectUrl });
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/feed");
    }
  }, [isAuthenticated, isLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setShowError(false);
    login(data, {
      onError: () => setShowError(true),
    });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Send the access token to our backend for verification
      googleLogin(tokenResponse.access_token, {
        onError: () => setShowError(true),
      });
    },
    onError: () => setShowError(true),
  });

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Bem-vindo de volta
        </h1>
        <p className="text-muted">
          Entre com sua conta para continuar
        </p>
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-3 mb-6">
        <button 
          onClick={() => handleGoogleLogin()}
          disabled={isGoogleLoggingIn}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-surface border border-border text-foreground h-[52px] px-6 transition-transform active:scale-[0.98] font-semibold hover:bg-muted/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoggingIn ? (
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          <span>Continuar com Google</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative py-6 flex items-center">
        <div className="flex-grow border-t border-border" />
        <span className="flex-shrink-0 mx-4 text-muted text-sm">Ou continue com email</span>
        <div className="flex-grow border-t border-border" />
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          icon={<Mail size={20} />}
          error={errors.email?.message}
        />

        <Input
          {...register("senha")}
          type="password"
          placeholder="Senha"
          icon={<Lock size={20} />}
          error={errors.senha?.message}
        />

        <div className="flex justify-end pt-1">
          <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
            Esqueceu a senha?
          </Link>
        </div>

        {showError && (loginError || googleLoginError) && (
          <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
            {loginError?.message || googleLoginError?.message || "Email ou senha incorretos"}
          </div>
        )}

        <Button type="submit" className="w-full mt-4" size="lg" isLoading={isLoggingIn}>
          <span>Entrar</span>
          <ArrowRight size={20} />
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <p className="text-muted text-sm">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline ml-1">
            Criar conta
          </Link>
        </p>
      </div>
    </>
  );
}

function LoginFallback() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
