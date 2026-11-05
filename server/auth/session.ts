import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { getStore } from "@/server/data";
import type { UserRecord } from "@/server/data/types";
import { ApiError } from "@/server/http";
import type { UserAccount } from "@/types";

const COOKIE_NAME = "sf_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET precisa estar definido com pelo menos 32 caracteres.");
  return new TextEncoder().encode(secret);
}

export const toAccount = ({ id, name, email }: UserRecord): UserAccount => ({ id, name, email });

export async function startSession(user: UserRecord) {
  const token = await new SignJWT({ version: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecret());
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<UserRecord | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const secret = getSecret();
  const payload = await jwtVerify(token, secret, { algorithms: ["HS256"] }).then((result) => result.payload, () => null);
  if (!payload?.sub) return null;
  const user = await getStore().findUserById(payload.sub);
  return user && user.sessionVersion === payload.version ? user : null;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new ApiError(401, "Sua sessão expirou. Entre novamente.");
  return user;
}

/** Derruba todas as sessões do usuário e mantém apenas a da requisição atual. */
export async function rotateSessions(user: UserRecord, update: { passwordHash?: string } = {}) {
  const updated = await getStore().updateUser(user.id, { ...update, sessionVersion: user.sessionVersion + 1 });
  if (!updated) throw new ApiError(401, "Sua sessão expirou. Entre novamente.");
  await startSession(updated);
}
