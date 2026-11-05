"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { CategoryBreakdown } from "@/components/expenses/category-breakdown";
import { Money } from "@/components/ui/money";
import { ScreenHeader } from "@/components/ui/screen-header";
import { capitalize, formatCurrency, sumExpenses } from "@/lib/format";
import { errorMessage } from "@/services/api-client";
import type { Expense, UserAccount, UserPreferences } from "@/types";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

export function ReportsScreen({ account, expenses, preferences }: { account: UserAccount; expenses: Expense[]; preferences: UserPreferences }) {
  const periods = useMemo(() => getPeriods(), []);
  const [periodIndex, setPeriodIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const { key: period, label: periodLabel } = periods[periodIndex];
  const filtered = expenses.filter((expense) => expense.date.startsWith(period));
  const total = sumExpenses(filtered);
  const previousTotal = sumExpenses(expenses.filter((expense) => expense.date.startsWith(getPreviousPeriod(period))));
  const change = previousTotal ? Math.round(((total - previousTotal) / previousTotal) * 100) : null;
  const buckets = getMonthBuckets(period).map((bucket) => ({
    ...bucket,
    total: sumExpenses(filtered.filter((expense) => {
      const day = Number(expense.date.slice(-2));
      return day >= bucket.start && day <= bucket.end;
    })),
  }));
  const highest = Math.max(...buckets.map((bucket) => bucket.total));
  const active = hovered ?? buckets.findIndex((bucket) => bucket.total === highest);
  const activeBucket = buckets[active];

  const changePeriod = (index: number) => {
    setPeriodIndex(index);
    setHovered(null);
    setExportError("");
  };

  const exportPdf = async () => {
    setExporting(true);
    setExportError("");
    try {
      const { downloadReportPdf } = await import("@/lib/report-pdf");
      await downloadReportPdf({ account, period, periodLabel, expenses: filtered, previousTotal, preferences });
    } catch (error) {
      setExportError(errorMessage(error));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="animate-in">
      <ScreenHeader title="Relatórios" subtitle="Compare seus meses." />

      <div className="mb-4 flex gap-2 lg:mb-5 lg:max-w-md">
        <div className="glass flex min-w-0 flex-1 items-center justify-between rounded-full p-1">
          <button onClick={() => changePeriod(periodIndex + 1)} disabled={periodIndex === periods.length - 1} aria-label="Mês anterior" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full disabled:opacity-30"><ChevronLeft size={18} /></button>
          <span className="truncate text-sm font-medium">{capitalize(periodLabel)}</span>
          <button onClick={() => changePeriod(periodIndex - 1)} disabled={periodIndex === 0} aria-label="Próximo mês" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full disabled:opacity-30"><ChevronRight size={18} /></button>
        </div>
        <button onClick={() => void exportPdf()} disabled={!total || exporting} aria-label="Baixar relatório em PDF" className="glass flex shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium disabled:opacity-50">
          <FileDown size={17} strokeWidth={1.8} /> {exporting ? "Gerando" : "PDF"}
        </button>
      </div>
      {exportError && <p role="alert" className="alert-error mb-4">{exportError}</p>}

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-5">
        <section className="glass rounded-[28px] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-sage">Total do mês</p>
              <Money value={total} className="mt-1 block text-3xl leading-tight" />
            </div>
            {change !== null && (
              <span className={`well mt-1 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium ${change > 0 ? "text-coral" : "text-lime"}`}>
                {change > 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}{Math.abs(change)}%
              </span>
            )}
          </div>
          {change !== null && <p className="mt-1 text-sm text-sage">{change > 0 ? "A mais" : "A menos"} que no mês anterior</p>}

          {total ? (
            <div className="mt-6">
              <p className="text-sm text-sage">Dias {activeBucket.start} a {activeBucket.end}: <span className="sensitive font-medium text-mist">{formatCurrency(activeBucket.total)}</span></p>
              <div className="mt-3 flex h-36 items-end gap-1.5 border-b border-white/15" onMouseLeave={() => setHovered(null)}>
                {buckets.map((bucket, index) => (
                  <button
                    key={bucket.label}
                    onMouseEnter={() => setHovered(index)}
                    onFocus={() => setHovered(index)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setHovered(index)}
                    aria-label={`Dias ${bucket.start} a ${bucket.end}: ${formatCurrency(bucket.total)}`}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <span className={`block w-full max-w-7 rounded-t-[4px] transition-colors ${index === active ? "bg-lime" : "bg-lime/35"}`} style={{ height: bucket.total ? `max(${(bucket.total / highest) * 100}%, 4px)` : 0 }} />
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-1.5">{buckets.map((bucket) => <span key={bucket.label} className="flex-1 text-center text-xs text-sage">{bucket.start}</span>)}</div>
            </div>
          ) : <p className="well mt-6 rounded-2xl p-4 text-center text-sm text-sage">Nenhum gasto registrado neste mês.</p>}
        </section>

        {total > 0 && (
          <section className="glass rounded-[28px] p-5">
            <h2 className="mb-4 font-semibold tracking-tight">Maiores categorias</h2>
            <CategoryBreakdown expenses={filtered} hideEmpty />
          </section>
        )}
      </div>
    </div>
  );
}

function getPeriods() {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index, 1);
    return { key: date.toLocaleDateString("en-CA").slice(0, 7), label: monthFormatter.format(date) };
  });
}

function getPreviousPeriod(period: string) {
  const date = new Date(`${period}-01T12:00:00`);
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleDateString("en-CA").slice(0, 7);
}

function getMonthBuckets(period: string) {
  const [year, month] = period.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return Array.from({ length: Math.ceil(lastDay / 5) }, (_, index) => {
    const start = index * 5 + 1;
    const end = Math.min(start + 4, lastDay);
    return { start, end, label: `${start}-${end}` };
  });
}
