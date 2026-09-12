"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, Trash2, X } from "lucide-react";
import { categories } from "@/data/mock-data";
import { createExpense } from "@/services/expense-service";
import type { CategoryKey, Expense } from "@/types";

const today = () => new Date().toLocaleDateString("en-CA");

export function AddExpenseSheet({ open, expense, onClose, onSave, onDelete }: { open: boolean; expense?: Expense | null; onClose: () => void; onSave: (expense: Expense) => void; onDelete: (expenseId: string) => void }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryKey>("food");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(expense?.title ?? "");
    setAmount(expense ? String(expense.amount).replace(".", ",") : "");
    setCategory(expense?.category ?? "food");
    setDate(expense?.date ?? today());
    setError("");
  }, [expense, open]);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = Number(amount.replace(",", "."));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return setError("Informe um valor maior que zero.");
    const updatedExpense = { id: expense?.id ?? crypto.randomUUID(), title: title.trim(), amount: parsedAmount, category, date };
    onSave(await createExpense(updatedExpense));
    setTitle("");
    setAmount("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm">
      <section className="animate-in w-full max-w-md rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
        <header className="flex items-center justify-between">
          <div><h2 className="text-xl font-bold">{expense ? "Editar gasto" : "Novo gasto"}</h2><p className="mt-1 text-xs text-slate-500">{expense ? "Atualize ou remova este lançamento." : "Registre em poucos segundos."}</p></div>
          <button onClick={onClose} className="rounded-full bg-slate-50 p-2" aria-label="Fechar"><X size={18} /></button>
        </header>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block"><FieldLabel>Descrição</FieldLabel><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: almoço, mercado..." className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-sm outline-none focus:border-leaf" /></label>
          <label className="block"><FieldLabel>Valor</FieldLabel><div className="flex items-center rounded-2xl border border-slate-200 px-4 focus-within:border-leaf"><span className="text-sm font-bold text-leaf">R$</span><input required inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" className="w-full bg-transparent px-2 py-3.5 text-lg font-bold outline-none" /></div></label>
          <div className="grid grid-cols-2 gap-3">
            <label><FieldLabel>Categoria</FieldLabel><div className="relative"><select value={category} onChange={(event) => setCategory(event.target.value as CategoryKey)} className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold outline-none">{categories.map((item) => <option value={item.key} key={item.key}>{item.name}</option>)}</select><ChevronDown size={14} className="pointer-events-none absolute right-3 top-3.5" /></div></label>
            <label><FieldLabel>Data</FieldLabel><div className="relative"><input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-xs font-bold outline-none" /><CalendarDays size={14} className="pointer-events-none absolute right-3 top-3.5 bg-white text-slate-400" /></div></label>
          </div>
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-xs font-bold text-red-500">{error}</p>}
          <button className="w-full rounded-2xl bg-forest px-5 py-4 text-sm font-bold text-white">{expense ? "Salvar alterações" : "Salvar gasto"}</button>
          {expense && <button type="button" onClick={() => { if (confirm("Deseja excluir este gasto?")) onDelete(expense.id); }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm font-bold text-red-500"><Trash2 size={16} /> Excluir gasto</button>}
        </form>
      </section>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-xs font-bold text-slate-600">{children}</span>;
}
