"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthFlow } from "@/components/auth/auth-flow";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { CategoriesScreen } from "@/components/screens/categories-screen";
import { ExpensesScreen } from "@/components/screens/expenses-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { AddExpenseSheet } from "@/components/expenses/add-expense-sheet";
import { ScreenHeader } from "@/components/ui/screen-header";
import { initialExpenses } from "@/data/mock-data";
import { clearActiveAccount, getActiveAccount, setActiveAccount } from "@/services/account-service";
import type { AppScreen, Expense, UserAccount } from "@/types";

const titles: Record<AppScreen, string> = {
  home: "Início",
  expenses: "Meus gastos",
  categories: "Categorias",
  budget: "Orçamento",
  reports: "Relatórios",
  profile: "Meu perfil",
};

export default function SmartFinancePage() {
  const [started, setStarted] = useState(false);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    const activeAccount = getActiveAccount();
    if (!activeAccount) return;
    setAccount(activeAccount);
    setStarted(true);
  }, []);

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;
  if (!account) return <AuthFlow onAuthenticated={(authenticatedAccount) => {
    setActiveAccount(authenticatedAccount);
    setAccount(authenticatedAccount);
    setScreen("home");
  }} />;

  const handleAddExpense = (expense: Expense) => {
    setExpenses((current) => [expense, ...current]);
    setShowAddExpense(false);
  };

  const handleLogout = () => {
    clearActiveAccount();
    setAccount(null);
  };

  return (
    <>
      <AppShell activeScreen={screen} onNavigate={setScreen} onAddExpense={() => setShowAddExpense(true)}>
        {screen === "home" && <HomeScreen account={account} expenses={expenses} onNavigate={setScreen} onAddExpense={() => setShowAddExpense(true)} />}
        {screen === "expenses" && <ExpensesScreen expenses={expenses} onAddExpense={() => setShowAddExpense(true)} />}
        {screen === "categories" && <CategoriesScreen expenses={expenses} />}
        {(screen === "budget" || screen === "reports") && <div className="animate-in"><ScreenHeader title={titles[screen]} subtitle="Em construção." /></div>}
        {screen === "profile" && (
          <div className="animate-in">
            <ScreenHeader title={titles[screen]} subtitle={account.email} />
            <button onClick={handleLogout} className="w-full rounded-2xl border border-red-100 bg-red-50 py-3.5 text-sm font-bold text-red-500">Sair da conta</button>
          </div>
        )}
      </AppShell>
      <AddExpenseSheet open={showAddExpense} onClose={() => setShowAddExpense(false)} onSave={handleAddExpense} />
    </>
  );
}
