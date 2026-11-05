import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const deriveKey = promisify(scrypt) as (password: string, salt: Buffer, length: number) => Promise<Buffer>;
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [, salt, key] = stored.split("$");
  const expected = Buffer.from(key, "base64");
  const actual = await deriveKey(password, Buffer.from(salt, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

// Compara contra um hash descartável quando o e-mail não existe, para que o tempo
// de resposta do login não revele quais e-mails têm conta.
const decoyHash = hashPassword(randomBytes(16).toString("hex"));

export async function verifyLogin(password: string, stored: string | undefined) {
  const matches = await verifyPassword(password, stored ?? await decoyHash);
  return Boolean(stored) && matches;
}

export function createResetToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashResetToken(token) };
}

export const hashResetToken = (token: string) => createHash("sha256").update(token).digest("hex");
