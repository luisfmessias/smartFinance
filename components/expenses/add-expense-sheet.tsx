"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { CategoryPicker } from "@/components/expenses/category-picker";
import { DateField } from "@/components/ui/date-field";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { MoneyInput } from "@/components/ui/money-input";
import { parseAmount, toAmountInput, toLocalDate } from "@/lib/format";
import { errorMessage } from "@/services/api-client";
import type { CategoryKey, Expense, ExpenseInput } from "@/types";

export function AddExpenseSheet({ open, expense, defaultCategory, onClose, onSave, onDelete }: { open: boolean; expense?: Expense | null; defaultCategory: CategoryKey; onClose: () => void; onSave: (expense: ExpenseInput) => Promise<void>; onDelete: (expenseId: string) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<CategoryKey>(defaultCategory);
  const [date, setDate] = useState(() => toLocalDate());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(expense?.title ?? "");
    setAmount(expense ? toAmountInput(expense.amount) : "");
    setCategory(expense?.category ?? defaultCategory);
    setDate(expense?.date ?? toLocalDate());
    setError("");
  }, [expense, open, defaultCategory]);

  const run = async (action: () => Promise<void>) => {
    setError("");
    setSubmitting(true);
    try {
      await action();
    } catch (actionError) {
      setError(errorMessage(actionError));
    } finally {
      setSubmitting(false);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsedAmount = parseAmount(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) return setError("Informe um valor maior que zero.");
    await run(() => onSave({ title: title.trim(), amount: parsedAmount, category, date, note: expense?.note }));
  };

  const remove = async () => {
    if (expense && confirm("Deseja excluir este gasto?")) await run(() => onDelete(expense.id));
  };

  return (
    <ModalSheet open={open} onClose={onClose} title={expense ? "Editar gasto" : "Novo gasto"} subtitle={expense ? "Atualize ou remova este lançamento." : "Registre em poucos segundos."}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="block">
          <span className="label">Valor</span>
          <MoneyInput value={amount} onChange={setAmount} />
        </label>
        <label className="block">
          <span className="label">Descrição</span>
          <input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: almoço, mercado..." className="field" />
        </label>
        <CategoryPicker value={category} onChange={setCategory} />
        <DateField label="Data" value={date} onChange={setDate} />
        {error && <p role="alert" className="alert-error">{error}</p>}
        <button disabled={submitting} className="btn-primary mt-1">{expense ? "Salvar alterações" : "Salvar gasto"}</button>
        {expense && (
          <button type="button" disabled={submitting} onClick={() => void remove()} className="flex items-center justify-center gap-2 py-1.5 text-sm font-medium text-coral disabled:opacity-60">
            <Trash2 size={16} /> Excluir gasto
          </button>
        )}
      </form>
    </ModalSheet>
  );
}
