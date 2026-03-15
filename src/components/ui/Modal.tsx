"use client";

import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`relative w-full max-w-lg rounded-lg border border-border bg-white shadow-xl ${className}`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          {title && (
            <h2 className="text-lg font-medium text-foreground">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-secondary transition-colors hover:bg-muted hover:text-foreground"
            aria-label="閉じる"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
