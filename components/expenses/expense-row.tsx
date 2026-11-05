import { CategoryIcon } from "@/components/ui/category-icon";
import { categories } from "@/data/categories";
import { formatCurrency, formatShortDate } from "@/lib/format";
import type { Expense } from "@/types";

export function ExpenseRow({ expense, onClick, compact = false, hideDate = false }: { expense: Expense; onClick?: () => void; compact?: boolean; hideDate?: boolean }) {
  const category = categories.find((item) => item.key === expense.category)!;
  return (
    <div>
      <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-2xl px-2 text-left transition-colors hover:bg-white/5 ${compact ? "py-1.5" : "py-2.5"}`}>
        <CategoryIcon category={expense.category} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{expense.title}</p>
          <p className="text-sm text-sage">{hideDate ? category.name : `${category.name} · ${formatShortDate(expense.date)}`}</p>
        </div>
        <span className="sensitive shrink-0 font-medium">-{formatCurrency(expense.amount)}</span>
      </button>
    </div>
  );
}
