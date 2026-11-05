"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ExpenseRow } from "@/components/expenses/expense-row";
import { EmptyState } from "@/components/ui/empty-state";
import { Money } from "@/components/ui/money";
import { ScreenHeader } from "@/components/ui/screen-header";
import { categories } from "@/data/categories";
import { formatDayLabel, sumExpenses } from "@/lib/format";
import type { CategoryKey, Expense } from "@/types";

function groupByDay(expenses: Expense[]) {
  const groups = new Map<string, Expense[]>();
  for (const expense of expenses) groups.set(expense.date, [...(groups.get(expense.date) ?? []), expense]);
  return [...groups];
}

export function ExpensesScreen({ expenses, compact, onEditExpense, onAddExpense }: { expenses: Expense[]; compact: boolean; onEditExpense: (expense: Expense) => void; onAddExpense: () => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryKey | "all">("all");
  const filtered = expenses.filter((expense) => expense.title.toLowerCase().includes(search.toLowerCase()) && (category === "all" || expense.category === category));
  const filtering = Boolean(search) || category !== "all";

  return (
    <div className="animate-in">
      <ScreenHeader title="Meus gastos" subtitle={`${expenses.length} ${expenses.length === 1 ? "lançamento" : "lançamentos"}`} />

      <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-start lg:gap-5">
        <div className="flex min-w-0 flex-col gap-3 lg:col-start-1 lg:row-start-1">
          <label className="glass flex items-center gap-3 rounded-full px-4 py-3">
            <Search size={18} strokeWidth={1.8} className="shrink-0 text-sage" />
            <input aria-label="Buscar gasto" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar gasto" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-sage" />
          </label>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
            <Filter label="Todos" active={category === "all"} onClick={() => setCategory("all")} />
            {categories.map((item) => <Filter key={item.key} label={item.name} active={category === item.key} onClick={() => setCategory(item.key)} />)}
          </div>
        </div>

        <section className="glass rounded-[28px] p-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <p className="text-sm text-sage">{filtering ? "Total filtrado" : "Total registrado"}</p>
          <Money value={sumExpenses(filtered)} className="mt-1 block text-3xl leading-tight" />
        </section>

        <section className="glass min-w-0 rounded-[28px] p-3 lg:col-start-1">
          {filtered.length ? (
            <div className="flex flex-col gap-3">
              {groupByDay(filtered).map(([date, items]) => (
                <div key={date}>
                  <h2 className="px-2 pb-1 pt-1 text-sm text-sage">{formatDayLabel(date)}</h2>
                  <div className="divide-y divide-white/10">{items.map((expense) => <ExpenseRow key={expense.id} expense={expense} compact={compact} hideDate onClick={() => onEditExpense(expense)} />)}</div>
                </div>
              ))}
            </div>
          ) : expenses.length
            ? <EmptyState title="Nenhum gasto encontrado" text="Tente outra busca ou remova o filtro." />
            : <EmptyState title="Você ainda não registrou gastos" text="Adicione seu primeiro lançamento para começar." action="Adicionar gasto" onClick={onAddExpense} />}
        </section>
      </div>
    </div>
  );
}

function Filter({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} aria-pressed={active} className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${active ? "bg-lime text-pine" : "glass"}`}>{label}</button>;
}
