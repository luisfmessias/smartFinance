"use client";

import { useState } from "react";
import { AlertTriangle, Pencil } from "lucide-react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { Money } from "@/components/ui/money";
import { MoneyInput } from "@/components/ui/money-input";
import { getProgressTone, Progress } from "@/components/ui/progress";
import { ScreenHeader } from "@/components/ui/screen-header";
import { categories } from "@/data/categories";
import { currentPeriod, formatCurrency, parseAmount, sumExpenses, toAmountInput } from "@/lib/format";
import type { CategoryKey, Expense, UserPreferences } from "@/types";

export function BudgetScreen({ expenses, preferences, onPreferencesChange }: { expenses: Expense[]; preferences: UserPreferences; onPreferencesChange: (preferences: UserPreferences) => void }) {
  const [editing, setEditing] = useState<CategoryKey | "monthly" | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const period = currentPeriod();
  const currentExpenses = expenses.filter((expense) => expense.date.startsWith(period));
  const total = sumExpenses(currentExpenses);
  const monthlyRatio = total / preferences.monthlyBudget;

  const openEditor = (key: CategoryKey | "monthly", currentValue: number) => {
    setEditing(key);
    setValue(toAmountInput(currentValue));
    setError("");
  };

  const save = () => {
    const parsed = parseAmount(value);
    if (!Number.isFinite(parsed) || parsed <= 0 || !editing) return setError("Informe um limite maior que zero.");
    onPreferencesChange(editing === "monthly" ? { ...preferences, monthlyBudget: parsed } : { ...preferences, categoryBudgets: { ...preferences.categoryBudgets, [editing]: parsed } });
    setEditing(null);
  };

  return (
    <div className="animate-in">
      <ScreenHeader title="Orçamento" subtitle="Toque em um limite para ajustar." />
      <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-5">
        <button onClick={() => openEditor("monthly", preferences.monthlyBudget)} className="glass rounded-[28px] p-5 text-left">
          <span className="flex items-center justify-between text-sm text-sage">Limite mensal geral <Pencil size={15} /></span>
          <Money value={preferences.monthlyBudget} className="mt-1 block text-3xl leading-tight" />
          <span className="mt-5 block"><Progress ratio={monthlyRatio} tone={getProgressTone(monthlyRatio, preferences.alertThreshold)} /></span>
          <span className="mt-2.5 block text-sm text-sage"><span className="sensitive">{formatCurrency(total)}</span> usados neste mês</span>
        </button>

        <section className="glass rounded-[28px] p-3">
          <ul className="divide-y divide-white/10">
            {categories.map((category) => {
              const spent = sumExpenses(currentExpenses.filter((expense) => expense.category === category.key));
              const budget = preferences.categoryBudgets[category.key];
              const ratio = spent / budget;
              const tone = getProgressTone(ratio, preferences.alertThreshold);
              return (
                <li key={category.key}>
                  <button onClick={() => openEditor(category.key, budget)} className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-white/5">
                    <CategoryIcon category={category.key} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate font-medium">{category.name}</span>
                        <span className="sensitive shrink-0 text-sm text-sage">{formatCurrency(spent)} de {formatCurrency(budget)}</span>
                      </span>
                      <span className="mt-2 block"><Progress ratio={ratio} tone={tone} /></span>
                      {tone !== "normal" && (
                        <span className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${tone === "over" ? "text-coral" : "text-amber"}`}>
                          <AlertTriangle size={13} /> {tone === "over" ? "Acima do limite" : "Perto do limite"}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <ModalSheet open={Boolean(editing)} onClose={() => setEditing(null)} title="Editar limite" subtitle={editing === "monthly" ? "Quanto você quer gastar por mês." : categories.find((item) => item.key === editing)?.name}>
        <label className="block">
          <span className="label">Novo limite</span>
          <MoneyInput autoFocus value={value} onChange={setValue} />
        </label>
        {error && <p role="alert" className="alert-error mt-3">{error}</p>}
        <button onClick={save} className="btn-primary mt-4">Salvar limite</button>
      </ModalSheet>
    </div>
  );
}
