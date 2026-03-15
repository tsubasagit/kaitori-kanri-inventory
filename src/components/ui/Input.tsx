"use client";

import { useId } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helpText?: string;
};

export function Input({
  label,
  error,
  helpText,
  className = "",
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-foreground placeholder:text-secondary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 ${
          error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
        } ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs text-secondary">{helpText}</p>
      )}
    </div>
  );
}
