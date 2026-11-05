import "server-only";
import { z } from "zod";
import { categories } from "@/data/categories";
import type { CategoryKey } from "@/types";

const categoryKeys = categories.map((category) => category.key) as [CategoryKey, ...CategoryKey[]];

const name = z.string().trim().min(1, "Informe seu nome.").max(120, "O nome é muito longo.");
const email = z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(254, "O e-mail é muito longo.");
const newPassword = z.string().min(8, "A senha precisa ter pelo menos 8 caracteres.").max(128, "A senha é muito longa.");

const money = (message: string) => z.number({ error: message }).min(0.01, message).max(999_999_999.99, "O valor é muito alto.")
  .transform((value) => Math.round(value * 100) / 100);

const isRealDate = (value: string) => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

export const registerSchema = z.object({ name, email, password: newPassword });
export const loginSchema = z.object({ email, password: z.string().min(1, "Informe sua senha.").max(128) });
export const forgotPasswordSchema = z.object({ email });
export const resetPasswordSchema = z.object({ token: z.string().min(1, "Link inválido."), password: newPassword });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1, "Informe a senha atual.").max(128), newPassword });
export const updateAccountSchema = z.object({ name, email });

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "Informe uma descrição.").max(120, "A descrição é muito longa."),
  amount: money("Informe um valor maior que zero."),
  category: z.enum(categoryKeys, { error: "Categoria inválida." }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.").refine(isRealDate, "Data inválida."),
  note: z.string().trim().max(500, "A observação é muito longa.").optional(),
});

const budget = money("Informe um limite maior que zero.");

export const preferencesSchema = z.object({
  budgetAlerts: z.boolean(),
  monthlySummary: z.boolean(),
  compactMode: z.boolean(),
  monthlyBudget: budget,
  categoryBudgets: z.record(z.enum(categoryKeys), budget),
});
