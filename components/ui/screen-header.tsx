import { ChevronLeft } from "lucide-react";

export function ScreenHeader({ title, subtitle, onBack }: { title: string; subtitle?: string; onBack?: () => void }) {
  return (
    <header className="mb-6 flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="rounded-full bg-white p-2 shadow-sm" aria-label="Voltar">
          <ChevronLeft size={20} />
        </button>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </header>
  );
}
