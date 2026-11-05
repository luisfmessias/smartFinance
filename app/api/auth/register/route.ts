import { NextResponse } from "next/server";
import { hashPassword } from "@/server/auth/password";
import { startSession, toAccount } from "@/server/auth/session";
import { getStore } from "@/server/data";
import { EmailTakenError } from "@/server/data/types";
import { ApiError, readBody, route } from "@/server/http";
import { registerSchema } from "@/server/validation";

export const POST = route(async (request) => {
  const { name, email, password } = await readBody(request, registerSchema);
  const passwordHash = await hashPassword(password);
  const user = await getStore().createUser({ name, email, passwordHash }).catch((error) => {
    throw error instanceof EmailTakenError ? new ApiError(409, "Este e-mail já possui uma conta.") : error;
  });
  await startSession(user);
  return NextResponse.json({ user: toAccount(user) }, { status: 201 });
});
