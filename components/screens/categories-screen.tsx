import { CategoryIcon } from "@/components/ui/category-icon";
import { ScreenHeader } from "@/components/ui/screen-header";
import { categories } from "@/data/mock-data";
import { formatCurrency, sumExpenses } from "@/lib/format";
import type { Expense } from "@/types";

export function CategoriesScreen({ expenses }: { expenses: Expense[] }) {
  const currentPeriod = new Date().toLocaleDateString("en-CA").slice(0, 7);
  const currentExpenses = expenses.filter((expense) => expense.date.startsWith(currentPeriod));
  const total = sumExpenses(currentExpenses);
  return (
    <div className="animate-in">
      <ScreenHeader title="Categorias" subtitle="Entenda para onde seu dinheiro está indo." />
      {!total && <p className="mb-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs leading-5 text-slate-500">Adicione gastos para visualizar a distribuição por categoria.</p>}
      <div className="space-y-3">
        {categories.map((category) => {
          const spent = sumExpenses(currentExpenses.filter((expense) => expense.category === category.key));
          const percentage = total ? Math.round((spent / total) * 100) : 0;
          return <div key={category.key} className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><CategoryIcon category={category.key} /><div className="flex-1"><div className="flex items-center justify-between"><p className="text-sm font-bold">{category.name}</p><p className="text-sm font-bold">{formatCurrency(spent)}</p></div><p className="mt-1 text-[11px] text-slate-400">{percentage}% dos gastos do período</p></div></div><div className="mt-3 h-1.5 rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: category.color }} /></div></div>;
        })}
      </div>
    </div>
  );
}
