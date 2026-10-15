"use server";

import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { registrar } from "@/lib/actividad";
import { requerirUsuario } from "@/lib/auth/sesion";
import { db, schema } from "@/lib/db";
import { DIR_SUBIDAS } from "@/lib/medios";
import { fallo, ok, type Resultado } from "./resultado";

const refrescar = () => revalidatePath("/", "layout");
const MAX_PDF = 40 * 1024 * 1024;

/* ───────────── Marcas ───────────── */

const marcaSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(2, "Ingresá el nombre").max(60),
  rubro: z.string().trim().max(60).default(""),
  descripcion: z.string().trim().max(300).default(""),
  logo: z.string().max(500).default(""),
  sitioWeb: z.union([z.literal(""), z.url("Revisá el link (tiene que empezar con https://)")]).default(""),
  publicada: z.boolean().default(true),
});

export async function guardarMarca(datos: z.input<typeof marcaSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(["contenido"]);
    const { id, ...d } = marcaSchema.parse(datos);
    if (id) await db.update(schema.marcas).set(d).where(eq(schema.marcas.id, id));
    else {
      const [{ max } = { max: 0 }] = await db.select({ max: sql<number>`coalesce(max(${schema.marcas.orden}),0)` }).from(schema.marcas);
      await db.insert(schema.marcas).values({ ...d, orden: max + 1 });
    }
    await registrar(usuario, id ? "editó" : "agregó", "marca", id ?? null, d.nombre);
    refrescar();
    return ok(undefined, "Marca guardada");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarMarca(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(["contenido"]);
    await db.delete(schema.marcas).where(eq(schema.marcas.id, id));
    await registrar(usuario, "eliminó", "marca", id);
    refrescar();
    return ok(undefined, "Marca eliminada");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Catálogos ───────────── */

const catalogoSchema = z
  .object({
    id: z.string().optional(),
    titulo: z.string().trim().min(2, "Ingresá un título").max(120),
    descripcion: z.string().trim().max(600).default(""),
    categoria: z.string().trim().min(1).max(60),
    marcaId: z.string().nullable().default(null),
    tipo: z.enum(["pdf", "imagenes", "enlace"]),
    archivo: z.string().max(500).default(""),
    enlace: z.union([z.literal(""), z.url("Revisá el link (tiene que empezar con https://)")]).default(""),
    portada: z.string().max(500).default(""),
    imagenes: z.array(z.string().max(500)).max(80).default([]),
    destacado: z.boolean().default(false),
    publicado: z.boolean().default(true),
  })
  .refine((c) => c.tipo !== "pdf" || c.archivo, { message: "Subí el PDF del catálogo" })
  .refine((c) => c.tipo !== "enlace" || c.enlace, { message: "Pegá el link del catálogo online" })
  .refine((c) => c.tipo !== "imagenes" || c.imagenes.length > 0, { message: "Agregá al menos una imagen" });

export async function guardarCatalogo(datos: z.input<typeof catalogoSchema>): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(["contenido"]);
    const { id, ...d } = catalogoSchema.parse(datos);
    const valores = { ...d, portada: d.portada || d.imagenes[0] || "" };
    if (id) await db.update(schema.catalogos).set(valores).where(eq(schema.catalogos.id, id));
    else {
      const [{ max } = { max: 0 }] = await db.select({ max: sql<number>`coalesce(max(${schema.catalogos.orden}),0)` }).from(schema.catalogos);
      await db.insert(schema.catalogos).values({ ...valores, orden: max + 1 });
    }
    await registrar(usuario, id ? "editó" : "publicó", "catálogo", id ?? null, d.titulo);
    refrescar();
    return ok(undefined, "Catálogo guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarCatalogo(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(["contenido"]);
    await db.delete(schema.catalogos).where(eq(schema.catalogos.id, id));
    await registrar(usuario, "eliminó", "catálogo", id);
    refrescar();
    return ok(undefined, "Catálogo eliminado");
  } catch (e) {
    return fallo(e);
  }
}

/** Sube el PDF de un catálogo (hasta 40 MB). Valida la firma del archivo, no solo la extensión. */
export async function subirPdfCatalogo(form: FormData): Promise<Resultado<{ url: string; nombre: string }>> {
  try {
    await requerirUsuario(["contenido"]);
    const archivo = form.get("archivo");
    if (!(archivo instanceof File) || archivo.size === 0) return { ok: false, error: "Elegí un archivo PDF" };
    if (archivo.size > MAX_PDF) return { ok: false, error: "El PDF supera los 40 MB. Probá comprimirlo." };
    const datos = Buffer.from(await archivo.arrayBuffer());
    if (datos.subarray(0, 5).toString("latin1") !== "%PDF-") return { ok: false, error: "El archivo no es un PDF válido" };
    const base = archivo.name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\.pdf$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "catalogo";
    const carpeta = join(DIR_SUBIDAS, "catalogos");
    await mkdir(carpeta, { recursive: true });
    const nombre = `${base}-${randomBytes(3).toString("hex")}.pdf`;
    await writeFile(join(carpeta, nombre), datos);
    return ok({ url: `/media/catalogos/${nombre}`, nombre: archivo.name });
  } catch (e) {
    return fallo(e);
  }
}
