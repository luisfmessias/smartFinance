import { NextResponse } from "next/server";
import { getStore } from "@/server/data";
import { ApiError, route } from "@/server/http";

export const GET = route(async () => {
  await getStore().ping().catch((error) => {
    console.error("[api] banco indisponível", error);
    throw new ApiError(503, "Banco de dados indisponível.");
  });
  return NextResponse.json({ status: "ok" });
});
