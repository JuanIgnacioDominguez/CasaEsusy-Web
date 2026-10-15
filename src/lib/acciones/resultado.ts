import { ZodError } from "zod";

export type Resultado<T = undefined> = { ok: true; datos?: T; mensaje?: string } | { ok: false; error: string };

export const ok = <T>(datos?: T, mensaje?: string): Resultado<T> => ({ ok: true, datos, mensaje });

export function fallo(e: unknown): { ok: false; error: string } {
  if (e instanceof ZodError) return { ok: false, error: e.issues[0]?.message ?? "Datos inválidos" };
  if (e instanceof Error && /UNIQUE constraint failed/.test(e.message)) return { ok: false, error: "Ya existe un registro con ese valor." };
  // Las redirecciones de Next viajan como errores: hay que relanzarlas.
  if (e && typeof e === "object" && "digest" in e && String((e as { digest: unknown }).digest).startsWith("NEXT_")) throw e;
  console.error(e);
  return { ok: false, error: e instanceof Error ? e.message : "Error inesperado" };
}
