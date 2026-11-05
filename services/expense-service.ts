import { api } from "@/services/api-client";
import type { Expense, ExpenseInput } from "@/types";

type ExpenseResponse = { expense: Expense };

export const getExpenses = () => api<{ expenses: Expense[] }>("/expenses").then(({ expenses }) => expenses);

export const createExpense = (body: ExpenseInput) =>
  api<ExpenseResponse>("/expenses", { method: "POST", body }).then(({ expense }) => expense);

export const updateExpense = (id: string, body: ExpenseInput) =>
  api<ExpenseResponse>(`/expenses/${id}`, { method: "PATCH", body }).then(({ expense }) => expense);

export const deleteExpense = (id: string) => api(`/expenses/${id}`, { method: "DELETE" });
