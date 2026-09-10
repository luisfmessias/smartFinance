import { initialExpenses } from "@/data/mock-data";
import type { Expense, UserAccount, UserPreferences } from "@/types";

const ACCOUNTS_KEY = "smartfinance.accounts";
const EXPENSES_KEY = "smartfinance.expenses";
const SESSION_KEY = "smartfinance.session";
const PREFERENCES_KEY = "smartfinance.preferences";

const demoAccount: UserAccount = {
  name: "Luís Freitas",
  email: "luis@email.com",
  passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
};

type ExpensesByEmail = Record<string, Expense[]>;
type PreferencesByEmail = Record<string, UserPreferences>;

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

const normalizeEmail = (email: string) => email.trim().toLowerCase();

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readAccounts(): UserAccount[] {
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  if (!stored) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([demoAccount]));
    return [demoAccount];
  }
  return JSON.parse(stored) as UserAccount[];
}

function writeAccounts(accounts: UserAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function readExpenses(): ExpensesByEmail {
  const stored = localStorage.getItem(EXPENSES_KEY);
  if (!stored) {
    const initial = { [demoAccount.email]: initialExpenses };
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored) as ExpensesByEmail;
}

function writeExpenses(expenses: ExpensesByEmail) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

function readPreferences(): PreferencesByEmail {
  const stored = localStorage.getItem(PREFERENCES_KEY);
  return stored ? JSON.parse(stored) as PreferencesByEmail : {};
}

function writePreferences(preferences: PreferencesByEmail) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export async function registerAccount(account: { name: string; email: string; password: string }): Promise<UserAccount> {
  const email = normalizeEmail(account.email);
  const accounts = readAccounts();
  if (accounts.some((item) => item.email === email)) throw new Error("Este e-mail já possui uma conta.");
  const created = { name: account.name.trim(), email, passwordHash: await hashPassword(account.password) };
  writeAccounts([...accounts, created]);
  const expenses = readExpenses();
  writeExpenses({ ...expenses, [email]: [] });
  saveAccountPreferences(email, defaultPreferences);
  return created;
}

export async function loginAccount(email: string, password: string): Promise<UserAccount> {
  const accounts = readAccounts();
  const passwordHash = await hashPassword(password);
  const account = accounts.find((item) => item.email === normalizeEmail(email) && (item.passwordHash === passwordHash || (item as UserAccount & { password?: string }).password === password));
  if (!account) throw new Error("E-mail ou senha inválidos.");
  if (!account.passwordHash) {
    const migrated = { name: account.name, email: account.email, passwordHash };
    writeAccounts(accounts.map((item) => item.email === account.email ? migrated : item));
    return migrated;
  }
  return account;
}

export function updateAccount(currentEmail: string, updates: Pick<UserAccount, "name" | "email">): UserAccount {
  const oldEmail = normalizeEmail(currentEmail);
  const email = normalizeEmail(updates.email);
  const accounts = readAccounts();
  if (email !== oldEmail && accounts.some((item) => item.email === email)) throw new Error("Este e-mail já está em uso.");
  const current = accounts.find((item) => item.email === oldEmail);
  if (!current) throw new Error("Conta não encontrada.");
  const updated = { ...current, name: updates.name.trim(), email };
  writeAccounts(accounts.map((item) => item.email === oldEmail ? updated : item));
  if (email !== oldEmail) {
    const expenses = readExpenses();
    expenses[email] = expenses[oldEmail] ?? [];
    delete expenses[oldEmail];
    writeExpenses(expenses);
    const preferences = readPreferences();
    preferences[email] = preferences[oldEmail] ?? defaultPreferences;
    delete preferences[oldEmail];
    writePreferences(preferences);
  }
  return updated;
}

export async function resetAccountPassword(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const accounts = readAccounts();
  if (!accounts.some((item) => item.email === normalizedEmail)) throw new Error("Não encontramos uma conta com este e-mail.");
  const passwordHash = await hashPassword(password);
  writeAccounts(accounts.map((item) => item.email === normalizedEmail ? { name: item.name, email: item.email, passwordHash } : item));
}

export function getAccountExpenses(email: string): Expense[] {
  const expenses = readExpenses();
  return expenses[normalizeEmail(email)] ?? [];
}

export function saveAccountExpenses(email: string, accountExpenses: Expense[]) {
  const expenses = readExpenses();
  writeExpenses({ ...expenses, [normalizeEmail(email)]: accountExpenses });
}

export function getAccountPreferences(email: string): UserPreferences {
  const preferences = readPreferences();
  return preferences[normalizeEmail(email)] ?? defaultPreferences;
}

export function saveAccountPreferences(email: string, accountPreferences: UserPreferences) {
  const preferences = readPreferences();
  writePreferences({ ...preferences, [normalizeEmail(email)]: accountPreferences });
}

export function getActiveAccount(): UserAccount | null {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return readAccounts().find((item) => item.email === email) ?? null;
}

export function setActiveAccount(account: UserAccount) {
  localStorage.setItem(SESSION_KEY, account.email);
}

export function clearActiveAccount() {
  localStorage.removeItem(SESSION_KEY);
}
