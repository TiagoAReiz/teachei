"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "whatsapp";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:-translate-y-0.5";
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:shadow-xl",
      secondary: "bg-white text-primary border-2 border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md",
      outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
      ghost: "text-muted-foreground hover:text-primary hover:bg-primary/5",
      danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg shadow-error/30 hover:shadow-error/50",
      whatsapp: "bg-gradient-to-r from-whatsapp to-green-600 text-white shadow-lg shadow-whatsapp/30 hover:shadow-whatsapp/50",
    };
    
    const sizes = {
      sm: "h-10 px-4 text-xs uppercase tracking-wide rounded-full",
      md: "h-12 px-6 text-sm uppercase tracking-wide rounded-full",
      lg: "h-14 px-8 text-base uppercase tracking-wide rounded-full",
      icon: "h-12 w-12 rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };



