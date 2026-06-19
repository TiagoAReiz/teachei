"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Verified, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button, Card, CardContent, Avatar } from "@/components/ui";
import { IntentionGrid } from "@/components/intentions";
import { useInfiniteUserIntentions } from "@/hooks/use-intentions";
import { getWhatsAppLink, getInstagramLink } from "@/lib/utils";
import type { User } from "@/types";

interface UserProfileClientProps {
  user: User;
}

export function UserProfileClient({ user }: UserProfileClientProps) {
  const router = useRouter();

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUserIntentions(user.id);
  const intentions = data?.pages.flatMap((p) => p.content) ?? [];

  const whatsappMessage = `Olá ${user.nome}! Vi seu perfil no TeAchei e gostaria de entrar em contato.`;

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
          <span className="ml-4 font-semibold text-foreground">Perfil</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-6 pb-24">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar src={user.avatarUrl} fallback={user.nome} size="xl" />
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{user.nome}</h1>
                  {user.verified && (
                    <Verified className="text-primary" size={20} />
                  )}
                </div>
                
                {(user.cidade || user.estado) && (
                  <p className="flex items-center justify-center sm:justify-start gap-1 text-muted mb-3">
                    <MapPin size={16} />
                    {[user.cidade, user.estado].filter(Boolean).join(", ")}
                  </p>
                )}

                {user.bio && (
                  <p className="text-foreground mb-4">{user.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  {user.instagram && (
                    <a
                      href={getInstagramLink(user.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted/10 text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {user.facebook && (
                    <a
                      href={user.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-muted/10 text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              {user.telefone && (
                <a
                  href={getWhatsAppLink(user.telefone, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="whatsapp">
                    <MessageCircle size={18} />
                    Contato
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User's Intentions */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Intenções de {user.nome.split(" ")[0]}
          </h2>

          <IntentionGrid
            intentions={intentions}
            isLoading={isLoading}
            onLoadMore={() => fetchNextPage()}
            hasMore={hasNextPage}
            isLoadingMore={isFetchingNextPage}
          />
        </div>
      </main>
    </div>
  );
}



