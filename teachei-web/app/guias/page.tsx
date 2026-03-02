import { Metadata } from "next";
import { MainLayout } from "@/components/layout";
import { guides } from "@/lib/guides";
import { GuideCard } from "@/components/guide-card";
import { AdSense } from "@/components/adsense";

export const metadata: Metadata = {
    title: "Guias e Dicas Automotivas",
    description: "Dicas, tutoriais e guias completos sobre compra e venda de veículos, tabela FIPE e segurança.",
};

export default function GuidesPage() {
    return (
        <MainLayout>
            <AdSense />
            <div className="bg-background min-h-screen pb-20">
                {/* Header */}
                <div className="bg-surface border-b border-border py-16">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                        <h1 className="text-3xl lg:text-5xl font-black text-foreground mb-4">
                            Guias e Dicas TeAchei
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Tudo o que você precisa saber para fazer o melhor negócio, com segurança e inteligência.
                        </p>
                    </div>
                </div>

                {/* Grid */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {guides.map((guide) => (
                            <GuideCard key={guide.slug} guide={guide} />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
