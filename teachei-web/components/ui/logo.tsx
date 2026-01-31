import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

const imageSizes = {
  xs: { width: 60, height: 24 },
  sm: { width: 80, height: 32 },
  md: { width: 100, height: 40 },
  lg: { width: 140, height: 56 },
  xl: { width: 180, height: 72 },
};

const containerPadding = {
  xs: "px-2 py-1",
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-5 py-2.5",
  xl: "px-6 py-3",
};

function LogoContent({ size, className }: { size: "xs" | "sm" | "md" | "lg" | "xl"; className?: string }) {
  const { width, height } = imageSizes[size];
  
  return (
    <div className={cn(
      "flex items-center bg-white rounded-2xl shadow-sm",
      containerPadding[size],
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

function Logo({ size = "md", className, href = "/" }: LogoProps) {
  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        <LogoContent size={size} className={className} />
      </Link>
    );
  }

  return <LogoContent size={size} className={className} />;
}

export { Logo };
