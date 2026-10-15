import "server-only";
import { db, schema } from "@/lib/db";
import type { UsuarioSesion } from "@/lib/auth/sesion";

/** Registro de auditoría: quién cambió qué y cuándo. */
export async function registrar(
  usuario: UsuarioSesion | null,
  accion: string,
  entidad: string,
  entidadId: string | null,
  detalle = "",
): Promise<void> {
  await db.insert(schema.actividad).values({
    usuarioId: usuario?.id ?? null,
    usuario: usuario?.nombre ?? "Sitio web",
    accion,
    entidad,
    entidadId,
    detalle,
  });
}
