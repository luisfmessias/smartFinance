import { BarChart3, Home, Plus, ReceiptText, UserRound } from "lucide-react";
import type { AppScreen } from "@/types";

export function AppShell({ activeScreen, onNavigate, onAddExpense, children }: { activeScreen: AppScreen; onNavigate: (screen: AppScreen) => void; onAddExpense: () => void; children: React.ReactNode }) {
  const items = [
    { screen: "home" as const, icon: Home, label: "Início" },
    { screen: "expenses" as const, icon: ReceiptText, label: "Gastos" },
    { screen: "reports" as const, icon: BarChart3, label: "Relatórios" },
    { screen: "profile" as const, icon: UserRound, label: "Perfil" },
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-md overflow-hidden bg-canvas pb-24 shadow-card">
      <div className="px-5 pb-4 pt-8">{children}</div>
      <nav className="safe-bottom fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-slate-100 bg-white/95 px-3 pt-3 backdrop-blur">
        {items.slice(0, 2).map(({ screen, icon: Icon, label }) => <NavItem key={screen} active={activeScreen === screen} icon={<Icon size={19} />} label={label} onClick={() => onNavigate(screen)} />)}
        <button onClick={onAddExpense} className="-mt-9 flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf text-white shadow-lg shadow-leaf/25 transition active:scale-95" aria-label="Adicionar gasto"><Plus size={25} /></button>
        {items.slice(2).map(({ screen, icon: Icon, label }) => <NavItem key={screen} active={activeScreen === screen} icon={<Icon size={19} />} label={label} onClick={() => onNavigate(screen)} />)}
      </nav>
    </main>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button onClick={onClick} className={`flex min-w-14 flex-col items-center gap-1 text-[10px] font-bold transition ${active ? "text-leaf" : "text-slate-400"}`}>{icon}<span>{label}</span></button>;
}
