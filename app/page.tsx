"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { NavigationProvider, useScreenHistory } from "@/components/layout/navigation";
import { AuthFlow } from "@/components/auth/auth-flow";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { BudgetScreen } from "@/components/screens/budget-screen";
import { CategoriesScreen } from "@/components/screens/categories-screen";
import { ExpensesScreen } from "@/components/screens/expenses-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { ProfileScreen } from "@/components/screens/profile-screen";
import { ReportsScreen } from "@/components/screens/reports-screen";
import { AddExpenseSheet } from "@/components/expenses/add-expense-sheet";
import { Onboarding } from "@/components/onboarding/onboarding";
import { Logo } from "@/components/ui/logo";
import { defaultPreferences } from "@/lib/preferences";
import { ApiRequestError, errorMessage } from "@/services/api-client";
import { getCurrentAccount, logoutAccount } from "@/services/auth-service";
import { createExpense, deleteExpense, getExpenses, updateExpense } from "@/services/expense-service";
import { getPreferences, savePreferences } from "@/services/preferences-service";
import type { AppScreen, Expense, ExpenseInput, UserAccount, UserPreferences } from "@/types";

const byNewest = (expenses: Expense[]) => [...expenses].sort((a, b) => b.date.localeCompare(a.date));

export default function SmartFinancePage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [started, setStarted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const { screen, navigate, reset, navigation } = useScreenHistory();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const clearSession = useCallback(() => {
    setAccount(null);
    setExpenses([]);
    setPreferences(defaultPreferences);
    setShowAddExpense(false);
    setEditingExpense(null);
    setNotice("");
    setShowOnboarding(false);
  }, []);

  const loadAccount = useCallback(async (loadedAccount: UserAccount) => {
    const [loadedExpenses, loadedPreferences] = await Promise.all([getExpenses(), getPreferences()]);
    setExpenses(loadedExpenses);
    setPreferences(loadedPreferences);
    setAccount(loadedAccount);
    setStarted(true);
    reset(loadedPreferences.startScreen);
  }, [reset]);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const currentAccount = await getCurrentAccount();
      if (currentAccount) await loadAccount(currentAccount);
    } catch (error) {
      setLoadError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [loadAccount]);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("reset");
    if (token) {
      window.history.replaceState(null, "", window.location.pathname);
      setResetToken(token);
      setStarted(true);
      setLoading(false);
      return;
    }
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    document.documentElement.dataset.hideValues = String(preferences.hideValues);
    document.documentElement.dataset.reduceMotion = String(preferences.reduceMotion);
  }, [preferences.hideValues, preferences.reduceMotion]);

  if (loading) return <main className="flex min-h-dvh items-center justify-center" aria-busy="true"><Logo /></main>;
  if (loadError) return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-5 px-6 text-center">
      <Logo />
      <p className="leading-6 text-sage">{loadError}</p>
      <button onClick={() => void restoreSession()} className="btn-primary">Tentar novamente</button>
    </main>
  );
  if (showOnboarding) return (
    <Onboarding
      initialLimit={preferences.monthlyBudget}
      onSkip={() => setShowOnboarding(false)}
      onFinish={({ monthlyBudget, useLimit }) => {
        setShowOnboarding(false);
        if (!useLimit) return;
        const updated = { ...preferences, monthlyBudget };
        setPreferences(updated);
        savePreferences(updated).catch((error) => {
          setPreferences(preferences);
          setNotice(errorMessage(error));
        });
      }}
    />
  );
  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;
  if (!account) return <AuthFlow resetToken={resetToken} onResetDone={() => setResetToken(null)} onAuthenticated={async (authenticatedAccount, isNewAccount) => {
    await loadAccount(authenticatedAccount);
    // A introdução aparece apenas logo depois de criar a conta.
    setShowOnboarding(isNewAccount);
  }} />;

  const closeExpenseSheet = () => {
    setShowAddExpense(false);
    setEditingExpense(null);
  };

  /** Sessão expirada volta para o login; o restante segue para quem chamou tratar. */
  const handleSessionError = (error: unknown) => {
    if (error instanceof ApiRequestError && error.status === 401) clearSession();
    throw error;
  };

  const handleSaveExpense = async (input: ExpenseInput) => {
    const saved = await (editingExpense ? updateExpense(editingExpense.id, input) : createExpense(input)).catch(handleSessionError);
    setExpenses((current) => byNewest(editingExpense ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]));
    closeExpenseSheet();
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense(expenseId).catch(handleSessionError);
    setExpenses((current) => current.filter((expense) => expense.id !== expenseId));
    closeExpenseSheet();
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowAddExpense(true);
  };

  const handlePreferencesChange = (updatedPreferences: UserPreferences) => {
    const previousPreferences = preferences;
    setPreferences(updatedPreferences);
    setNotice("");
    savePreferences(updatedPreferences).catch(handleSessionError).catch((error) => {
      setPreferences(previousPreferences);
      setNotice(errorMessage(error));
    });
  };

  const handleLogout = async () => {
    await logoutAccount().catch(handleSessionError);
    clearSession();
  };

  const logoutFromSheet = () => {
    handleLogout().catch((error) => setNotice(errorMessage(error)));
  };

  const screens: Record<AppScreen, React.ReactNode> = {
    home: <HomeScreen account={account} expenses={expenses} preferences={preferences} onEditExpense={handleEditExpense} onNavigate={navigate} onAddExpense={() => setShowAddExpense(true)} onPreferencesChange={handlePreferencesChange} onLogout={logoutFromSheet} />,
    expenses: <ExpensesScreen expenses={expenses} compact={preferences.compactMode} onEditExpense={handleEditExpense} onAddExpense={() => setShowAddExpense(true)} />,
    categories: <CategoriesScreen expenses={expenses} />,
    budget: <BudgetScreen expenses={expenses} preferences={preferences} onPreferencesChange={handlePreferencesChange} />,
    reports: <ReportsScreen account={account} expenses={expenses} preferences={preferences} />,
    profile: <ProfileScreen account={account} preferences={preferences} onPreferencesChange={handlePreferencesChange} onAccountChange={setAccount} onLogout={handleLogout} onSessionError={handleSessionError} />,
  };

  return (
    <NavigationProvider value={navigation}>
      <AppShell
        activeScreen={screen}
        onNavigate={navigate}
        onAddExpense={() => { setEditingExpense(null); setShowAddExpense(true); }}
      >
        {notice && <p role="alert" className="alert-error mb-4">{notice}</p>}
        {screens[screen]}
      </AppShell>
      <AddExpenseSheet
        open={showAddExpense}
        expense={editingExpense}
        defaultCategory={preferences.defaultCategory}
        onClose={closeExpenseSheet}
        onSave={handleSaveExpense}
        onDelete={handleDeleteExpense}
      />
    </NavigationProvider>
  );
}
