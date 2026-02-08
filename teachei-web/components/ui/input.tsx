"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, iconPosition = "left", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            type={inputType}
            ref={ref}
            className={cn(
              "w-full bg-background/50 border-2 border-transparent focus:border-primary/20 ring-0 text-foreground placeholder:text-muted rounded-full h-[56px] px-6 focus:bg-white focus:shadow-lg focus:shadow-primary/5 transition-all duration-300 text-base font-medium",
              icon && iconPosition === "left" && "pl-14",
              (icon && iconPosition === "right") || isPassword ? "pr-14" : "",
              error && "border-error/50 focus:border-error bg-error/5",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-muted hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {icon && iconPosition === "right" && !isPassword && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };



