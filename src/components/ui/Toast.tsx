"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap: Record<ToastType, ReactNode> = {
  success: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.194-.833-2.964 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
};

const typeClasses: Record<ToastType, string> = {
  success: "border-success bg-success/10 text-success",
  error: "border-danger bg-danger/10 text-danger",
  info: "border-primary bg-primary/10 text-primary",
  warning: "border-warning bg-warning/10 text-warning",
};

let idCounter = 0;

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-md transition-all ${typeClasses[toast.type]}`}
      role="alert"
    >
      <span className="shrink-0">{iconMap[toast.type]}</span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-auto shrink-0 rounded p-0.5 opacity-60 transition-opacity hover:opacity-100"
        aria-label="閉じる"
        type="button"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${++idCounter}`;
    setToasts((prev) => {
      const next = [...prev, { id, type, message }];
      return next.length > 5 ? next.slice(-5) : next;
    });
  }, []);

  const contextValue: ToastContextValue = {
    success: useCallback((msg: string) => addToast("success", msg), [addToast]),
    error: useCallback((msg: string) => addToast("error", msg), [addToast]),
    info: useCallback((msg: string) => addToast("info", msg), [addToast]),
    warning: useCallback((msg: string) => addToast("warning", msg), [addToast]),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted &&
        createPortal(
          <div className="fixed right-4 top-4 z-[100] flex w-80 flex-col gap-2">
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
