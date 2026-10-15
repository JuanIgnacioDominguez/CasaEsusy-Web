"use server";

import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { registrar } from "@/lib/actividad";
import { requerirUsuario } from "@/lib/auth/sesion";
import { db, schema } from "@/lib/db";
import type { Medio } from "@/lib/db/schema";
import { DIR_SUBIDAS } from "@/lib/medios";
import { fallo, ok, type Resultado } from "./resultado";

const TIPOS = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_BYTES = 12 * 1024 * 1024;

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "imagen";

/**
 * Sube imágenes: valida tipo y tamaño, corrige rotación, quita metadatos (EXIF con ubicación),
 * redimensiona a 2400 px y guarda en WebP con nombre descriptivo.
 */
export async function subirMedios(form: FormData): Promise<Resultado<Medio[]>> {
  try {
    const usuario = await requerirUsuario(["contenido"]);
    const archivos = form.getAll("archivos").filter((f): f is File => f instanceof File && f.size > 0);
    if (!archivos.length) return { ok: false, error: "Elegí al menos una imagen" };
    const anio = String(new Date().getFullYear());
    const carpeta = join(DIR_SUBIDAS, anio);
    await mkdir(carpeta, { recursive: true });
    const subidos: Medio[] = [];
    for (const archivo of archivos) {
      if (!TIPOS.has(archivo.type)) return { ok: false, error: `${archivo.name}: formato no permitido (usá JPG, PNG o WebP)` };
      if (archivo.size > MAX_BYTES) return { ok: false, error: `${archivo.name}: supera los 12 MB` };
      const entrada = Buffer.from(await archivo.arrayBuffer());
      const { data, info } = await sharp(entrada)
        .rotate()
        .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
      const nombre = `${slug(archivo.name)}-${randomBytes(3).toString("hex")}.webp`;
      await writeFile(join(carpeta, nombre), data);
      const [medio] = await db
        .insert(schema.medios)
        .values({
          nombre: archivo.name,
          url: `/media/${anio}/${nombre}`,
          alt: slug(archivo.name).replaceAll("-", " "),
          ancho: info.width,
          alto: info.height,
          peso: info.size,
          tipo: "image/webp",
        })
        .returning();
      subidos.push(medio!);
    }
    await registrar(usuario, "subió", "medios", null, `${subidos.length} imágenes`);
    revalidatePath("/admin/medios");
    return ok(subidos, subidos.length === 1 ? "Imagen subida" : `${subidos.length} imágenes subidas`);
  } catch (e) {
    return fallo(e);
  }
}

export async function actualizarAlt(id: string, alt: string): Promise<Resultado> {
  try {
    await requerirUsuario(["contenido"]);
    await db.update(schema.medios).set({ alt: alt.slice(0, 200) }).where(eq(schema.medios.id, id));
    revalidatePath("/admin/medios");
    return ok(undefined, "Texto alternativo guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarMedio(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario(["contenido"]);
    const [m] = await db.select().from(schema.medios).where(eq(schema.medios.id, id));
    if (!m) return { ok: false, error: "No existe" };
    await db.delete(schema.medios).where(eq(schema.medios.id, id));
    if (m.url.startsWith("/media/")) await unlink(join(DIR_SUBIDAS, m.url.slice("/media/".length))).catch(() => undefined);
    await registrar(usuario, "eliminó", "imagen", id, m.nombre);
    revalidatePath("/admin/medios");
    return ok(undefined, "Imagen eliminada");
  } catch (e) {
    return fallo(e);
  }
}
