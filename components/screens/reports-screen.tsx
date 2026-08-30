"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, CalendarDays, Check } from "lucide-react";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { categories } from "@/data/mock-data";
import { formatCurrency, sumExpenses } from "@/lib/format";
import type { Expense } from "@/types";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

export function ReportsScreen({ expenses }: { expenses: Expense[] }) {
  const periods = useMemo(() => getPeriods(), []);
  const [period, setPeriod] = useState(periods[0].key);
  const [showPeriods, setShowPeriods] = useState(false);
  const filtered = expenses.filter((expense) => expense.date.startsWith(period));
  const total = sumExpenses(filtered);
  const previousTotal = sumExpenses(expenses.filter((expense) => expense.date.startsWith(getPreviousPeriod(period))));
  const change = previousTotal ? Math.round(((total - previousTotal) / previousTotal) * 100) : null;
  const buckets = getMonthBuckets(period);
  const bucketTotals = buckets.map((bucket) => sumExpenses(filtered.filter((expense) => {
    const day = Number(expense.date.slice(-2));
    return day >= bucket.start && day <= bucket.end;
  })));
  const highestBucket = Math.max(...bucketTotals, 1);

  return (
    <div className="animate-in">
      <ScreenHeader title="Relatórios" subtitle="Uma visão clara para decidir melhor." />
      <button onClick={() => setShowPeriods(true)} className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm"><span className="flex items-center gap-2 text-xs font-bold text-slate-600"><CalendarDays size={16} className="text-leaf" /> {getPeriodLabel(period)}</span><span className="text-xs font-bold text-leaf">Alterar</span></button>
      <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex justify-between"><div><p className="text-xs text-slate-400">Gastos no período</p><p className="mt-2 text-2xl font-bold">{formatCurrency(total)}</p></div>{change !== null && <span className={`flex h-fit items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${change <= 0 ? "bg-mint text-leaf" : "bg-red-50 text-red-500"}`}>{change <= 0 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{Math.abs(change)}%</span>}</div>
        {total ? <div className="mt-8 flex h-28 items-end justify-between gap-2">{bucketTotals.map((bucketTotal, index) => <div key={buckets[index].label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t-md bg-leaf/80" style={{ height: `${Math.max((bucketTotal / highestBucket) * 80, bucketTotal ? 8 : 2)}%` }} /><span className="text-[9px] text-slate-400">{buckets[index].label}</span></div>)}</div> : <p className="mt-8 rounded-2xl bg-slate-50 p-4 text-center text-xs leading-5 text-slate-500">Nenhum gasto registrado neste mês.</p>}
      </section>
      <h2 className="mb-3 mt-6 text-sm font-bold">Maiores categorias</h2>
      {total ? <div className="space-y-2">{categories.map((category) => { const spent = sumExpenses(filtered.filter((expense) => expense.category === category.key)); return spent ? <div key={category.key} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"><span className="flex items-center gap-2 text-xs font-bold"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.color }} />{category.name}</span><span className="text-sm font-bold">{formatCurrency(spent)}</span></div> : null; })}</div> : <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs text-slate-500">As categorias aparecerão quando você adicionar gastos.</p>}
      {change !== null && <div className={`mt-5 flex items-center gap-3 rounded-2xl p-4 ${change <= 0 ? "bg-mint text-forest" : "bg-red-50 text-red-600"}`}>{change <= 0 ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}<p className="text-xs leading-5"><b>{change <= 0 ? "Bom trabalho!" : "Atenção ao ritmo."}</b> Seus gastos {change <= 0 ? "diminuíram" : "aumentaram"} em relação ao mês passado.</p></div>}
      <ModalSheet open={showPeriods} onClose={() => setShowPeriods(false)} title="Selecionar período" subtitle="Escolha o mês que deseja analisar.">
        <div className="space-y-2">{periods.map((item) => <button key={item.key} onClick={() => { setPeriod(item.key); setShowPeriods(false); }} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-bold ${item.key === period ? "border-leaf bg-mint text-forest" : "border-slate-100"}`}>{item.label}{item.key === period && <Check size={17} className="text-leaf" />}</button>)}</div>
      </ModalSheet>
    </div>
  );
}

function getPeriods() {
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index, 1);
    return { key: date.toLocaleDateString("en-CA").slice(0, 7), label: monthFormatter.format(date) };
  });
}

function getPeriodLabel(period: string) {
  return monthFormatter.format(new Date(`${period}-01T12:00:00`));
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
