"use client";

import { useId } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({
  label,
  error,
  helpText,
  options,
  placeholder,
  className = "",
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 ${
          error ? "border-danger focus:border-danger focus:ring-danger/20" : "border-border"
        } ${className}`}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs text-secondary">{helpText}</p>
      )}
    </div>
  );
}
