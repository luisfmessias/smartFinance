"use client";

import { useState } from "react";
import { BarChart3, Bell, Eye, EyeOff, LayoutGrid, Plus, Target } from "lucide-react";
import { CategoryBreakdown } from "@/components/expenses/category-breakdown";
import { AccountSheet } from "@/components/layout/account-sheet";
import { NavArrows } from "@/components/layout/navigation";
import { ExpenseRow } from "@/components/expenses/expense-row";
import { EmptyState } from "@/components/ui/empty-state";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { Money } from "@/components/ui/money";
import { getProgressTone, Progress } from "@/components/ui/progress";
import { currentPeriod, formatCurrency, getInitials, sumExpenses } from "@/lib/format";
import type { AppScreen, Expense, UserAccount, UserPreferences } from "@/types";

function getGreeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Bom dia!" : hour < 18 ? "Boa tarde!" : "Boa noite!";
}

export function HomeScreen({ account, expenses, preferences, onNavigate, onAddExpense, onEditExpense, onPreferencesChange, onLogout }: { account: UserAccount; expenses: Expense[]; preferences: UserPreferences; onNavigate: (screen: AppScreen) => void; onAddExpense: () => void; onEditExpense: (expense: Expense) => void; onPreferencesChange: (preferences: UserPreferences) => void; onLogout: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const period = currentPeriod();
  const currentExpenses = expenses.filter((expense) => expense.date.startsWith(period));
  const total = sumExpenses(currentExpenses);
  const budget = preferences.monthlyBudget;
  const remaining = budget - total;
  const ratio = total / budget;
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());

  return (
    <div className="animate-in">
      <header className="flex items-center gap-3">
        <button onClick={() => setShowAccount(true)} aria-label="Abrir sua conta" className="glass flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold">{getInitials(account.name)}</button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-sage">Olá, {account.name.split(" ")[0]}</p>
          <h1 className="text-lg font-semibold leading-tight tracking-tight">{getGreeting()}</h1>
        </div>
        <NavArrows />
        <button onClick={() => setShowNotifications(true)} className="glass flex h-11 w-11 items-center justify-center rounded-full" aria-label="Abrir notificações"><Bell size={18} strokeWidth={1.8} /></button>
      </header>

      <div className="mt-5 grid gap-4 lg:mt-7 lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-5">
        <div className="flex flex-col gap-4 lg:gap-5">
          <section className="glass overflow-hidden rounded-[30px] p-6">
            <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-lime/25 blur-3xl" />
            <button onClick={() => onPreferencesChange({ ...preferences, hideValues: !preferences.hideValues })} aria-label={preferences.hideValues ? "Mostrar valores" : "Ocultar valores"} aria-pressed={preferences.hideValues} className="well absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full">
              {preferences.hideValues ? <EyeOff size={17} strokeWidth={1.8} /> : <Eye size={17} strokeWidth={1.8} />}
            </button>
            <p className="text-sm text-sage">Gastos de {month}</p>
            <Money value={total} className="mt-1 block text-[42px] leading-tight lg:text-5xl" />
            <div className="mt-6"><Progress ratio={ratio} tone={getProgressTone(ratio, preferences.alertThreshold)} /></div>
            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span className="text-sage">Limite mensal <span className="sensitive">{formatCurrency(budget)}</span></span>
              <span className={remaining < 0 ? "sensitive shrink-0 font-medium text-coral" : "sensitive shrink-0 font-medium"}>{remaining < 0 ? `${formatCurrency(-remaining)} acima` : `${formatCurrency(remaining)} livres`}</span>
            </div>
          </section>

          <section className="grid grid-cols-4 gap-2.5">
            <QuickAction icon={<Plus size={19} />} label="Novo gasto" onClick={onAddExpense} />
            <QuickAction icon={<Target size={19} strokeWidth={1.8} />} label="Orçamento" onClick={() => onNavigate("budget")} />
            <QuickAction icon={<LayoutGrid size={19} strokeWidth={1.8} />} label="Categorias" onClick={() => onNavigate("categories")} />
            <QuickAction icon={<BarChart3 size={19} strokeWidth={1.8} />} label="Relatórios" onClick={() => onNavigate("reports")} />
          </section>
        </div>

        <div className="flex flex-col gap-4 lg:col-start-1 lg:gap-5">
          <section className="glass rounded-[30px] p-4">
            <PanelTitle title="Últimos gastos" onClick={expenses.length ? () => onNavigate("expenses") : undefined} />
            {expenses.length
              ? <div className="mt-1 divide-y divide-white/10">{expenses.slice(0, 5).map((expense) => <ExpenseRow key={expense.id} expense={expense} compact={preferences.compactMode} onClick={() => onEditExpense(expense)} />)}</div>
              : <EmptyState title="Registre seu primeiro gasto" text="Adicione uma compra ou conta para acompanhar seu mês." action="Adicionar gasto" onClick={onAddExpense} />}
          </section>
        </div>

        {currentExpenses.length > 0 && (
          <section className="glass rounded-[30px] p-4 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <PanelTitle title="Onde mais gastou" onClick={() => onNavigate("categories")} />
            <div className="mt-3 px-2 pb-2"><CategoryBreakdown expenses={currentExpenses} limit={4} hideEmpty /></div>
          </section>
        )}
      </div>

      <AccountSheet open={showAccount} account={account} expenses={expenses} onClose={() => setShowAccount(false)} onNavigate={onNavigate} onLogout={onLogout} />

      <ModalSheet open={showNotifications} onClose={() => setShowNotifications(false)} title="Notificações" subtitle="Alertas do seu mês.">
        <div className="flex flex-col gap-2">
          {preferences.budgetAlerts && <Notice title={remaining < 0 ? "Limite mensal ultrapassado" : "Orçamento sob controle"} text={remaining < 0 ? "Revise os gastos recentes para retomar seu planejamento." : `Você ainda tem ${formatCurrency(remaining)} disponíveis neste mês.`} />}
          {preferences.monthlySummary && <Notice title="Resumo mensal" text={total ? `Você registrou ${currentExpenses.length} ${currentExpenses.length === 1 ? "gasto" : "gastos"} neste mês.` : "Adicione seu primeiro gasto para ver o resumo do mês."} />}
          {!preferences.budgetAlerts && !preferences.monthlySummary && <Notice title="Notificações pausadas" text="Ative os avisos novamente no seu perfil." />}
        </div>
      </ModalSheet>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="glass flex flex-col items-center gap-2 rounded-[22px] px-1 py-3 text-xs font-medium">
      <span className="well flex h-10 w-10 items-center justify-center rounded-full">{icon}</span>
      {label}
    </button>
  );
}

function PanelTitle({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <div className="flex items-center justify-between px-2 pt-1">
      <h2 className="font-semibold tracking-tight">{title}</h2>
      {onClick && <button onClick={onClick} className="well rounded-full px-3 py-1 text-xs font-medium">Ver tudo</button>}
    </div>
  );
}

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div className="well rounded-2xl p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-0.5 text-sm leading-5 text-sage">{text}</p>
    </div>
  );
}
