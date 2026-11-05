"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AppScreen } from "@/types";

interface Navigation {
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
}

const NavigationContext = createContext<Navigation>({ canGoBack: false, canGoForward: false, goBack: () => {}, goForward: () => {} });

export const NavigationProvider = NavigationContext.Provider;

/** Histórico de telas ligado ao do navegador: as setas do app e o voltar do celular andam juntos. */
export function useScreenHistory() {
  const [history, setHistory] = useState<{ entries: AppScreen[]; index: number }>({ entries: ["home"], index: 0 });

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const index = Number(event.state?.smartfinanceIndex ?? 0);
      setHistory((current) => ({ ...current, index: Math.min(index, current.entries.length - 1) }));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((screen: AppScreen) => {
    if (screen === history.entries[history.index]) return;
    const entries = [...history.entries.slice(0, history.index + 1), screen];
    window.history.pushState({ smartfinanceIndex: entries.length - 1 }, "");
    setHistory({ entries, index: entries.length - 1 });
  }, [history]);

  const reset = useCallback((screen: AppScreen) => {
    window.history.replaceState({ smartfinanceIndex: 0 }, "");
    setHistory({ entries: [screen], index: 0 });
  }, []);

  const navigation = useMemo<Navigation>(() => ({
    canGoBack: history.index > 0,
    canGoForward: history.index < history.entries.length - 1,
    goBack: () => window.history.back(),
    goForward: () => window.history.forward(),
  }), [history]);

  return { screen: history.entries[history.index], navigate, reset, navigation };
}

export function NavArrows() {
  const { canGoBack, canGoForward, goBack, goForward } = useContext(NavigationContext);
  if (!canGoBack && !canGoForward) return null;
  return (
    <div className="glass flex shrink-0 items-center rounded-full p-0.5">
      <button onClick={goBack} disabled={!canGoBack} aria-label="Voltar" className="flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-30"><ChevronLeft size={18} /></button>
      <button onClick={goForward} disabled={!canGoForward} aria-label="Avançar" className="flex h-9 w-9 items-center justify-center rounded-full disabled:opacity-30"><ChevronRight size={18} /></button>
    </div>
  );
}
