import "server-only";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Prisma, PrismaClient, type Expense as ExpenseRow, type UserPreferences as PreferencesRow } from "@/generated/prisma";
import type { Expense, ExpenseInput, UserPreferences } from "@/types";
import { EmailTakenError, type DataStore } from "./types";

// Fica no globalThis para o hot reload do Next não abrir uma conexão a cada recarga.
const shared = globalThis as typeof globalThis & { smartfinancePrisma?: PrismaClient };

function getClient() {
  if (!shared.smartfinancePrisma) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL precisa estar definido.");
    shared.smartfinancePrisma = new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
  }
  return shared.smartfinancePrisma;
}

const hasCode = (error: unknown, code: string) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

/** Devolve null quando o registro não existe (P2025). */
const orNull = <Result>(operation: Promise<Result>) => operation.catch((error) => {
  if (hasCode(error, "P2025")) return null;
  throw error;
});

const rethrowEmailTaken = (error: unknown): never => {
  throw hasCode(error, "P2002") ? new EmailTakenError() : error;
};

const toDate = (value: string) => new Date(`${value}T00:00:00Z`);

const toExpense = ({ id, title, amount, category, date, note }: ExpenseRow): Expense => ({
  id,
  title,
  amount: amount.toNumber(),
  category,
  date: date.toISOString().slice(0, 10),
  ...(note ? { note } : {}),
});

const toExpenseData = ({ title, amount, category, date, note }: ExpenseInput) => ({
  title,
  amount,
  category,
  date: toDate(date),
  note: note ?? null,
});

const toPreferences = ({ budgetAlerts, monthlySummary, compactMode, monthlyBudget, categoryBudgets }: PreferencesRow): UserPreferences => ({
  budgetAlerts,
  monthlySummary,
  compactMode,
  monthlyBudget: monthlyBudget.toNumber(),
  categoryBudgets: categoryBudgets as unknown as UserPreferences["categoryBudgets"],
});

export const prismaStore: DataStore = {
  ping: async () => {
    await getClient().$queryRaw`SELECT 1`;
  },

  findUserById: (id) => getClient().user.findUnique({ where: { id } }),
  findUserByEmail: (email) => getClient().user.findUnique({ where: { email } }),

  createUser: (user) => getClient().user.create({ data: user }).catch(rethrowEmailTaken),

  updateUser: (id, update) => orNull(getClient().user.update({ where: { id }, data: update })).catch(rethrowEmailTaken),

  listExpenses: async (userId) => {
    const rows = await getClient().expense.findMany({ where: { userId }, orderBy: [{ date: "desc" }, { createdAt: "desc" }] });
    return rows.map(toExpense);
  },

  createExpense: async (userId, expense) => toExpense(await getClient().expense.create({ data: { ...toExpenseData(expense), userId } })),

  updateExpense: async (userId, id, expense) => {
    const row = await orNull(getClient().expense.update({ where: { id, userId }, data: toExpenseData(expense) }));
    return row && toExpense(row);
  },

  deleteExpense: async (userId, id) => {
    const { count } = await getClient().expense.deleteMany({ where: { id, userId } });
    return count > 0;
  },

  getPreferences: async (userId) => {
    const row = await getClient().userPreferences.findUnique({ where: { userId } });
    return row && toPreferences(row);
  },

  savePreferences: async (userId, preferences) => {
    const row = await getClient().userPreferences.upsert({
      where: { userId },
      create: { ...preferences, userId },
      update: preferences,
    });
    return toPreferences(row);
  },

  savePasswordReset: async ({ userId, tokenHash, expiresAt }) => {
    const data = { tokenHash, expiresAt: new Date(expiresAt) };
    await getClient().passwordReset.upsert({ where: { userId }, create: { ...data, userId }, update: data });
  },

  takePasswordReset: async (tokenHash) => {
    const row = await orNull(getClient().passwordReset.delete({ where: { tokenHash } }));
    return row && { userId: row.userId, tokenHash: row.tokenHash, expiresAt: row.expiresAt.toISOString() };
  },
};
