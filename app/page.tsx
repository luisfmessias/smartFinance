"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { HomeScreen } from "@/components/screens/home-screen";
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
  const [expenses] = useState<Expense[]>(initialExpenses);

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;

  return (
    <AppShell activeScreen={screen} onNavigate={setScreen} onAddExpense={() => undefined}>
      {screen === "home"
        ? <HomeScreen expenses={expenses} onNavigate={setScreen} onAddExpense={() => undefined} />
        : <div className="animate-in"><ScreenHeader title={titles[screen]} subtitle="Em construção." /></div>}
    </AppShell>
  );
}
