"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function ModalSheet({
  open,
  title,
  subtitle,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const latestOnClose = useRef(onClose);
  latestOnClose.current = onClose;

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") latestOnClose.current(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (!open) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-end justify-center bg-[#0b1f19]/55 sm:items-center sm:p-6">
      <section
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-strong animate-sheet flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[32px] pt-3 sm:rounded-[32px] sm:pt-6"
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-white/25 sm:hidden" />
        <header className="flex items-start justify-between gap-4 px-5">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-sm leading-5 text-sage">{subtitle}</p>}
          </div>
          <button ref={closeButton} onClick={onClose} className="well flex h-9 w-9 shrink-0 items-center justify-center rounded-full" aria-label="Fechar">
            <X size={17} />
          </button>
        </header>
        <div className="mt-5 overflow-y-auto overflow-x-hidden px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6">{children}</div>
      </section>
    </div>
  );
}
