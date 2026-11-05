import { CategoryBreakdown } from "@/components/expenses/category-breakdown";
import { Money } from "@/components/ui/money";
import { ScreenHeader } from "@/components/ui/screen-header";
import { categories } from "@/data/categories";
import { currentPeriod, sumExpenses } from "@/lib/format";
import type { Expense } from "@/types";

export function CategoriesScreen({ expenses }: { expenses: Expense[] }) {
  const period = currentPeriod();
  const currentExpenses = expenses.filter((expense) => expense.date.startsWith(period));
  const total = sumExpenses(currentExpenses);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
  const unused = categories.filter((category) => !currentExpenses.some((expense) => expense.category === category.key));

  return (
    <div className="animate-in">
      <ScreenHeader title="Categorias" subtitle="Para onde seu dinheiro está indo." />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:items-start lg:gap-5">
        <section className="glass rounded-[28px] p-5">
          <p className="text-sm text-sage">Total de {month}</p>
          <Money value={total} className="mt-1 block text-3xl leading-tight" />
          {!total && <p className="mt-2 text-sm leading-5 text-sage">Adicione gastos para ver a distribuição do mês.</p>}
        </section>
        {total > 0 && (
          <section className="glass rounded-[28px] p-5">
            <CategoryBreakdown expenses={currentExpenses} hideEmpty />
            {unused.length > 0 && (
              <div className="mt-5 border-t border-white/10 pt-4">
                <h2 className="text-sm text-sage">Sem gastos neste mês</h2>
                <div className="mt-2 flex flex-wrap gap-1.5">{unused.map((category) => <span key={category.key} className="well rounded-full px-3 py-1 text-sm">{category.name}</span>)}</div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
