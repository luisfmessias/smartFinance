import type { UserPreferences } from "@/types";

export const defaultPreferences: UserPreferences = {
  budgetAlerts: true,
  monthlySummary: true,
  compactMode: false,
  monthlyBudget: 5000,
  categoryBudgets: {
    food: 1200,
    transport: 650,
    home: 1900,
    health: 500,
    leisure: 600,
    education: 450,
    other: 400,
  },
};
