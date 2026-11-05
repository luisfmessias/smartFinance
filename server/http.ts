import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function route<Context>(handler: (request: NextRequest, context: Context) => Promise<Response>) {
  return async (request: NextRequest, context: Context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
      console.error(`[api] ${request.method} ${request.nextUrl.pathname}`, error);
      return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
    }
  };
}

export async function readBody<Schema extends z.ZodType>(request: NextRequest, schema: Schema): Promise<z.output<Schema>> {
  const body: unknown = await request.json().catch(() => {
    throw new ApiError(400, "Corpo da requisição inválido.");
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos.");
  return parsed.data;
}
