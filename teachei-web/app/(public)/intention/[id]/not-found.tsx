import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";

export default function IntentionNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="text-muted" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Intenção não encontrada
        </h1>
        <p className="text-muted mb-8">
          Esta intenção pode ter sido removida ou o link está incorreto.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/feed">
            <Button>
              <ArrowLeft size={18} />
              Voltar ao feed
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}



