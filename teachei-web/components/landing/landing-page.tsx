"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MessageCircle,
  Shield,
  ArrowRight,
  Target,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";

const features = [
  {
    icon: Target,
    title: "Compradores Qualificados",
    description: "Receba contatos de pessoas que realmente querem comprar o veículo que você tem.",
  },
  {
    icon: Search,
    title: "Busca Inteligente",
    description: "Filtre por marca, modelo, ano, cor e muito mais para encontrar o comprador ideal.",
  },
  {
    icon: MessageCircle,
    title: "Contato Direto",
    description: "Comunique-se diretamente via WhatsApp com compradores interessados.",
  },
  {
    icon: Shield,
    title: "Compradores Verificados",
    description: "Usuários verificados garantem negociações mais seguras e confiáveis.",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Comprador cria intenção",
    description: "O comprador descreve exatamente o veículo que procura.",
  },
  {
    step: 2,
    title: "Vendedor encontra",
    description: "Você encontra compradores buscando veículos como o seu.",
  },
  {
    step: 3,
    title: "Negociação direta",
    description: "Envie sua proposta diretamente pelo WhatsApp.",
  },
];

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-foreground hover:text-primary transition-colors font-medium">
              Como funciona
            </a>
            <a href="#recursos" className="text-foreground hover:text-primary transition-colors font-medium">
              Recursos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
              Entrar
            </Button>
            <Button size="sm" onClick={() => router.push("/register")}>
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Conecte-se com quem
              <span className="text-primary"> realmente quer comprar</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-xl">
              O TeAchei conecta vendedores de veículos com compradores qualificados que já sabem exatamente o que querem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" onClick={() => router.push("/register")} className="text-lg px-8">
                Começar agora
                <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push("/feed")} className="text-lg px-8">
                <Search size={20} />
                Ver intenções
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-16 lg:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Como funciona
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Em apenas 3 passos, você conecta seu estoque com compradores qualificados
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl font-bold text-2xl mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted">{item.description}</p>
                
                {item.step < 3 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-1rem)] w-[calc(100%-3rem)]">
                    <div className="border-t-2 border-dashed border-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Por que usar o TeAchei?
            </h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Recursos pensados para facilitar a conexão entre vendedores e compradores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-surface rounded-2xl p-6 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Pronto para encontrar seu próximo comprador?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Junte-se a milhares de vendedores que já estão conectando com compradores qualificados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8"
            >
              Criar conta grátis
              <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/login")}
              className="border-white text-white hover:bg-white/10 text-lg px-8"
            >
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="mb-4">
                <Logo size="md" />
              </div>
              <p className="text-muted text-sm max-w-sm mb-4">
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
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Navegação</h3>
              <ul className="space-y-2">
                <li><Link href="/feed" className="text-muted hover:text-primary text-sm">Feed de Intenções</Link></li>
                <li><a href="#como-funciona" className="text-muted hover:text-primary text-sm">Como Funciona</a></li>
                <li><a href="#recursos" className="text-muted hover:text-primary text-sm">Recursos</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/termos" className="text-muted hover:text-primary text-sm">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="text-muted hover:text-primary text-sm">Privacidade</Link></li>
                <li><Link href="/contato" className="text-muted hover:text-primary text-sm">Fale Conosco</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border text-center">
            <p className="text-muted text-sm">
              © {new Date().getFullYear()} TeAchei. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}



