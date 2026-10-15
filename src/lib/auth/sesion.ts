import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, lt } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { Usuario } from "@/lib/db/schema";

export const COOKIE_SESION = "ce_sesion";
const DURACION_DIAS = 30;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export type UsuarioSesion = Pick<Usuario, "id" | "email" | "nombre" | "rol">;

export async function crearSesion(usuarioId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expira = new Date(Date.now() + DURACION_DIAS * 864e5);
  const agente = (await headers()).get("user-agent")?.slice(0, 200) ?? null;
  await db.insert(schema.sesiones).values({ id: hashToken(token), usuarioId, expira: expira.toISOString(), agente });
  await db.delete(schema.sesiones).where(lt(schema.sesiones.expira, new Date().toISOString()));
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expira,
  });
}

/** Usuario de la sesión actual, o null. Se memoiza por request. */
export const obtenerUsuario = cache(async (): Promise<UsuarioSesion | null> => {
  const token = (await cookies()).get(COOKIE_SESION)?.value;
  if (!token) return null;
  const [fila] = await db
    .select({
      id: schema.usuarios.id,
      email: schema.usuarios.email,
      nombre: schema.usuarios.nombre,
      rol: schema.usuarios.rol,
      activo: schema.usuarios.activo,
    })
    .from(schema.sesiones)
    .innerJoin(schema.usuarios, eq(schema.usuarios.id, schema.sesiones.usuarioId))
    .where(and(eq(schema.sesiones.id, hashToken(token)), gt(schema.sesiones.expira, new Date().toISOString())));
  if (!fila || !fila.activo) return null;
  return { id: fila.id, email: fila.email, nombre: fila.nombre, rol: fila.rol };
});

type Rol = Usuario["rol"];

/** Corta la ejecución si no hay sesión o el rol no alcanza. Usar en cada página y acción del panel. */
export async function requerirUsuario(roles?: Rol[]): Promise<UsuarioSesion> {
  const usuario = await obtenerUsuario();
  if (!usuario) redirect("/admin/ingresar");
  if (roles && !roles.includes(usuario.rol) && usuario.rol !== "admin") redirect("/admin?sin-permiso=1");
  return usuario;
}

export async function cerrarSesion(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_SESION)?.value;
  if (token) await db.delete(schema.sesiones).where(eq(schema.sesiones.id, hashToken(token)));
  jar.delete(COOKIE_SESION);
}

/* Límite de intentos de ingreso por IP + email (en memoria del proceso). */
const intentos = new Map<string, { n: number; hasta: number }>();
const VENTANA_MS = 15 * 60 * 1000;
const MAX_INTENTOS = 6;

export function intentosAgotados(clave: string): boolean {
  const r = intentos.get(clave);
  if (!r || r.hasta < Date.now()) return false;
  return r.n >= MAX_INTENTOS;
}

export function registrarIntentoFallido(clave: string): void {
  const r = intentos.get(clave);
  if (!r || r.hasta < Date.now()) intentos.set(clave, { n: 1, hasta: Date.now() + VENTANA_MS });
  else r.n += 1;
}

export function limpiarIntentos(clave: string): void {
  intentos.delete(clave);
}
