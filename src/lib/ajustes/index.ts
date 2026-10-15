import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { AJUSTES, type ClaveAjuste, type ValorAjuste } from "./esquemas";

/** Lee un ajuste y lo completa con los valores por defecto (tolera campos nuevos). */
export const getAjuste = cache(async <K extends ClaveAjuste>(clave: K): Promise<ValorAjuste<K>> => {
  const { schema: esquema, defecto } = AJUSTES[clave];
  const [fila] = await db.select().from(schema.ajustes).where(eq(schema.ajustes.clave, clave));
  if (!fila) return defecto as ValorAjuste<K>;
  const combinado = { ...defecto, ...(fila.valor as object) };
  const parsed = esquema.safeParse(combinado);
  return (parsed.success ? parsed.data : defecto) as ValorAjuste<K>;
});

export async function guardarAjuste<K extends ClaveAjuste>(clave: K, valor: ValorAjuste<K>): Promise<void> {
  const limpio = AJUSTES[clave].schema.parse(valor);
  await db
    .insert(schema.ajustes)
    .values({ clave, valor: limpio })
    .onConflictDoUpdate({ target: schema.ajustes.clave, set: { valor: limpio, actualizado: new Date().toISOString() } });
}

export * from "./esquemas";
