"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useIntentions } from "@/hooks/use-intentions";
import { IntentionCard } from "./intention-card";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import type { IntentionFilters } from "@/types";
import { useRef, useState, useEffect } from "react";

interface IntentionCarouselProps {
    title: string;
    subtitle?: string;
    filters: IntentionFilters;
    ctaLink: string;
    ctaText?: string;
}

export function IntentionCarousel({
    title,
    subtitle,
    filters,
    ctaLink,
    ctaText = "Ver todos",
}: IntentionCarouselProps) {
    // Always fetch 10 items for the carousel
    const { data, isLoading } = useIntentions({ ...filters, size: 10 });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
        }
    };

    useEffect(() => {
        checkScroll();
    }, [data]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350; // Roughly card width + gap
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    if (!isLoading && (!data || data.content.length === 0)) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex items-end justify-between mb-6 px-4 lg:px-0">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-muted-foreground">{subtitle}</p>
                    )}
                </div>

                <div className="hidden sm:flex gap-2">
                    <Link href={ctaLink}>
                        <Button variant="outline" className="group">
                            {ctaText}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative group/carousel">
                {/* Scroll Buttons - Visible on hover only on desktop */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg flex items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 -ml-5 hidden lg:flex hover:bg-background"
                    disabled={!canScrollLeft}
                >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                </button>

                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-lg flex items-center justify-center text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 -mr-5 hidden lg:flex hover:bg-background"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Carousel Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[300px] sm:min-w-[320px] snap-center">
                                <SkeletonCard />
                            </div>
                        ))
                    ) : (
                        data?.content.map((intention) => (
                            <div key={intention.id} className="min-w-[300px] sm:min-w-[320px] snap-center">
                                <IntentionCard intention={intention} />
                            </div>
                        ))
                    )}

                    {/* View All Card at the end */}
                    {!isLoading && (
                        <div className="min-w-[150px] sm:min-w-[180px] snap-center flex items-center justify-center">
                            <Link href={ctaLink} className="group flex flex-col items-center gap-3 p-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <ArrowRight className="w-8 h-8 text-primary group-hover:translate-x-1 transition-transform" />
                                </div>
                                <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                    Ver todos
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile CTA */}
            <div className="mt-2 text-center sm:hidden px-4">
                <Link href={ctaLink} className="block w-full">
                    <Button variant="outline" className="w-full">
                        {ctaText}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
