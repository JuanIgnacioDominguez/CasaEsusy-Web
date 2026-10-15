"use server";

import { revalidatePath } from "next/cache";
import { eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { registrar } from "@/lib/actividad";
import { guardarAjuste } from "@/lib/ajustes";
import { AJUSTES, type ClaveAjuste, type ValorAjuste } from "@/lib/ajustes/esquemas";
import { requerirUsuario } from "@/lib/auth/sesion";
import { db, schema } from "@/lib/db";
import { fallo, ok, type Resultado } from "./resultado";

const CONTENIDO = ["contenido"] as const;

/** Las páginas públicas son estáticas: al editar contenido se regeneran todas. */
const refrescarSitio = () => revalidatePath("/", "layout");

const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede tener minúsculas, números y guiones (sin acentos)");

/* ───────────── Servicios ───────────── */

const servicioSchema = z.object({
  slug: slugSchema,
  nombre: z.string().trim().min(2).max(60),
  titulo: z.string().trim().min(5).max(90),
  bajada: z.string().trim().min(10).max(220),
  descripcion: z.string().max(6000),
  imagen: z.string().min(1, "Elegí una imagen"),
  tipos: z.array(z.object({ nombre: z.string().trim().min(1), descripcion: z.string().trim() })).max(20),
  preguntas: z.array(z.object({ pregunta: z.string().trim().min(1), respuesta: z.string().trim().min(1) })).max(30),
  mensajeWhatsApp: z.string().max(300),
  publicado: z.boolean(),
});

export async function guardarServicio(id: string, datos: z.input<typeof servicioSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    const d = servicioSchema.parse(datos);
    const [anterior] = await db.select({ slug: schema.servicios.slug }).from(schema.servicios).where(eq(schema.servicios.id, id));
    await db.update(schema.servicios).set(d).where(eq(schema.servicios.id, id));
    // Si cambia la URL, se crea la redirección 301 automáticamente.
    if (anterior && anterior.slug !== d.slug) {
      await db
        .insert(schema.redirecciones)
        .values({ desde: `/${anterior.slug}`, hacia: `/${d.slug}`, codigo: 301 })
        .onConflictDoUpdate({ target: schema.redirecciones.desde, set: { hacia: `/${d.slug}` } });
      await db.update(schema.seoPaginas).set({ ruta: `/${d.slug}` }).where(eq(schema.seoPaginas.ruta, `/${anterior.slug}`));
    }
    await registrar(usuario, "editó", "servicio", id, d.nombre);
    refrescarSitio();
    return ok(undefined, anterior && anterior.slug !== d.slug ? "Guardado. Creamos una redirección 301 desde la URL anterior." : "Servicio guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function ordenarServicios(ids: string[]): Promise<Resultado> {
  try {
    await requerirUsuario([...CONTENIDO]);
    await db.transaction(async (tx) => {
      for (const [orden, id] of ids.entries()) await tx.update(schema.servicios).set({ orden }).where(eq(schema.servicios.id, id));
    });
    refrescarSitio();
    return ok(undefined, "Orden actualizado");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Trabajos (portfolio) ───────────── */

const proyectoSchema = z.object({
  id: z.string().optional(),
  titulo: z.string().trim().min(2).max(120),
  servicio: z.string().min(1),
  ubicacion: z.string().max(120).default(""),
  descripcion: z.string().max(2000).default(""),
  imagen: z.string().min(1, "Elegí una imagen"),
  destacado: z.boolean().default(false),
  publicado: z.boolean().default(true),
});

export async function guardarProyecto(datos: z.input<typeof proyectoSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    const { id, ...d } = proyectoSchema.parse(datos);
    if (id) await db.update(schema.proyectos).set(d).where(eq(schema.proyectos.id, id));
    else {
      const [{ max } = { max: 0 }] = await db.select({ max: sql<number>`coalesce(max(${schema.proyectos.orden}),0)` }).from(schema.proyectos);
      await db.insert(schema.proyectos).values({ ...d, orden: max + 1 });
    }
    await registrar(usuario, id ? "editó" : "agregó", "trabajo", id ?? null, d.titulo);
    refrescarSitio();
    return ok(undefined, "Trabajo guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarProyecto(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    await db.delete(schema.proyectos).where(eq(schema.proyectos.id, id));
    await registrar(usuario, "eliminó", "trabajo", id);
    refrescarSitio();
    return ok(undefined, "Trabajo eliminado");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Reseñas ───────────── */

const resenaSchema = z.object({
  id: z.string().optional(),
  autor: z.string().trim().min(1).max(80),
  puntaje: z.number().int().min(1).max(5),
  texto: z.string().trim().min(3).max(1500),
  fecha: z.string().max(40).default(""),
  origen: z.string().max(40).default("Google"),
  destacada: z.boolean().default(false),
  visible: z.boolean().default(true),
});

export async function guardarResena(datos: z.input<typeof resenaSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    const { id, ...d } = resenaSchema.parse(datos);
    if (id) await db.update(schema.resenas).set(d).where(eq(schema.resenas.id, id));
    else await db.insert(schema.resenas).values(d);
    await registrar(usuario, id ? "editó" : "agregó", "reseña", id ?? null, d.autor);
    refrescarSitio();
    return ok(undefined, "Reseña guardada");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarResena(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    await db.delete(schema.resenas).where(eq(schema.resenas.id, id));
    await registrar(usuario, "eliminó", "reseña", id);
    refrescarSitio();
    return ok(undefined, "Reseña eliminada");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Preguntas frecuentes ───────────── */

const preguntaSchema = z.object({
  id: z.string().optional(),
  pregunta: z.string().trim().min(5).max(200),
  respuesta: z.string().trim().min(2).max(2000),
  grupo: z.string().trim().min(1).max(60),
  publicada: z.boolean().default(true),
});

export async function guardarPregunta(datos: z.input<typeof preguntaSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    const { id, ...d } = preguntaSchema.parse(datos);
    if (id) await db.update(schema.preguntas).set(d).where(eq(schema.preguntas.id, id));
    else {
      const [{ max } = { max: 0 }] = await db.select({ max: sql<number>`coalesce(max(${schema.preguntas.orden}),0)` }).from(schema.preguntas);
      await db.insert(schema.preguntas).values({ ...d, orden: max + 1 });
    }
    await registrar(usuario, id ? "editó" : "agregó", "pregunta", id ?? null, d.pregunta);
    refrescarSitio();
    return ok(undefined, "Pregunta guardada");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarPregunta(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    await db.delete(schema.preguntas).where(eq(schema.preguntas.id, id));
    await registrar(usuario, "eliminó", "pregunta", id);
    refrescarSitio();
    return ok(undefined, "Pregunta eliminada");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Lista de precios ───────────── */

const precioSchema = z.object({
  id: z.string().optional(),
  categoria: z.string().trim().min(1).max(60),
  nombre: z.string().trim().min(1).max(120),
  unidad: z.string().trim().min(1).max(12),
  precio: z.number().min(0),
  notas: z.string().max(300).default(""),
  activo: z.boolean().default(true),
});

export async function guardarPrecio(datos: z.input<typeof precioSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(["ventas"]);
    const { id, ...d } = precioSchema.parse(datos);
    if (id) await db.update(schema.precios).set(d).where(eq(schema.precios.id, id));
    else await db.insert(schema.precios).values(d);
    await registrar(usuario, id ? "editó" : "agregó", "precio", id ?? null, `${d.nombre}: ${d.precio}`);
    revalidatePath("/admin/precios");
    return ok(undefined, "Precio guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarPrecio(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(["ventas"]);
    await db.delete(schema.precios).where(eq(schema.precios.id, id));
    await registrar(usuario, "eliminó", "precio", id);
    revalidatePath("/admin/precios");
    return ok(undefined, "Precio eliminado");
  } catch (e) {
    return fallo(e);
  }
}

/** Actualización masiva por porcentaje (clave con inflación). Redondea a la centena. */
export async function ajustarPrecios(ids: string[], porcentaje: number): Promise<Resultado<{ n: number }>> {
  try {
    const usuario = await requerirUsuario(["ventas"]);
    const pct = z.number().min(-90).max(500).parse(porcentaje);
    if (!ids.length) return { ok: false, error: "Elegí al menos un precio" };
    await db
      .update(schema.precios)
      .set({ precio: sql`round(${schema.precios.precio} * ${1 + pct / 100} / 100) * 100`, actualizado: new Date().toISOString() })
      .where(inArray(schema.precios.id, ids));
    await registrar(usuario, `ajustó ${pct > 0 ? "+" : ""}${pct}%`, "precios", null, `${ids.length} precios`);
    revalidatePath("/admin/precios");
    return ok({ n: ids.length }, `${ids.length} precios actualizados`);
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── SEO ───────────── */

const seoPaginaSchema = z.object({
  ruta: z.string().startsWith("/"),
  titulo: z.string().max(120),
  descripcion: z.string().max(320),
  imagen: z.string().max(500),
  noindex: z.boolean(),
});

export async function guardarSeoPagina(datos: z.input<typeof seoPaginaSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    const d = seoPaginaSchema.parse(datos);
    const valores = { titulo: d.titulo || null, descripcion: d.descripcion || null, imagen: d.imagen || null, noindex: d.noindex };
    await db
      .insert(schema.seoPaginas)
      .values({ ruta: d.ruta, ...valores })
      .onConflictDoUpdate({ target: schema.seoPaginas.ruta, set: { ...valores, actualizado: new Date().toISOString() } });
    await registrar(usuario, "editó SEO de", "página", d.ruta, d.titulo);
    refrescarSitio();
    return ok(undefined, "SEO guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function restablecerSeoPagina(ruta: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    await db.delete(schema.seoPaginas).where(eq(schema.seoPaginas.ruta, ruta));
    await registrar(usuario, "restableció SEO de", "página", ruta);
    refrescarSitio();
    return ok(undefined, "Volvió a los textos automáticos");
  } catch (e) {
    return fallo(e);
  }
}

const redireccionSchema = z.object({
  id: z.string().optional(),
  desde: z
    .string()
    .trim()
    .startsWith("/", "Tiene que empezar con /")
    .refine((r) => !r.startsWith("/admin"), "No se puede redirigir el panel"),
  hacia: z.string().trim().min(1),
  codigo: z.union([z.literal(301), z.literal(302)]),
});

export async function guardarRedireccion(datos: z.input<typeof redireccionSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    const { id, ...d } = redireccionSchema.parse(datos);
    if (d.desde === d.hacia) return { ok: false, error: "El origen y el destino son iguales" };
    if (id) await db.update(schema.redirecciones).set(d).where(eq(schema.redirecciones.id, id));
    else await db.insert(schema.redirecciones).values(d);
    await registrar(usuario, id ? "editó" : "creó", "redirección", id ?? null, `${d.desde} → ${d.hacia}`);
    revalidatePath("/admin/seo", "layout");
    return ok(undefined, "Redirección guardada");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarRedireccion(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...CONTENIDO]);
    await db.delete(schema.redirecciones).where(eq(schema.redirecciones.id, id));
    await registrar(usuario, "eliminó", "redirección", id);
    revalidatePath("/admin/seo", "layout");
    return ok(undefined, "Redirección eliminada");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Ajustes generales ───────────── */

export async function guardarAjustes<K extends ClaveAjuste>(clave: K, valor: ValorAjuste<K>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(clave === "presupuestos" ? ["ventas"] : [...CONTENIDO]);
    const parsed = AJUSTES[clave].schema.safeParse(valor);
    if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
    await guardarAjuste(clave, parsed.data as ValorAjuste<K>);
    await registrar(usuario, "actualizó", "ajustes", clave);
    refrescarSitio();
    return ok(undefined, "Cambios guardados");
  } catch (e) {
    return fallo(e);
  }
}
