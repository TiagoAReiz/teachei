import Link from "next/link";
import { Car, Instagram } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-surface border-0 shadow-2xl shadow-primary/5 rounded-[3rem] p-12 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="-ml-3">
                <Logo size="lg" variant="horizontal" href="/" />
              </div>
              <p className="text-muted-foreground font-medium max-w-md leading-relaxed">
                A maneira mais fácil de encontrar seu próximo veículo. Conecte-se com vendedores e encontre o carro, moto ou caminhão dos seus sonhos.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href={siteConfig.links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-background text-muted-foreground hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-background text-muted-foreground hover:text-white hover:bg-green-500 transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                >
                  <WhatsAppIcon size={20} />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-foreground mb-6 text-lg">Navegação</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/feed" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Feed de Intenções
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Criar Intenção
                  </Link>
                </li>
                <li>
                  <Link href="/guias" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Guias e Dicas
                  </Link>
                </li>
                <li>
                  <Link href="/sobre" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/#como-funciona" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Como Funciona
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-foreground mb-6 text-lg">Legal</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/termos" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                    Fale Conosco
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/50 text-center">
            <p className="text-muted-foreground font-medium text-sm">
              © {currentYear} TeAchei. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}



