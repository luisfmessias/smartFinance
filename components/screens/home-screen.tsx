"use client";

import { useState } from "react";
import { Bell, ChevronRight, CircleDollarSign, PiggyBank, Target } from "lucide-react";
import { ExpenseRow } from "@/components/expenses/expense-row";
import { CategoryIcon } from "@/components/ui/category-icon";
import { ModalSheet } from "@/components/ui/modal-sheet";
import { categories } from "@/data/mock-data";
import { formatCurrency, sumExpenses } from "@/lib/format";
import type { AppScreen, Expense, UserAccount, UserPreferences } from "@/types";

export function HomeScreen({ account, expenses, preferences, onNavigate, onAddExpense, onEditExpense }: { account: UserAccount; expenses: Expense[]; preferences: UserPreferences; onNavigate: (screen: AppScreen) => void; onAddExpense: () => void; onEditExpense: (expense: Expense) => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const currentPeriod = new Date().toLocaleDateString("en-CA").slice(0, 7);
  const currentExpenses = expenses.filter((expense) => expense.date.startsWith(currentPeriod));
  const total = sumExpenses(currentExpenses);
  const firstName = account.name.split(" ")[0];
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date());
  return (
    <div className="animate-in">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint font-bold text-forest">{getInitials(account.name)}</div><div><p className="text-xs text-slate-500">Olá, {firstName}</p><h1 className="text-lg font-bold">Bom dia!</h1></div></div>
        <button onClick={() => setShowNotifications(true)} className="rounded-full bg-white p-2.5 shadow-sm" aria-label="Abrir notificações"><Bell size={18} /></button>
      </header>
      <section className="mt-6 overflow-hidden rounded-[26px] bg-forest p-5 text-white shadow-card">
        <div className="flex items-start justify-between"><div><p className="text-xs text-white/60">Gastos de {month}</p><p className="mt-2 text-3xl font-bold tracking-tight">{formatCurrency(total)}</p></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold">{month.slice(0, 3)} {new Date().getFullYear()}</span></div>
        <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-white/60">Limite mensal <b className="ml-1 text-white">{formatCurrency(preferences.monthlyBudget)}</b></span><span className="text-xs text-white/60">{Math.round((total / preferences.monthlyBudget) * 100)}% utilizado</span></div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-leaf" style={{ width: `${Math.min((total / preferences.monthlyBudget) * 100, 100)}%` }} /></div>
      </section>
      <section className="mt-5 grid grid-cols-3 gap-3">
        <QuickCard icon={<Target size={17} />} label="Orçamento" onClick={() => onNavigate("budget")} />
        <QuickCard icon={<PiggyBank size={17} />} label="Economizar" onClick={() => onNavigate("budget")} />
        <QuickCard icon={<CircleDollarSign size={17} />} label="Categorias" onClick={() => onNavigate("categories")} />
      </section>
      <SectionTitle title="Gastos por categoria" onClick={() => onNavigate("categories")} />
      <div className="flex gap-3 overflow-x-auto pb-1">
        {categories.slice(0, 5).map((category) => <button key={category.key} onClick={() => onNavigate("categories")} className="min-w-[74px] rounded-2xl bg-white px-2 py-3 shadow-sm"><CategoryIcon category={category.key} size="sm" /><p className="mt-2 truncate text-[10px] font-bold text-slate-600">{category.name}</p></button>)}
      </div>
      <SectionTitle title="Gastos recentes" onClick={() => onNavigate("expenses")} />
      {expenses.length ? <div className={`space-y-2 ${preferences.compactMode ? "[&>button]:py-2" : ""}`}>{expenses.slice(0, 4).map((expense) => <ExpenseRow key={expense.id} expense={expense} onClick={() => onEditExpense(expense)} />)}</div> : <EmptyState title="Registre seu primeiro gasto" text="Comece adicionando uma compra ou conta para acompanhar sua organização." action="Adicionar gasto" onClick={onAddExpense} />}
      <ModalSheet open={showNotifications} onClose={() => setShowNotifications(false)} title="Notificações" subtitle="Acompanhe alertas importantes da sua organização.">
        <div className="space-y-2">{preferences.budgetAlerts && <Notice title={total > preferences.monthlyBudget ? "Limite mensal ultrapassado" : "Orçamento sob controle"} text={total > preferences.monthlyBudget ? "Revise os gastos recentes para retomar seu planejamento." : `Você ainda possui ${formatCurrency(preferences.monthlyBudget - total)} disponíveis neste mês.`} />}{preferences.monthlySummary && <Notice title="Resumo mensal" text={total ? `Você registrou ${currentExpenses.length} gastos neste mês.` : "Adicione seu primeiro gasto para receber análises da sua rotina."} />}{!preferences.budgetAlerts && !preferences.monthlySummary && <Notice title="Notificações pausadas" text="Ative os avisos novamente nas preferências do perfil." />}</div>
      </ModalSheet>
    </div>
  );
}

function EmptyState({ title, text, action, onClick }: { title: string; text: string; action: string; onClick: () => void }) {
  return <div className="rounded-2xl border border-dashed border-leaf/30 bg-mint/60 p-5 text-center"><p className="text-sm font-bold text-forest">{title}</p><p className="mx-auto mt-2 max-w-64 text-xs leading-5 text-slate-500">{text}</p><button onClick={onClick} className="mt-4 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white">{action}</button></div>;
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function Notice({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border border-slate-100 p-4"><p className="text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>;
}

function QuickCard({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-[10px] font-bold text-slate-500 shadow-sm"><span className="text-leaf">{icon}</span>{label}</button>;
}

function SectionTitle({ title, onClick }: { title: string; onClick: () => void }) {
  return <div className="mb-3 mt-6 flex items-center justify-between"><h2 className="text-sm font-bold">{title}</h2><button onClick={onClick} className="flex items-center text-[11px] font-bold text-leaf">Ver tudo <ChevronRight size={14} /></button></div>;
}
