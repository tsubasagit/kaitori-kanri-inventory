"use client";

import { useId } from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helpText?: string;
};

export function Textarea({
  label,
  error,
  helpText,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-foreground placeholder:text-secondary transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 ${
          error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
        } ${className}`}
        aria-invalid={error ? true : undefined}
        rows={3}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs text-secondary">{helpText}</p>
      )}
    </div>
  );
}
