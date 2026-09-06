"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AuthFlow } from "@/components/auth/auth-flow";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { BudgetScreen } from "@/components/screens/budget-screen";
import { CategoriesScreen } from "@/components/screens/categories-screen";
import { ExpensesScreen } from "@/components/screens/expenses-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { ReportsScreen } from "@/components/screens/reports-screen";
import { AddExpenseSheet } from "@/components/expenses/add-expense-sheet";
import { clearActiveAccount, defaultPreferences, getAccountExpenses, getAccountPreferences, getActiveAccount, saveAccountExpenses, saveAccountPreferences, setActiveAccount } from "@/services/account-service";
import type { AppScreen, Expense, UserAccount, UserPreferences } from "@/types";

export default function SmartFinancePage() {
  const [started, setStarted] = useState(false);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [screen, setScreen] = useState<AppScreen>("home");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const activeAccount = getActiveAccount();
    if (!activeAccount) return;
    setAccount(activeAccount);
    setExpenses(getAccountExpenses(activeAccount.email));
    setPreferences(getAccountPreferences(activeAccount.email));
    setStarted(true);
  }, []);

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;
  if (!account) return <AuthFlow onAuthenticated={(authenticatedAccount) => {
    setActiveAccount(authenticatedAccount);
    setAccount(authenticatedAccount);
    setExpenses(getAccountExpenses(authenticatedAccount.email));
    setPreferences(getAccountPreferences(authenticatedAccount.email));
    setScreen("home");
  }} />;

  const handleAddExpense = (expense: Expense) => {
    setExpenses((current) => {
      const updated = editingExpense
        ? current.map((item) => item.id === expense.id ? expense : item)
        : [expense, ...current];
      saveAccountExpenses(account.email, updated);
      return updated;
    });
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses((current) => {
      const updated = current.filter((expense) => expense.id !== expenseId);
      saveAccountExpenses(account.email, updated);
      return updated;
    });
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handlePreferencesChange = (updatedPreferences: UserPreferences) => {
    setPreferences(updatedPreferences);
    saveAccountPreferences(account.email, updatedPreferences);
  };

  const screens: Record<AppScreen, React.ReactNode> = {
    home: <HomeScreen account={account} expenses={expenses} preferences={preferences} onEditExpense={handleEditExpense} onNavigate={setScreen} onAddExpense={() => setShowAddExpense(true)} />,
    expenses: <ExpensesScreen expenses={expenses} onEditExpense={handleEditExpense} onAddExpense={() => setShowAddExpense(true)} />,
    categories: <CategoriesScreen expenses={expenses} />,
    budget: <BudgetScreen expenses={expenses} preferences={preferences} onPreferencesChange={handlePreferencesChange} />,
    reports: <ReportsScreen expenses={expenses} />,
    profile: <ProfileScreen account={account} preferences={preferences} onPreferencesChange={handlePreferencesChange} onAccountChange={(updatedAccount) => { setActiveAccount(updatedAccount); setAccount(updatedAccount); }} onLogout={() => { clearActiveAccount(); setAccount(null); }} />,
  };

  return (
    <>
      <AppShell
        activeScreen={screen}
        onNavigate={setScreen}
        onAddExpense={() => { setEditingExpense(null); setShowAddExpense(true); }}
      >
        {screens[screen]}
      </AppShell>
      <AddExpenseSheet
        open={showAddExpense}
        expense={editingExpense}
        onClose={() => { setShowAddExpense(false); setEditingExpense(null); }}
        onSave={handleAddExpense}
        onDelete={handleDeleteExpense}
      />
    </>
  );
}
