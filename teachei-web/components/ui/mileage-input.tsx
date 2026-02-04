"use client";

import { forwardRef, useState, useEffect, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface MileageInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  label?: string;
  error?: string;
  value: number | null;
  onChange: (value: number | null) => void;
}

/**
 * Format a number with thousand separators (Brazilian locale)
 * e.g., 50000 -> "50.000"
 */
function formatMileageValue(value: number | null): string {
  if (value === null || value === 0) return "";
  return value.toLocaleString("pt-BR");
}

const MileageInput = forwardRef<HTMLInputElement, MileageInputProps>(
  ({ className, label, error, value, onChange, placeholder = "0", ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => formatMileageValue(value));

    // Sync display value when external value changes
    useEffect(() => {
      setDisplayValue(formatMileageValue(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      
      // Allow only digits
      const digitsOnly = input.replace(/\D/g, "");
      
      if (!digitsOnly) {
        setDisplayValue("");
        onChange(null);
        return;
      }
      
      // Convert to number
      const numericValue = parseInt(digitsOnly, 10);
      
      // Format for display with thousand separators
      const formatted = numericValue.toLocaleString("pt-BR");
      
      setDisplayValue(formatted);
      onChange(numericValue);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            type="text"
            inputMode="numeric"
            ref={ref}
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={cn(
              "w-full bg-surface border-0 ring-1 ring-border text-foreground placeholder:text-muted rounded-full h-[52px] px-4 pr-12 focus:ring-2 focus:ring-primary focus:bg-surface transition-all text-base",
              error && "ring-error focus:ring-error",
              className
            )}
            {...props}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-muted group-focus-within:text-primary transition-colors">
            <span className="text-sm font-medium">km</span>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

MileageInput.displayName = "MileageInput";

export { MileageInput };
