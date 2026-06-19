import Link from "next/link";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="text-muted" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Usuário não encontrado
        </h1>
        <p className="text-muted mb-8">
          Este perfil pode ter sido removido ou o link está incorreto.
        </p>
        <Link href="/feed">
          <Button>
            <ArrowLeft size={18} />
            Voltar ao feed
          </Button>
        </Link>
      </div>
    </div>
  );
}



