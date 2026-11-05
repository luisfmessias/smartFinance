import { NextResponse } from "next/server";
import { verifyLogin } from "@/server/auth/password";
import { startSession, toAccount } from "@/server/auth/session";
import { getStore } from "@/server/data";
import { ApiError, readBody, route } from "@/server/http";
import { loginSchema } from "@/server/validation";

export const POST = route(async (request) => {
  const { email, password } = await readBody(request, loginSchema);
  const user = await getStore().findUserByEmail(email);
  const valid = await verifyLogin(password, user?.passwordHash);
  if (!user || !valid) throw new ApiError(401, "E-mail ou senha inválidos.");
  await startSession(user);
  return NextResponse.json({ user: toAccount(user) });
});
