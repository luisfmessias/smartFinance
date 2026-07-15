"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { WelcomeScreen } from "@/components/auth/welcome-screen";
import { ScreenHeader } from "@/components/ui/screen-header";
import type { AppScreen } from "@/types";

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

  if (!started) return <WelcomeScreen onStart={() => setStarted(true)} />;

  return (
    <AppShell activeScreen={screen} onNavigate={setScreen} onAddExpense={() => undefined}>
      <div className="animate-in">
        <ScreenHeader title={titles[screen]} subtitle="Em construção." />
      </div>
    </AppShell>
  );
}
