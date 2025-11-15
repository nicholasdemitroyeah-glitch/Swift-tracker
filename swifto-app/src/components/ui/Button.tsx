"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-500 text-white shadow-orange hover:bg-brand-400 focus-visible:ring-2 focus-visible:ring-brand-300",
  secondary:
    "bg-surface text-white hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-500",
  ghost: "bg-transparent text-white hover:bg-white/10",
  danger:
    "bg-red-500 text-white hover:bg-red-400 focus-visible:ring-2 focus-visible:ring-red-300",
  outline:
    "border border-white/20 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-500",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export const Button = ({
  className,
  variant = "primary",
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-150 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-60",
        variantStyles[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
};
