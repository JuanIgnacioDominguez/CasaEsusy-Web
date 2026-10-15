import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Cliente único de la base.
 * - Sin DATABASE_URL: archivo local `data/casa-esusy.db` (desarrollo y VPS).
 * - Con DATABASE_URL `libsql://…` + DATABASE_AUTH_TOKEN: Turso (Vercel).
 */
export const DATABASE_URL = process.env.DATABASE_URL ?? "file:data/casa-esusy.db";

const globalDb = globalThis as unknown as { __ceClient?: Client; __ceDb?: LibSQLDatabase<typeof schema> };

function crear(): LibSQLDatabase<typeof schema> {
  const client =
    globalDb.__ceClient ??
    createClient({ url: DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN });
  globalDb.__ceClient = client;
  return drizzle(client, { schema });
}

export const db: LibSQLDatabase<typeof schema> = globalDb.__ceDb ?? crear();
if (process.env.NODE_ENV !== "production") globalDb.__ceDb = db;

export { schema };
