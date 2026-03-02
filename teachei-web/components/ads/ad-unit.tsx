"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
    interface Window {
        adsbygoogle: Array<Record<string, unknown>>;
    }
}

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdUnitProps {
    /** Ad slot ID from AdSense dashboard */
    slot: string;
    /** Ad format layout */
    format?: AdFormat;
    /** Whether to use full-width responsive */
    fullWidthResponsive?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Style overrides for the ins element */
    style?: React.CSSProperties;
}

/**
 * Reusable Google AdSense ad unit component.
 * Renders an actual ad block (`<ins>`) that displays a real advertisement.
 * 
 * The main adsbygoogle.js script is injected only when this ad unit is present on the page.
 */
export function AdUnit({
    slot,
    format = "auto",
    fullWidthResponsive = true,
    className,
    style,
}: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);
    const pushed = useRef(false);

    useEffect(() => {
        // Only push once per mount
        if (pushed.current) return;

        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
        } catch (err) {
            console.error("AdSense push error:", err);
        }
    }, []);

    return (
        <div className={cn("ad-container overflow-hidden", className)}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{
                    display: "block",
                    ...style,
                }}
                data-ad-client="ca-pub-7405468272628923"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
            />
        </div>
    );
}
