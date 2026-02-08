import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

const textSizes = {
  xs: "text-xl",
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl",
  xl: "text-5xl",
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
          "font-black tracking-tight lowercase",
          textSizes[size]
        )}
        style={{ 
          fontFamily: "var(--font-display), 'Poppins', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        {/* "te" em roxo/azul */}
        <span 
          className="relative"
          style={{ 
            color: "#6763ff",
          }}
        >
          te
        </span>
        {/* "achei" em azul escuro */}
        <span 
          className="relative"
          style={{ 
            color: "#292179",
          }}
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
        className="hover:opacity-85 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
      >
        <LogoContent size={size} className={className} />
      </Link>
    );
  }

  return <LogoContent size={size} className={className} />;
}

export { Logo };
