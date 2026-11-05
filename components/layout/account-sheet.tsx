import { BarChart3, ChevronRight, LogOut, Target, UserRound } from "lucide-react";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { currentPeriod, formatCurrency, getInitials, sumExpenses, toLocalDate } from "@/lib/format";
import type { AppScreen, Expense, UserAccount } from "@/types";

export function AccountSheet({ open, account, expenses, onClose, onNavigate, onLogout }: { open: boolean; account: UserAccount; expenses: Expense[]; onClose: () => void; onNavigate: (screen: AppScreen) => void; onLogout: () => void }) {
  const period = currentPeriod();
  const monthExpenses = expenses.filter((expense) => expense.date.startsWith(period));
  const today = sumExpenses(expenses.filter((expense) => expense.date === toLocalDate()));
  const dailyAverage = sumExpenses(monthExpenses) / new Date().getDate();
  const biggest = monthExpenses.reduce<Expense | null>((largest, expense) => !largest || expense.amount > largest.amount ? expense : largest, null);

  const go = (screen: AppScreen) => {
    onClose();
    onNavigate(screen);
  };

  return (
    <ModalSheet open={open} onClose={onClose} title="Sua conta" subtitle="Seu mês em resumo.">
      <div className="flex items-center gap-3">
        <div className="well flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-semibold">{getInitials(account.name)}</div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{account.name}</p>
          <p className="truncate text-sm text-sage">{account.email}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Stat label="Gasto hoje" value={formatCurrency(today)} />
        <Stat label="Média por dia" value={formatCurrency(dailyAverage)} />
        {biggest && <div className="col-span-2"><Stat label={`Maior gasto do mês: ${biggest.title}`} value={formatCurrency(biggest.amount)} /></div>}
      </div>

      <div className="mt-4 divide-y divide-white/10">
        <Shortcut icon={<UserRound size={18} strokeWidth={1.8} />} label="Meu perfil" onClick={() => go("profile")} />
        <Shortcut icon={<Target size={18} strokeWidth={1.8} />} label="Ajustar orçamento" onClick={() => go("budget")} />
        <Shortcut icon={<BarChart3 size={18} strokeWidth={1.8} />} label="Ver relatórios" onClick={() => go("reports")} />
      </div>

      <button onClick={onLogout} className="mt-3 flex w-full items-center justify-center gap-2 py-2 font-medium text-coral"><LogOut size={17} /> Sair da conta</button>
    </ModalSheet>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="well rounded-2xl p-3">
      <p className="truncate text-sm text-sage">{label}</p>
      <p className="sensitive mt-0.5 text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function Shortcut({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <div>
      <button onClick={onClick} className="flex w-full items-center gap-3 px-1 py-3 text-left font-medium">
        <span className="text-sage">{icon}</span>
        <span className="flex-1">{label}</span>
        <ChevronRight size={16} className="text-sage" />
      </button>
    </div>
  );
}
