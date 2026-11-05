import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { getStore } from "@/server/data";
import { ApiError, readBody, route } from "@/server/http";
import { expenseSchema } from "@/server/validation";

type Context = { params: Promise<{ id: string }> };

export const PATCH = route<Context>(async (request, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const input = await readBody(request, expenseSchema);
  const expense = await getStore().updateExpense(user.id, id, input);
  if (!expense) throw new ApiError(404, "Gasto não encontrado.");
  return NextResponse.json({ expense });
});

export const DELETE = route<Context>(async (_request, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  if (!await getStore().deleteExpense(user.id, id)) throw new ApiError(404, "Gasto não encontrado.");
  return NextResponse.json({ ok: true });
});
