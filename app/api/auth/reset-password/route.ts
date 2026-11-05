import { NextResponse } from "next/server";
import { hashPassword, hashResetToken } from "@/server/auth/password";
import { getStore } from "@/server/data";
import { ApiError, readBody, route } from "@/server/http";
import { resetPasswordSchema } from "@/server/validation";

export const POST = route(async (request) => {
  const { token, password } = await readBody(request, resetPasswordSchema);
  const store = getStore();
  const reset = await store.takePasswordReset(hashResetToken(token));
  const user = reset && new Date(reset.expiresAt) > new Date() ? await store.findUserById(reset.userId) : null;
  if (!user) throw new ApiError(400, "Este link é inválido ou expirou. Solicite um novo.");
  await store.updateUser(user.id, { passwordHash: await hashPassword(password), sessionVersion: user.sessionVersion + 1 });
  return NextResponse.json({ ok: true });
});
