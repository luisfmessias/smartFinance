import { BarChart3, Home, LayoutGrid, Plus, ReceiptText, Target, UserRound } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import type { AppScreen } from "@/types";

const sidebarItems = [
  { screen: "home", icon: Home, label: "Início" },
  { screen: "expenses", icon: ReceiptText, label: "Gastos" },
  { screen: "categories", icon: LayoutGrid, label: "Categorias" },
  { screen: "budget", icon: Target, label: "Orçamento" },
  { screen: "reports", icon: BarChart3, label: "Relatórios" },
  { screen: "profile", icon: UserRound, label: "Perfil" },
] as const;

const tabItems = [
  { screen: "home", icon: Home, label: "Início" },
  { screen: "expenses", icon: ReceiptText, label: "Gastos" },
  { screen: "reports", icon: BarChart3, label: "Relatórios" },
  { screen: "profile", icon: UserRound, label: "Perfil" },
] as const;

export function AppShell({ activeScreen, onNavigate, onAddExpense, children }: { activeScreen: AppScreen; onNavigate: (screen: AppScreen) => void; onAddExpense: () => void; children: React.ReactNode }) {
  const tab = ({ screen, icon: Icon, label }: (typeof tabItems)[number]) => {
    const active = activeScreen === screen;
    return (
      <button key={screen} onClick={() => onNavigate(screen)} aria-current={active ? "page" : undefined} className={`flex h-14 flex-1 flex-col items-center justify-center gap-1 rounded-[22px] text-[11px] font-medium transition-colors ${active ? "well text-mist" : "text-sage"}`}>
        <Icon size={19} strokeWidth={1.8} />
        {label}
      </button>
    );
  };

  return (
    <div className="lg:pl-72">
      <aside className="glass fixed bottom-4 left-4 top-4 hidden w-60 flex-col rounded-[30px] p-4 lg:flex">
        <div className="px-2 py-2"><Logo /></div>
        <nav className="mt-7 flex flex-col gap-1">
          {sidebarItems.map(({ screen, icon: Icon, label }) => {
            const active = activeScreen === screen;
            return (
              <button key={screen} onClick={() => onNavigate(screen)} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "well text-mist" : "text-sage hover:text-mist"}`}>
                <Icon size={18} strokeWidth={1.8} />
                {label}
              </button>
            );
          })}
        </nav>
        <button onClick={onAddExpense} className="btn-primary mt-auto"><Plus size={18} /> Novo gasto</button>
      </aside>

      <main className="mx-auto w-full max-w-md px-4 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))] lg:max-w-5xl lg:px-8 lg:pb-10 lg:pt-8">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="glass-strong mx-auto flex max-w-md items-center gap-1 rounded-[30px] p-1.5">
          {tabItems.slice(0, 2).map(tab)}
          <button onClick={onAddExpense} aria-label="Adicionar gasto" className="mx-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lime text-pine shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] transition active:scale-95">
            <Plus size={24} />
          </button>
          {tabItems.slice(2).map(tab)}
        </div>
      </nav>
    </div>
  );
}
