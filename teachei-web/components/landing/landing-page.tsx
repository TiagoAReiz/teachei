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
  CheckCircle2,
  Zap,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "@/components/ui/logo";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { siteConfig } from "@/config/site";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    icon: Target,
    title: "Compradores Qualificados",
    description: "Receba contatos de pessoas que realmente querem comprar o veículo que você tem.",
    color: "bg-blue-500",
  },
  {
    icon: Search,
    title: "Busca Inteligente",
    description: "Filtre por marca, modelo, ano, cor e muito mais para encontrar o comprador ideal.",
    color: "bg-purple-500",
  },
  {
    icon: WhatsAppIcon,
    title: "Contato Direto",
    description: "Comunique-se diretamente via WhatsApp com compradores interessados.",
    color: "bg-green-500",
  },
  {
    icon: Shield,
    title: "Compradores Verificados",
    description: "Usuários verificados garantem negociações mais seguras e confiáveis.",
    color: "bg-orange-500",
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Comprador cria intenção",
    description: "O comprador descreve exatamente o veículo que procura.",
    icon: Zap,
  },
  {
    step: 2,
    title: "Vendedor encontra",
    description: "Você encontra compradores buscando veículos como o seu.",
    icon: Search,
  },
  {
    step: 3,
    title: "Negociação direta",
    description: "Envie sua proposta diretamente pelo WhatsApp.",
    icon: WhatsAppIcon,
  },
];

export function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="fixed top-6 left-0 right-0 z-50 px-4">
        <div className="max-w-7xl mx-auto bg-surface-glass backdrop-blur-xl border border-white/20 shadow-2xl shadow-primary/10 rounded-full h-20 px-6 lg:px-8 flex items-center justify-between transition-all duration-300">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-foreground/80 hover:text-primary transition-colors font-bold text-sm uppercase tracking-wide">
              Como funciona
            </a>
            <a href="#recursos" className="text-foreground/80 hover:text-primary transition-colors font-bold text-sm uppercase tracking-wide">
              Recursos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button size="sm" onClick={() => router.push("/feed")} className="shadow-lg shadow-primary/20">
                Ir para o Feed
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => router.push("/login")} className="hidden sm:flex hover:bg-primary/5">
                  Entrar
                </Button>
                <Button size="sm" onClick={() => router.push("/register")} className="shadow-lg shadow-primary/20">
                  Criar Conta
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-float" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[80px] -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-[60px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/50 backdrop-blur-sm shadow-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-success"></span>
            <span className="text-sm font-bold text-muted-foreground">Nova plataforma de vendas</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-foreground leading-[1.1] mb-8 tracking-tight">
            Venda seu carro para quem <br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              já quer comprar.
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            O TeAchei inverte o jogo: conectamos vendedores diretamente com compradores qualificados que buscam exatamente o seu veículo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" onClick={() => router.push("/register")} className="h-16 px-10 text-lg shadow-xl shadow-primary/30 hover:scale-105">
              Começar agora
              <ArrowRight size={20} />
            </Button>
            <Button variant="secondary" size="lg" onClick={() => router.push("/feed")} className="h-16 px-10 text-lg bg-white shadow-lg hover:shadow-xl hover:-translate-y-1">
              <Search size={20} />
              Ver intenções
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-24 lg:py-32 bg-surface/50 relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-6">
              Como funciona
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Simplificamos o processo para você fechar negócio mais rápido.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative group">
                  <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] transform transition-transform group-hover:scale-105 group-hover:-rotate-1" />
                  <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 p-8 rounded-[2rem] shadow-xl shadow-primary/5 h-full transition-transform group-hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20 transform group-hover:scale-110 transition-transform duration-300">
                      <Icon size={32} />
                    </div>
                    <div className="absolute top-8 right-8 text-6xl font-black text-slate-100 -z-10">
                      0{item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-6">
              Por que usar o TeAchei?
            </h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
              Ferramentas poderosas para conectar quem quer vender com quem quer comprar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-surface hover:bg-white p-8 rounded-[2rem] border-0 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="bg-gradient-to-br from-primary via-primary-dark to-purple-900 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight">
                Pronto para encontrar seu <br/> próximo comprador?
              </h2>
              <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-medium">
                Junte-se a milhares de vendedores que já estão conectando com compradores qualificados todos os dias.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push("/register")}
                  className="bg-white text-primary hover:bg-white/90 h-16 px-10 text-lg shadow-xl"
                >
                  Criar conta grátis
                  <ArrowRight size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/login")}
                  className="border-2 border-white/30 text-white hover:bg-white/10 h-16 px-10 text-lg backdrop-blur-sm"
                >
                  Já tenho conta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}



