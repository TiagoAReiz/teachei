import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { guides } from "@/lib/guides";
import { ChevronLeft, Clock, Calendar } from "lucide-react";
import Markdown from "react-markdown";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const guide = guides.find((g) => g.slug === slug);

    if (!guide) {
        return {
            title: "Guia não encontrado",
        };
    }

    return {
        title: guide.title,
        description: guide.excerpt,
        openGraph: {
            images: [guide.coverImage],
        },
    };
}

export async function generateStaticParams() {
    return guides.map((guide) => ({
        slug: guide.slug,
    }));
}

export default async function GuidePostPage({ params }: Props) {
    const { slug } = await params;
    const guide = guides.find((g) => g.slug === slug);

    if (!guide) {
        notFound();
    }

    return (
        <MainLayout>
            <article className="min-h-screen bg-background pb-20">
                {/* Header */}
                <div className="bg-surface border-b border-border">
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
                        <Link
                            href="/guias"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium mb-8"
                        >
                            <ChevronLeft size={18} />
                            Voltar para Guias
                        </Link>

                        <div className="flex gap-3 mb-6">
                            {guide.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
                            {guide.title}
                        </h1>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {guide.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {guide.readTime}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto px-6 lg:px-8 -mt-8">
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-12">
                        <Image
                            src={guide.coverImage}
                            alt={guide.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground max-w-none">
                        <Markdown>{guide.content}</Markdown>
                    </div>

                    {/* Share / CTA */}
                    <div className="mt-16 pt-8 border-t border-border flex flex-col items-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Gostou desse guia?</h3>
                        <p className="text-muted-foreground mb-8">
                            Encontre o veículo ideal ou o comprador perfeito no TeAchei agora mesmo.
                        </p>
                        <Link
                            href="/feed"
                            className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                        >
                            Ver Intenções de Compra
                        </Link>
                    </div>
                </div>
            </article>
        </MainLayout>
    );
}
