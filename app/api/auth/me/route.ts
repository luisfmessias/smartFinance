import { NextResponse } from "next/server";
import { getSessionUser, toAccount } from "@/server/auth/session";
import { route } from "@/server/http";

export const GET = route(async () => {
  const user = await getSessionUser();
  return NextResponse.json({ user: user ? toAccount(user) : null });
});
