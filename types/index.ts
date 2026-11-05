export type AppScreen = "home" | "expenses" | "categories" | "budget" | "reports" | "profile";

export type CategoryKey =
  | "food"
  | "groceries"
  | "transport"
  | "home"
  | "bills"
  | "health"
  | "beauty"
  | "clothing"
  | "leisure"
  | "subscriptions"
  | "travel"
  | "education"
  | "pets"
  | "gifts"
  | "other";

export interface Expense {
  id: string;
  title: string;
  category: CategoryKey;
  amount: number;
  date: string;
  note?: string;
}

export type ExpenseInput = Omit<Expense, "id">;

export interface UserAccount {
  id: string;
  name: string;
  email: string;
}

export interface UserPreferences {
  budgetAlerts: boolean;
  monthlySummary: boolean;
  compactMode: boolean;
  hideValues: boolean;
  reduceMotion: boolean;
  /** Percentual do limite a partir do qual o orçamento mostra o aviso. */
  alertThreshold: number;
  startScreen: AppScreen;
  defaultCategory: CategoryKey;
  monthlyBudget: number;
  categoryBudgets: Record<CategoryKey, number>;
}

export interface Category {
  key: CategoryKey;
  name: string;
}
