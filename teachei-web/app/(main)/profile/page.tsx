"use client";

import { useRouter } from "next/navigation";
import { Settings, Edit2, MapPin, Instagram, Facebook, Verified } from "lucide-react";
import { Button, Avatar, Card, CardContent } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useMyIntentions } from "@/hooks/use-intentions";
import { IntentionGrid } from "@/components/intentions";
import { getInstagramLink } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useAuth();
  const { data: myIntentions, isLoading: isLoadingIntentions } = useMyIntentions();

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar src={user.avatarUrl} fotoBase64={user.fotoBase64} fallback={user.nome} size="xl" />
            
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
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
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

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/settings")}>
                <Edit2 size={16} />
                Editar
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
                <Settings size={20} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Intentions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Minhas Intenções</h2>
          <Button variant="outline" size="sm" onClick={() => router.push("/my-intentions")}>
            Ver todas
          </Button>
        </div>

        <IntentionGrid
          intentions={myIntentions?.slice(0, 3) || []}
          isLoading={isLoadingIntentions}
        />
      </div>
    </div>
  );
}



