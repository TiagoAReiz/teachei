import Image from "next/image";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  fotoUrl?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallback?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

function Avatar({ src, fotoUrl, alt, size = "md", className, fallback }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
  };

  // Get initials from fallback text
  const getInitials = (text: string) => {
    return text
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Priority: fotoUrl (Blob Storage) > src (external URL like Google avatar)
  const imageSrc = fotoUrl || src;

  if (imageSrc) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden bg-muted/20 flex-shrink-0",
          sizes[size],
          className
        )}
      >
        <Image
          src={imageSrc}
          alt={alt || "Avatar"}
          width={sizeMap[size]}
          height={sizeMap[size]}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0 font-semibold text-primary",
        sizes[size],
        className
      )}
    >
      {fallback ? (
        getInitials(fallback)
      ) : (
        <User size={iconSizes[size]} />
      )}
    </div>
  );
}

export { Avatar };



