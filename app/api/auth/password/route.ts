import { NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { requireUser, rotateSessions } from "@/server/auth/session";
import { ApiError, readBody, route } from "@/server/http";
import { changePasswordSchema } from "@/server/validation";

export const POST = route(async (request) => {
  const user = await requireUser();
  const { currentPassword, newPassword } = await readBody(request, changePasswordSchema);
  if (!await verifyPassword(currentPassword, user.passwordHash)) throw new ApiError(400, "A senha atual está incorreta.");
  await rotateSessions(user, { passwordHash: await hashPassword(newPassword) });
  return NextResponse.json({ ok: true });
});
