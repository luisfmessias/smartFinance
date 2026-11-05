import { NextResponse } from "next/server";
import { createResetToken } from "@/server/auth/password";
import { getStore } from "@/server/data";
import { readBody, route } from "@/server/http";
import { assertMailAvailable, sendPasswordResetEmail } from "@/server/mail";
import { forgotPasswordSchema } from "@/server/validation";

const TOKEN_LIFETIME_MS = 60 * 60 * 1000;

export const POST = route(async (request) => {
  assertMailAvailable();
  const { email } = await readBody(request, forgotPasswordSchema);
  const store = getStore();
  const user = await store.findUserByEmail(email);
  if (user) {
    const { token, tokenHash } = createResetToken();
    await store.savePasswordReset({ userId: user.id, tokenHash, expiresAt: new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString() });
    // APP_URL em vez do cabeçalho Host, que pode ser forjado para desviar o link.
    const baseUrl = process.env.APP_URL ?? request.nextUrl.origin;
    await sendPasswordResetEmail(user.email, `${baseUrl}/?reset=${token}`);
  }
  // A resposta é a mesma com ou sem conta, para não revelar quais e-mails existem.
  return NextResponse.json({ ok: true });
});
