import { CategoryIcon } from "@/components/ui/category-icon";
import { categories } from "@/data/mock-data";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { Expense } from "@/types";

export function ExpenseRow({ expense, onClick }: { expense: Expense; onClick?: () => void }) {
  const category = categories.find((item) => item.key === expense.category)!;
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm">
      <CategoryIcon category={expense.category} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-ink">{expense.title}</p>
        <p className="mt-1 text-[11px] text-slate-400">{category.name} · {formatShortDate(expense.date)}</p>
      </div>
      <span className="text-sm font-bold text-ink">-{formatCurrency(expense.amount)}</span>
    </button>
  );
}
