import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "vertical" | "icon";
  className?: string;
  href?: string;
}

const heightClasses = {
  xs: "h-8",
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
  xl: "h-24",
};

function LogoContent({ 
  size = "md", 
  variant, 
  className 
}: { 
  size: LogoProps["size"], 
  variant?: LogoProps["variant"], 
  className?: string 
}) {
  // Determine variant based on size if not provided
  // xs -> icon (mobile header usually)
  // others -> horizontal by default
  const effectiveVariant = variant || (size === "xs" ? "icon" : "horizontal");
  
  const src = {
    horizontal: "/logo-full.png",
    vertical: "/logo-vertical.png",
    icon: "/logo-icon.png",
  }[effectiveVariant];

  return (
    <div className={cn(
      "relative select-none",
      heightClasses[size || "md"],
      className
    )}>
      <Image
        src={src}
        alt="TeAchei Logo"
        width={0}
        height={0}
        sizes="100vw"
        className="h-full w-auto object-contain"
        priority
      />
    </div>
  );
}

function Logo({ size = "md", variant, className, href = "/" }: LogoProps) {
  if (href) {
    return (
      <Link 
        href={href} 
        className={cn(
          "hover:opacity-90 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg block",
          // Add some padding/hover effect container if needed, but keeping it simple for image logos
        )}
      >
        <LogoContent size={size} variant={variant} className={className} />
      </Link>
    );
  }

  return <LogoContent size={size} variant={variant} className={className} />;
}

export { Logo };
