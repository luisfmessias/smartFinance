"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Pencil } from "lucide-react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ScreenHeader } from "@/components/ui/screen-header";
import { categories } from "@/data/mock-data";
import { formatCurrency, sumExpenses } from "@/lib/format";
import { ModalSheet } from "@/components/ui/modal-sheet";
import type { CategoryKey, Expense, UserPreferences } from "@/types";

export function BudgetScreen({ expenses, preferences, onPreferencesChange }: { expenses: Expense[]; preferences: UserPreferences; onPreferencesChange: (preferences: UserPreferences) => void }) {
  const [editing, setEditing] = useState<CategoryKey | "monthly" | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const currentPeriod = new Date().toLocaleDateString("en-CA").slice(0, 7);
  const currentExpenses = expenses.filter((expense) => expense.date.startsWith(currentPeriod));
  const openEditor = (key: CategoryKey | "monthly", currentValue: number) => { setEditing(key); setValue(String(currentValue)); setError(""); };
  const save = () => {
    const parsed = Number(value.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed <= 0 || !editing) return setError("Informe um limite maior que zero.");
    onPreferencesChange(editing === "monthly" ? { ...preferences, monthlyBudget: parsed } : { ...preferences, categoryBudgets: { ...preferences.categoryBudgets, [editing]: parsed } });
    setEditing(null);
  };
  return (
    <div className="animate-in">
      <ScreenHeader title="Orçamento" subtitle="Defina limites para gastar com mais consciência." />
      <button onClick={() => openEditor("monthly", preferences.monthlyBudget)} className="mb-4 flex w-full items-center justify-between rounded-2xl bg-forest p-4 text-left text-white"><span><small className="text-[11px] text-white/60">Limite mensal geral</small><strong className="mt-1 block text-xl">{formatCurrency(preferences.monthlyBudget)}</strong></span><Pencil size={17} /></button>
      <div className="space-y-3">{categories.map((category) => {
        const spent = sumExpenses(currentExpenses.filter((expense) => expense.category === category.key));
        const budget = preferences.categoryBudgets[category.key];
        const percentage = Math.min(Math.round((spent / budget) * 100), 100);
        const attention = percentage > 80;
        return <button onClick={() => openEditor(category.key, budget)} key={category.key} className="w-full rounded-2xl bg-white p-4 text-left shadow-sm"><div className="flex items-center gap-3"><CategoryIcon category={category.key} /><div className="flex-1"><div className="flex items-center justify-between"><p className="text-sm font-bold">{category.name}</p>{attention ? <AlertTriangle size={16} className="text-amber-500" /> : <CheckCircle2 size={16} className="text-leaf" />}</div><p className="mt-1 text-[11px] text-slate-400">{formatCurrency(spent)} de {formatCurrency(budget)}</p></div></div><div className="mt-3 h-1.5 rounded-full bg-slate-100"><div className={`h-full rounded-full ${attention ? "bg-amber-400" : "bg-leaf"}`} style={{ width: `${percentage}%` }} /></div></button>;
      })}</div>
      <ModalSheet open={Boolean(editing)} onClose={() => setEditing(null)} title="Editar limite" subtitle="Defina um valor que faça sentido para sua rotina."><label className="block text-xs font-bold text-slate-600">Novo limite<div className="mt-2 flex items-center rounded-2xl border border-slate-200 px-4"><span className="text-sm font-bold text-leaf">R$</span><input autoFocus inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} className="w-full bg-transparent px-2 py-3.5 text-lg font-bold outline-none" /></div></label>{error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-500">{error}</p>}<button onClick={save} className="mt-4 w-full rounded-2xl bg-forest py-3.5 text-sm font-bold text-white">Salvar limite</button></ModalSheet>
    </div>
  );
}
