"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { registrar } from "@/lib/actividad";
import { verificarClave } from "@/lib/auth/clave";
import { cerrarSesion, crearSesion, intentosAgotados, limpiarIntentos, obtenerUsuario, registrarIntentoFallido } from "@/lib/auth/sesion";
import { db, schema } from "@/lib/db";

export interface EstadoIngreso {
  error?: string;
}

const ingresoSchema = z.object({
  email: z.email().transform((e) => e.toLowerCase().trim()),
  clave: z.string().min(1).max(200),
});

export async function ingresar(_: EstadoIngreso, form: FormData): Promise<EstadoIngreso> {
  const parsed = ingresoSchema.safeParse({ email: form.get("email"), clave: form.get("clave") });
  if (!parsed.success) return { error: "Completá email y contraseña." };
  const { email, clave } = parsed.data;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const claveLimite = `${ip}:${email}`;
  if (intentosAgotados(claveLimite)) return { error: "Demasiados intentos. Esperá 15 minutos y volvé a probar." };

  const [usuario] = await db.select().from(schema.usuarios).where(eq(schema.usuarios.email, email));
  const valido = usuario && usuario.activo ? await verificarClave(clave, usuario.hash) : false;
  if (!usuario || !valido) {
    registrarIntentoFallido(claveLimite);
    return { error: "Email o contraseña incorrectos." };
  }
  limpiarIntentos(claveLimite);
  await crearSesion(usuario.id);
  await db.update(schema.usuarios).set({ ultimoIngreso: new Date().toISOString() }).where(eq(schema.usuarios.id, usuario.id));
  await registrar({ id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol }, "ingresó", "sesión", null);
  redirect("/admin");
}

export async function salir(): Promise<void> {
  const usuario = await obtenerUsuario();
  await cerrarSesion();
  if (usuario) await registrar(usuario, "salió", "sesión", null);
  redirect("/admin/ingresar");
}
