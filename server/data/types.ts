import type { Expense, ExpenseInput, UserAccount, UserPreferences } from "@/types";

export interface UserRecord extends UserAccount {
  passwordHash: string;
  /** Incrementado para invalidar todas as sessões já emitidas para o usuário. */
  sessionVersion: number;
}

export type NewUser = Pick<UserRecord, "name" | "email" | "passwordHash">;
export type UserUpdate = Partial<Pick<UserRecord, "name" | "email" | "passwordHash" | "sessionVersion">>;

export interface PasswordResetRecord {
  userId: string;
  tokenHash: string;
  expiresAt: string;
}

export class EmailTakenError extends Error {}

/**
 * Contrato de persistência da aplicação. As rotas só falam com esta interface,
 * então trocar o armazenamento significa apenas criar outra implementação.
 * Toda operação de gasto recebe o userId: um usuário nunca alcança dados de outro.
 */
export interface DataStore {
  /** Falha se o banco não estiver acessível. */
  ping(): Promise<void>;

  findUserById(id: string): Promise<UserRecord | null>;
  findUserByEmail(email: string): Promise<UserRecord | null>;
  /** Lança EmailTakenError se o e-mail já estiver em uso. */
  createUser(user: NewUser): Promise<UserRecord>;
  /** Lança EmailTakenError se o e-mail já estiver em uso. */
  updateUser(id: string, update: UserUpdate): Promise<UserRecord | null>;

  /** Ordenados do mais recente para o mais antigo. */
  listExpenses(userId: string): Promise<Expense[]>;
  createExpense(userId: string, expense: ExpenseInput): Promise<Expense>;
  updateExpense(userId: string, id: string, expense: ExpenseInput): Promise<Expense | null>;
  deleteExpense(userId: string, id: string): Promise<boolean>;

  getPreferences(userId: string): Promise<UserPreferences | null>;
  savePreferences(userId: string, preferences: UserPreferences): Promise<UserPreferences>;

  /** Substitui qualquer token anterior do mesmo usuário. */
  savePasswordReset(reset: PasswordResetRecord): Promise<void>;
  /** Remove o token e o retorna, garantindo uso único. */
  takePasswordReset(tokenHash: string): Promise<PasswordResetRecord | null>;
}
