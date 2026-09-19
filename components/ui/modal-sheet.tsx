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

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  if (!open) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm">
      <section onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title} className="animate-in max-h-[82vh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">{title}</h2>
            {subtitle && <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>}
          </div>
          <button ref={closeButton} onClick={onClose} className="rounded-full bg-slate-50 p-2" aria-label="Fechar">
            <X size={18} />
          </button>
        </header>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
