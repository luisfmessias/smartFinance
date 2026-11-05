import { NextResponse } from "next/server";
import { requireUser, toAccount } from "@/server/auth/session";
import { getStore } from "@/server/data";
import { EmailTakenError } from "@/server/data/types";
import { ApiError, readBody, route } from "@/server/http";
import { updateAccountSchema } from "@/server/validation";

export const PATCH = route(async (request) => {
  const user = await requireUser();
  const update = await readBody(request, updateAccountSchema);
  const updated = await getStore().updateUser(user.id, update).catch((error) => {
    throw error instanceof EmailTakenError ? new ApiError(409, "Este e-mail já está em uso.") : error;
  });
  if (!updated) throw new ApiError(404, "Conta não encontrada.");
  return NextResponse.json({ user: toAccount(updated) });
});
