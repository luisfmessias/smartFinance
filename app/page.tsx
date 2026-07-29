"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { ExpensesScreen } from "@/components/screens/expenses-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { AddExpenseSheet } from "@/components/expenses/add-expense-sheet";
import { ScreenHeader } from "@/components/ui/screen-header";
import { initialExpenses } from "@/data/mock-data";
import type { AppScreen, Expense } from "@/types";

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
  const [screen, setScreen] = useState<AppScreen>("home");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [showAddExpense, setShowAddExpense] = useState(false);

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;

  const handleAddExpense = (expense: Expense) => {
    setExpenses((current) => [expense, ...current]);
    setShowAddExpense(false);
  };

  return (
    <>
      <AppShell activeScreen={screen} onNavigate={setScreen} onAddExpense={() => setShowAddExpense(true)}>
        {screen === "home" && <HomeScreen expenses={expenses} onNavigate={setScreen} onAddExpense={() => setShowAddExpense(true)} />}
        {screen === "expenses" && <ExpensesScreen expenses={expenses} onAddExpense={() => setShowAddExpense(true)} />}
        {screen !== "home" && screen !== "expenses" && <div className="animate-in"><ScreenHeader title={titles[screen]} subtitle="Em construção." /></div>}
      </AppShell>
      <AddExpenseSheet open={showAddExpense} onClose={() => setShowAddExpense(false)} onSave={handleAddExpense} />
    </>
  );
}
