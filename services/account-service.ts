import type { UserAccount } from "@/types";

const ACCOUNTS_KEY = "smartfinance.accounts";
const SESSION_KEY = "smartfinance.session";

const demoAccount: UserAccount = {
  name: "Luís Freitas",
  email: "luis@email.com",
  password: "123456",
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

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

export function registerAccount(account: { name: string; email: string; password: string }): UserAccount {
  const email = normalizeEmail(account.email);
  const accounts = readAccounts();
  if (accounts.some((item) => item.email === email)) throw new Error("Este e-mail já possui uma conta.");
  const created = { name: account.name.trim(), email, password: account.password };
  writeAccounts([...accounts, created]);
  return created;
}

export function loginAccount(email: string, password: string): UserAccount {
  const account = readAccounts().find((item) => item.email === normalizeEmail(email) && item.password === password);
  if (!account) throw new Error("E-mail ou senha inválidos.");
  return account;
}

export function resetAccountPassword(email: string, password: string) {
  const normalizedEmail = normalizeEmail(email);
  const accounts = readAccounts();
  if (!accounts.some((item) => item.email === normalizedEmail)) throw new Error("Não encontramos uma conta com este e-mail.");
  writeAccounts(accounts.map((item) => item.email === normalizedEmail ? { ...item, password } : item));
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
