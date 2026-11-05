import { NextResponse } from "next/server";
import { defaultPreferences } from "@/lib/preferences";
import { requireUser } from "@/server/auth/session";
import { getStore } from "@/server/data";
import { readBody, route } from "@/server/http";
import { preferencesSchema } from "@/server/validation";

export const GET = route(async () => {
  const user = await requireUser();
  const preferences = await getStore().getPreferences(user.id);
  return NextResponse.json({ preferences: preferences ?? defaultPreferences });
});

export const PUT = route(async (request) => {
  const user = await requireUser();
  const preferences = await readBody(request, preferencesSchema);
  return NextResponse.json({ preferences: await getStore().savePreferences(user.id, preferences) });
});
