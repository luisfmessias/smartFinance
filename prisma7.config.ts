import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrações usam a conexão direta. A aplicação usa a conexão com pool (DATABASE_URL).
  // O valor vazio deixa o `prisma generate` rodar em um clone novo, sem .env.local.
  datasource: { url: process.env.DATABASE_URL_UNPOOLED ?? "" },
});
