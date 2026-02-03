"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { Button, Card, CardContent, Avatar, Badge } from "@/components/ui";
import { getUserProfile } from "@/lib/auth";
import { formatRelativeTime } from "@/lib/utils";

// TODO: Para cobrar assinatura, verificar se usuário tem assinatura ativa antes de mostrar perfil
// Consistente com bypass em AnuncioController.java
// Se não tiver assinatura, redirecionar para /assinatura

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Perfil não encontrado
        </h2>
        <p className="text-muted text-center mb-6">
          O perfil que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={() => router.push("/")}>Voltar ao Feed</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center h-16 px-4 lg:px-6 max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-full text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-foreground">Perfil</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-6 pb-24">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={profile.avatarUrl}
                fotoBase64={profile.fotoBase64}
                fallback={profile.nome}
                size="xl"
                className="mb-4"
              />
              
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {profile.nome}
              </h2>
              
              {(profile.cidade || profile.estado) && (
                <p className="flex items-center gap-1 text-muted mb-3">
                  <MapPin size={16} />
                  {[profile.cidade, profile.estado].filter(Boolean).join(", ")}
                </p>
              )}

              {profile.bio && (
                <p className="text-foreground mb-4 max-w-md">{profile.bio}</p>
              )}

              {profile.createdAt && (
                <p className="flex items-center gap-1 text-sm text-muted">
                  <Calendar size={14} />
                  Membro {formatRelativeTime(profile.createdAt)}
                </p>
              )}

              {/* Role Badge */}
              <div className="mt-4">
                <Badge variant={profile.role === "SELLER" ? "info" : "default"}>
                  {profile.role === "SELLER" ? "Lojista" : "Comprador"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for user's intentions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Intenções de {profile.nome?.split(" ")[0]}
            </h3>
            <p className="text-muted text-sm">
              Em breve você poderá ver as intenções de compra deste usuário.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
