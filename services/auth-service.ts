import { api } from "@/services/api-client";
import type { UserAccount } from "@/types";

type AccountResponse = { user: UserAccount };

export const getCurrentAccount = () => api<{ user: UserAccount | null }>("/auth/me").then(({ user }) => user);

export const registerAccount = (body: { name: string; email: string; password: string }) =>
  api<AccountResponse>("/auth/register", { method: "POST", body }).then(({ user }) => user);

export const loginAccount = (email: string, password: string) =>
  api<AccountResponse>("/auth/login", { method: "POST", body: { email, password } }).then(({ user }) => user);

export const logoutAccount = () => api("/auth/logout", { method: "POST" });
export const logoutOtherSessions = () => api("/auth/logout-all", { method: "POST" });

export const requestPasswordReset = (email: string) => api("/auth/forgot-password", { method: "POST", body: { email } });
export const resetPassword = (token: string, password: string) => api("/auth/reset-password", { method: "POST", body: { token, password } });
export const changePassword = (currentPassword: string, newPassword: string) =>
  api("/auth/password", { method: "POST", body: { currentPassword, newPassword } });

export const updateAccount = (body: Pick<UserAccount, "name" | "email">) =>
  api<AccountResponse>("/account", { method: "PATCH", body }).then(({ user }) => user);
