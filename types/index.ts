export type AppScreen = "home" | "expenses" | "categories" | "budget" | "reports" | "profile";

export type CategoryKey =
  | "food"
  | "transport"
  | "home"
  | "health"
  | "leisure"
  | "education"
  | "other";

export interface Expense {
  id: string;
  title: string;
  category: CategoryKey;
  amount: number;
  date: string;
  note?: string;
}

export interface Category {
  key: CategoryKey;
  name: string;
  color: string;
  softColor: string;
  budget: number;
}
