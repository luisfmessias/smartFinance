import type { Expense } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getExpenses(fallback: Expense[]): Promise<Expense[]> {
  if (!API_URL) return fallback;
  const response = await fetch(`${API_URL}/expenses`);
  if (!response.ok) throw new Error("Não foi possível carregar os gastos.");
  return response.json();
}

export async function createExpense(expense: Expense): Promise<Expense> {
  if (!API_URL) return expense;
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  if (!response.ok) throw new Error("Não foi possível salvar o gasto.");
  return response.json();
}
