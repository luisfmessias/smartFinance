import type { Category, Expense } from "@/types";

export const categories: Category[] = [
  { key: "food", name: "Alimentação", color: "#F59E0B", softColor: "#FEF3C7", budget: 1200 },
  { key: "transport", name: "Transporte", color: "#3B82F6", softColor: "#DBEAFE", budget: 650 },
  { key: "home", name: "Casa", color: "#8B5CF6", softColor: "#EDE9FE", budget: 1900 },
  { key: "health", name: "Saúde", color: "#EF4444", softColor: "#FEE2E2", budget: 500 },
  { key: "leisure", name: "Lazer", color: "#EC4899", softColor: "#FCE7F3", budget: 600 },
  { key: "education", name: "Educação", color: "#14B8A6", softColor: "#CCFBF1", budget: 450 },
  { key: "other", name: "Outros", color: "#64748B", softColor: "#E2E8F0", budget: 400 },
];

export const initialExpenses: Expense[] = [
  { id: "1", title: "Supermercado", category: "food", amount: 284.9, date: "2026-06-01" },
  { id: "2", title: "Uber para o trabalho", category: "transport", amount: 26.4, date: "2026-06-01" },
  { id: "3", title: "Farmácia", category: "health", amount: 68.7, date: "2026-05-31" },
  { id: "4", title: "Aluguel", category: "home", amount: 1450, date: "2026-05-30" },
  { id: "5", title: "Cinema", category: "leisure", amount: 52, date: "2026-05-28" },
  { id: "6", title: "Curso de inglês", category: "education", amount: 189.9, date: "2026-05-26" },
  { id: "7", title: "Restaurante", category: "food", amount: 94.5, date: "2026-05-24" },
  { id: "8", title: "Internet", category: "home", amount: 119.9, date: "2026-05-22" },
  { id: "9", title: "Academia", category: "health", amount: 99, date: "2026-05-18" },
  { id: "10", title: "Presente", category: "other", amount: 135, date: "2026-05-15" },
];
