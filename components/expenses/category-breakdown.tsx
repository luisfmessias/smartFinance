import { CategoryIcon } from "@/components/ui/category-icon";
import { Progress } from "@/components/ui/progress";
import { categories } from "@/data/categories";
import { formatCurrency, sumExpenses } from "@/lib/format";
import type { Expense } from "@/types";

/** Categorias da maior para a menor. As barras são proporcionais ao total. */
export function CategoryBreakdown({ expenses, limit, hideEmpty = false }: { expenses: Expense[]; limit?: number; hideEmpty?: boolean }) {
  const total = sumExpenses(expenses);
  const rows = categories
    .map((category) => ({ ...category, spent: sumExpenses(expenses.filter((expense) => expense.category === category.key)) }))
    .filter((category) => !hideEmpty || category.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, limit);

  return (
    <ul className="flex flex-col gap-4">
      {rows.map((category) => {
        const share = total ? category.spent / total : 0;
        return (
          <li key={category.key} className="flex items-center gap-3">
            <CategoryIcon category={category.key} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-medium">{category.name}</span>
                <span className="sensitive shrink-0 font-medium">{formatCurrency(category.spent)}</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1"><Progress ratio={share} /></div>
                <span className="w-9 text-right text-sm text-sage">{Math.round(share * 100)}%</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
