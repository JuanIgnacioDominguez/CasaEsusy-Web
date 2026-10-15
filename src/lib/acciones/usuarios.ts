"use server";

import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";
import { registrar } from "@/lib/actividad";
import { hashearClave, verificarClave } from "@/lib/auth/clave";
import { requerirUsuario } from "@/lib/auth/sesion";
import { db, schema } from "@/lib/db";
import { fallo, ok, type Resultado } from "./resultado";

const claveSchema = z.string().min(10, "La contraseña tiene que tener al menos 10 caracteres").max(200);

const usuarioSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(2).max(80),
  email: z.email("Email inválido").transform((e) => e.toLowerCase()),
  rol: z.enum(["admin", "ventas", "contenido"]),
  activo: z.boolean(),
  clave: z.string().optional(),
});

export async function guardarUsuario(datos: z.input<typeof usuarioSchema>): Promise<Resultado> {
  try {
    const actual = await requerirUsuario(["admin"]);
    const { id, clave, ...d } = usuarioSchema.parse(datos);
    if (id) {
      if (id === actual.id && (!d.activo || d.rol !== "admin")) return { ok: false, error: "No podés quitarte tu propio acceso de administración" };
      await db
        .update(schema.usuarios)
        .set({ ...d, ...(clave ? { hash: await hashearClave(claveSchema.parse(clave)) } : {}) })
        .where(eq(schema.usuarios.id, id));
      if (!d.activo) await db.delete(schema.sesiones).where(eq(schema.sesiones.usuarioId, id));
    } else {
      const hash = await hashearClave(claveSchema.parse(clave ?? ""));
      await db.insert(schema.usuarios).values({ ...d, hash });
    }
    await registrar(actual, id ? "editó" : "creó", "usuario", id ?? null, d.email);
    revalidatePath("/admin/usuarios");
    return ok(undefined, "Usuario guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function cambiarMiClave(actualClave: string, nueva: string): Promise<Resultado> {
  try {
    const yo = await requerirUsuario();
    const [u] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.id, yo.id));
    if (!u || !(await verificarClave(actualClave, u.hash))) return { ok: false, error: "La contraseña actual no es correcta" };
    await db.update(schema.usuarios).set({ hash: await hashearClave(claveSchema.parse(nueva)) }).where(eq(schema.usuarios.id, yo.id));
    // Cierra las demás sesiones abiertas.
    const { cookies } = await import("next/headers");
    const { createHash } = await import("node:crypto");
    const token = (await cookies()).get("ce_sesion")?.value ?? "";
    await db
      .delete(schema.sesiones)
      .where(and(eq(schema.sesiones.usuarioId, yo.id), ne(schema.sesiones.id, createHash("sha256").update(token).digest("hex"))));
    await registrar(yo, "cambió su contraseña", "usuario", yo.id);
    return ok(undefined, "Contraseña actualizada");
  } catch (e) {
    return fallo(e);
  }
}
