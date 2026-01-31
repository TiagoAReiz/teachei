import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

const textSizes = {
  xs: "text-lg",
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

const containerPadding = {
  xs: "px-1 py-0.5",
  sm: "px-1.5 py-0.5",
  md: "px-2 py-1",
  lg: "px-2.5 py-1.5",
  xl: "px-3 py-2",
};

function LogoContent({ size, className }: { size: "xs" | "sm" | "md" | "lg" | "xl"; className?: string }) {
  return (
    <div className={cn(
      "flex items-center select-none",
      containerPadding[size],
      className
    )}>
      <span 
        className={cn(
          "font-extrabold tracking-tight",
          textSizes[size]
        )}
        style={{ 
          fontStyle: "italic",
          transform: "skewX(-2deg)",
        }}
      >
        {/* "te" em azul claro */}
        <span 
          className="transition-colors"
          style={{ color: "#3b9eff" }}
        >
          te
        </span>
        {/* "achei" em azul escuro/navy */}
        <span 
          className="transition-colors"
          style={{ color: "#1a365d" }}
        >
          achei
        </span>
      </span>
    </div>
  );
}

function Logo({ size = "md", className, href = "/" }: LogoProps) {
  if (href) {
    return (
      <Link 
        href={href} 
        className="hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
      >
        <LogoContent size={size} className={className} />
      </Link>
    );
  }

  return <LogoContent size={size} className={className} />;
}

export { Logo };
