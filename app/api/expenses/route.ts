import { NextResponse } from "next/server";
import { requireUser } from "@/server/auth/session";
import { getStore } from "@/server/data";
import { readBody, route } from "@/server/http";
import { expenseSchema } from "@/server/validation";

export const GET = route(async () => {
  const user = await requireUser();
  return NextResponse.json({ expenses: await getStore().listExpenses(user.id) });
});

export const POST = route(async (request) => {
  const user = await requireUser();
  const expense = await readBody(request, expenseSchema);
  return NextResponse.json({ expense: await getStore().createExpense(user.id, expense) }, { status: 201 });
});
