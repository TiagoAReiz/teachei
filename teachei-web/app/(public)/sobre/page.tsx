import { Metadata } from "next";
import { Users, Target, ShieldCheck } from "lucide-react";
import { AdSense } from "@/components/adsense";

export const metadata: Metadata = {
    title: "Sobre Nós",
    description: "Conheça a história e a missão do TeAchei, o marketplace invertido de veículos.",
};

export default function AboutPage() {
    return (
        <>
            <AdSense />
            <div className="bg-background min-h-screen">
                {/* Hero */}
                <div className="relative py-20 lg:py-32 overflow-hidden bg-surface">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                        <h1 className="text-4xl lg:text-6xl font-black text-foreground mb-6">
                            Revolucionando a forma de <br />
                            <span className="text-primary">comprar e vender veículos</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            O TeAchei nasceu de uma frustração comum: a dificuldade de encontrar o carro certo em meio a milhares de anúncios irrelevantes.
                            Decidimos inverter a lógica do mercado.
                        </p>
                    </div>

                    {/* Background decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-0" />
                </div>

                {/* Mission */}
                <div className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Target size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Inverter o Jogo</h3>
                            <p className="text-muted-foreground">
                                Em vez de vendedores gritarem por atenção, compradores dizem o que querem. Isso cria leads qualificados e elimina o desperdício de tempo.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Conexão Humana</h3>
                            <p className="text-muted-foreground">
                                Acreditamos na negociação direta. Sem intermediários, sem taxas escondidas. Apenas comprador e vendedor fechando negócio via WhatsApp.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Transparência</h3>
                            <p className="text-muted-foreground">
                                Usamos dados da Tabela FIPE e verificação de usuários para garantir um ambiente seguro e justo para todos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="py-20 bg-surface/50 border-y border-border">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 prose prose-lg dark:prose-invert">
                        <h2>Nossa História</h2>
                        <p>
                            O TeAchei começou em 2024 como um projeto ambicioso para resolver as dores do mercado automotivo brasileiro.
                            Cansados de plataformas cheias de anúncios desatualizados e golpes, criamos um espaço onde a <strong>intenção de compra</strong> é a protagonista.
                        </p>
                        <p>
                            Hoje, ajudamos milhares de pessoas a encontrar seu próximo veículo de forma rápida, segura e eficiente.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
