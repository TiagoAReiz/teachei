import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        {/* 404 */}
        <div className="text-8xl font-extrabold text-primary/20 mb-4">404</div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Página não encontrada
        </h1>
        <p className="text-muted mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button>
              <Home size={18} />
              Voltar ao início
            </Button>
          </Link>
          <Link href="/feed">
            <Button variant="outline">
              <Search size={18} />
              Explorar intenções
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}



