import Link from "next/link";
import { Car, Instagram, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-primary font-extrabold text-xl tracking-tight mb-4">
              <Car size={28} />
              <span>TeAchei</span>
            </Link>
            <p className="text-muted text-sm max-w-md mb-4">
              A maneira mais fácil de encontrar seu próximo veículo. Conecte-se com vendedores e encontre o carro, moto ou caminhão dos seus sonhos.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-muted hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-muted hover:text-whatsapp hover:bg-whatsapp/10 transition-colors"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted hover:text-primary transition-colors text-sm">
                  Feed de Intenções
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-muted hover:text-primary transition-colors text-sm">
                  Criar Intenção
                </Link>
              </li>
              <li>
                <Link href="/#como-funciona" className="text-muted hover:text-primary transition-colors text-sm">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/termos" className="text-muted hover:text-primary transition-colors text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-muted hover:text-primary transition-colors text-sm">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/suporte" className="text-muted hover:text-primary transition-colors text-sm">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-muted text-sm">
            © {currentYear} TeAchei. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}



