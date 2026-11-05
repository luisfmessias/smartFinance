import { NextResponse } from "next/server";
import { requireUser, rotateSessions } from "@/server/auth/session";
import { route } from "@/server/http";

export const POST = route(async () => {
  await rotateSessions(await requireUser());
  return NextResponse.json({ ok: true });
});
