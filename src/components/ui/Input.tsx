import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full border-b border-charcoal/20 bg-transparent py-3 text-charcoal placeholder:text-charcoal/30 focus:border-burgundy focus:outline-none transition-colors duration-400",
          error && "border-error",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
