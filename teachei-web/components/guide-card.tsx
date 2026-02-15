"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, BookText } from "lucide-react";
import { type Guide } from "@/lib/guides";

interface GuideCardProps {
    guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
    const [imageError, setImageError] = useState(false);

    return (
        <Link href={`/guias/${guide.slug}`} className="group">
            <article className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                <div className="relative h-48 w-full overflow-hidden bg-muted/30">
                    {!imageError ? (
                        <Image
                            src={guide.coverImage}
                            alt={guide.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BookText size={48} className="text-muted-foreground/50" />
                        </div>
                    )}
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
    );
}
