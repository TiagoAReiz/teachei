import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
  rounded?: boolean;
}

const imageSizes = {
  xs: { width: 60, height: 24 },
  sm: { width: 80, height: 32 },
  md: { width: 100, height: 40 },
  lg: { width: 140, height: 56 },
  xl: { width: 180, height: 72 },
};

function LogoContent({ size, className, rounded }: { size: "xs" | "sm" | "md" | "lg" | "xl"; className?: string; rounded?: boolean }) {
  const { width, height } = imageSizes[size];
  
  return (
    <div className={cn(
      "flex items-center overflow-hidden",
      rounded && "rounded-full bg-white/90 px-3 py-1",
      className
    )}>
      <Image
        src="/logo.png"
        alt="TeAchei"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}

function Logo({ size = "md", className, href = "/", rounded = false }: LogoProps) {
  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        <LogoContent size={size} className={className} rounded={rounded} />
      </Link>
    );
  }

  return <LogoContent size={size} className={className} rounded={rounded} />;
}

export { Logo };
