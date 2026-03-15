"use client";

import { Spinner } from "./Spinner";

const variantClasses = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus:ring-primary/50",
  secondary:
    "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50",
  outline:
    "border border-border bg-white text-foreground hover:bg-muted focus:ring-primary/50",
  danger:
    "bg-danger text-white hover:bg-danger/90 focus:ring-danger/50",
  ghost:
    "bg-transparent text-foreground hover:bg-muted focus:ring-primary/50",
} as const;

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

type ButtonVariant = keyof typeof variantClasses;
type ButtonSize = keyof typeof sizeClasses;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : icon ? (
        <span className={iconSizeClasses[size]}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
