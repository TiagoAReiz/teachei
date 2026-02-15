import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MainLayout } from "@/components/layout";
import { guides } from "@/lib/guides";
import { Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
    title: "Guias e Dicas Automotivas",
    description: "Dicas, tutoriais e guias completos sobre compra e venda de veículos, tabela FIPE e segurança.",
};

export default function GuidesPage() {
    return (
        <MainLayout>
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
                            <Link key={guide.slug} href={`/guias/${guide.slug}`} className="group">
                                <article className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={guide.coverImage}
                                            alt={guide.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex gap-2 mb-4">
                                            {guide.tags.map((tag) => (
                                                <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {guide.title}
                                        </h2>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                                            {guide.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground font-medium border-t border-border/50 pt-4">
                                            <div className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {guide.readTime}
                                            </div>
                                            <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                                            <div>{guide.date}</div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
