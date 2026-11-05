import "server-only";
import { ApiError } from "@/server/http";

/** Sem provedor de e-mail ainda: em desenvolvimento o link sai no terminal do servidor. */
export function assertMailAvailable() {
  if (process.env.NODE_ENV === "production") throw new ApiError(503, "A recuperação de senha ainda não está disponível.");
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  console.info(`[mail] Redefinição de senha para ${to}: ${resetUrl}`);
}
