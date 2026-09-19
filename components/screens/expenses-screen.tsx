"use client";

import { useState } from "react";
import { Check, Search, SlidersHorizontal } from "lucide-react";
import { ExpenseRow } from "@/components/expenses/expense-row";
import { ScreenHeader } from "@/components/ui/screen-header";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { categories } from "@/data/mock-data";
import { formatCurrency, sumExpenses } from "@/lib/format";
import type { CategoryKey, Expense } from "@/types";

export function ExpensesScreen({ expenses, onEditExpense, onAddExpense }: { expenses: Expense[]; onEditExpense: (expense: Expense) => void; onAddExpense: () => void }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryKey | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const filtered = expenses.filter((expense) => expense.title.toLowerCase().includes(search.toLowerCase()) && (category === "all" || expense.category === category));
  return (
    <div className="animate-in">
      <ScreenHeader title="Meus gastos" subtitle={`${expenses.length} lançamentos registrados`} />
      <div className="rounded-3xl bg-forest p-5 text-white"><p className="text-xs text-white/60">Total no período</p><p className="mt-2 text-2xl font-bold">{formatCurrency(sumExpenses(filtered))}</p></div>
      <div className="mt-5 flex gap-2"><label className="flex flex-1 items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm"><Search size={17} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar gasto" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label><button onClick={() => setShowFilters(true)} className={`rounded-2xl p-3 shadow-sm ${category === "all" ? "bg-white" : "bg-mint text-leaf"}`} aria-label="Filtrar gastos"><SlidersHorizontal size={18} /></button></div>
      {filtered.length ? <div className="mt-5 space-y-2">{filtered.map((expense) => <ExpenseRow key={expense.id} expense={expense} onClick={() => onEditExpense(expense)} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-center"><p className="text-sm font-bold">{expenses.length ? "Nenhum gasto encontrado" : "Você ainda não registrou gastos"}</p><p className="mt-2 text-xs leading-5 text-slate-500">{expenses.length ? "Tente ajustar a busca ou remover os filtros." : "Adicione seu primeiro lançamento para começar."}</p>{!expenses.length && <button onClick={onAddExpense} className="mt-4 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white">Adicionar gasto</button>}</div>}
      <ModalSheet open={showFilters} onClose={() => setShowFilters(false)} title="Filtrar gastos" subtitle="Mostre apenas os gastos de uma categoria.">
        <div className="space-y-2"><FilterOption label="Todas as categorias" active={category === "all"} onClick={() => { setCategory("all"); setShowFilters(false); }} />{categories.map((item) => <FilterOption key={item.key} label={item.name} active={category === item.key} onClick={() => { setCategory(item.key); setShowFilters(false); }} />)}</div>
      </ModalSheet>
    </div>
  );
}

function FilterOption({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold ${active ? "border-leaf bg-mint text-forest" : "border-slate-100"}`}>{label}{active && <Check size={16} className="text-leaf" />}</button>;
}
