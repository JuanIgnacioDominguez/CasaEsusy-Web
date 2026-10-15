import "server-only";
import { cache } from "react";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const getServicios = cache(() =>
  db.select().from(schema.servicios).where(eq(schema.servicios.publicado, true)).orderBy(asc(schema.servicios.orden)),
);

export const getServicio = cache(async (slug: string) => {
  const [s] = await db
    .select()
    .from(schema.servicios)
    .where(and(eq(schema.servicios.slug, slug), eq(schema.servicios.publicado, true)));
  return s ?? null;
});

export const getProyectos = cache(() =>
  db
    .select()
    .from(schema.proyectos)
    .where(eq(schema.proyectos.publicado, true))
    .orderBy(desc(schema.proyectos.destacado), asc(schema.proyectos.orden)),
);

export const getResenas = cache(() =>
  db
    .select()
    .from(schema.resenas)
    .where(eq(schema.resenas.visible, true))
    .orderBy(desc(schema.resenas.destacada), desc(schema.resenas.creado)),
);

export const getPreguntas = cache(() =>
  db
    .select()
    .from(schema.preguntas)
    .where(eq(schema.preguntas.publicada, true))
    .orderBy(asc(schema.preguntas.orden)),
);

export const getSeoPagina = cache(async (ruta: string) => {
  const [s] = await db.select().from(schema.seoPaginas).where(eq(schema.seoPaginas.ruta, ruta));
  return s ?? null;
});

export async function buscarRedireccion(ruta: string) {
  const [r] = await db.select().from(schema.redirecciones).where(eq(schema.redirecciones.desde, ruta));
  if (r) {
    await db
      .update(schema.redirecciones)
      .set({ visitas: r.visitas + 1 })
      .where(eq(schema.redirecciones.id, r.id));
  }
  return r ?? null;
}
