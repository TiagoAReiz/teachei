import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

function Badge({ className, variant = "default", size = "md", ...props }: BadgeProps) {
  const variants = {
    default: "bg-primary text-white shadow-lg shadow-primary/20 border-0",
    success: "bg-success text-white shadow-lg shadow-success/20 border-0",
    warning: "bg-warning text-white shadow-lg shadow-warning/20 border-0",
    error: "bg-error text-white shadow-lg shadow-error/20 border-0",
    info: "bg-info text-white shadow-lg shadow-info/20 border-0",
    outline: "bg-transparent border-2 border-foreground/10 text-foreground font-semibold",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold",
    md: "px-4 py-1.5 text-xs uppercase tracking-wider font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export { Badge };



