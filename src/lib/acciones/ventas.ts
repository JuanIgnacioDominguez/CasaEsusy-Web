"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, desc, eq, like } from "drizzle-orm";
import { z } from "zod";
import { registrar } from "@/lib/actividad";
import { getAjuste } from "@/lib/ajustes";
import { requerirUsuario } from "@/lib/auth/sesion";
import { db, schema } from "@/lib/db";
import { ESTADOS_CONSULTA, ESTADOS_PRESUPUESTO } from "@/lib/db/schema";
import { calcularTotales } from "@/lib/presupuestos/calculos";
import { calcularItem } from "@/lib/presupuestos/items";
import { fallo, ok, type Resultado } from "./resultado";

const VENTAS = ["ventas"] as const;

/* ───────────── Clientes ───────────── */

const clienteSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(2, "Ingresá el nombre"),
  telefono: z.string().trim().max(40).default(""),
  email: z.union([z.literal(""), z.email("Email inválido")]).default(""),
  direccion: z.string().trim().max(200).default(""),
  localidad: z.string().trim().max(80).default(""),
  documento: z.string().trim().max(20).default(""),
  condicionIva: z.string().trim().max(40).default("Consumidor final"),
  notas: z.string().max(4000).default(""),
});

export async function guardarCliente(datos: z.input<typeof clienteSchema>): Promise<Resultado<{ id: string }>> {
  try {
    const usuario = await requerirUsuario([...VENTAS]);
    const { id, ...d } = clienteSchema.parse(datos);
    if (id) {
      await db.update(schema.clientes).set(d).where(eq(schema.clientes.id, id));
      await registrar(usuario, "editó", "cliente", id, d.nombre);
      revalidatePath("/admin/clientes", "layout");
      return ok({ id }, "Cliente guardado");
    }
    const [nuevo] = await db.insert(schema.clientes).values(d).returning({ id: schema.clientes.id });
    await registrar(usuario, "creó", "cliente", nuevo!.id, d.nombre);
    revalidatePath("/admin/clientes", "layout");
    return ok({ id: nuevo!.id }, "Cliente creado");
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarCliente(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...VENTAS]);
    await db.delete(schema.clientes).where(eq(schema.clientes.id, id));
    await registrar(usuario, "eliminó", "cliente", id);
    revalidatePath("/admin/clientes", "layout");
    return ok(undefined, "Cliente eliminado");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Consultas ───────────── */

const consultaManualSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresá el nombre"),
  telefono: z.string().trim().max(40).default(""),
  email: z.union([z.literal(""), z.email("Email inválido")]).default(""),
  servicio: z.string().max(80).default(""),
  mensaje: z.string().max(4000).default(""),
  origen: z.enum(["web", "whatsapp", "telefono", "local", "instagram"]).default("whatsapp"),
});

export async function crearConsulta(datos: z.input<typeof consultaManualSchema>): Promise<Resultado<{ id: string }>> {
  try {
    const usuario = await requerirUsuario([...VENTAS]);
    const d = consultaManualSchema.parse(datos);
    const [c] = await db.insert(schema.consultas).values(d).returning({ id: schema.consultas.id });
    await registrar(usuario, "cargó", "consulta", c!.id, `${d.nombre} · ${d.servicio}`);
    revalidatePath("/admin", "layout");
    return ok({ id: c!.id }, "Consulta cargada");
  } catch (e) {
    return fallo(e);
  }
}

export async function actualizarConsulta(
  id: string,
  cambios: { estado?: (typeof ESTADOS_CONSULTA)[number]; notas?: string },
): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...VENTAS]);
    const d = z.object({ estado: z.enum(ESTADOS_CONSULTA).optional(), notas: z.string().max(8000).optional() }).parse(cambios);
    await db.update(schema.consultas).set(d).where(eq(schema.consultas.id, id));
    if (d.estado) await registrar(usuario, `marcó como ${d.estado}`, "consulta", id);
    revalidatePath("/admin", "layout");
    return ok();
  } catch (e) {
    return fallo(e);
  }
}

export async function eliminarConsulta(id: string): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...VENTAS]);
    await db.delete(schema.consultas).where(eq(schema.consultas.id, id));
    await registrar(usuario, "eliminó", "consulta", id);
    revalidatePath("/admin", "layout");
    return ok(undefined, "Consulta eliminada");
  } catch (e) {
    return fallo(e);
  }
}

/* ───────────── Presupuestos ───────────── */

async function siguienteNumero(): Promise<string> {
  const { prefijo } = await getAjuste("presupuestos");
  const base = `${prefijo}-${new Date().getFullYear()}-`;
  const [ultimo] = await db
    .select({ numero: schema.presupuestos.numero })
    .from(schema.presupuestos)
    .where(like(schema.presupuestos.numero, `${base}%`))
    .orderBy(desc(schema.presupuestos.numero))
    .limit(1);
  const n = ultimo ? Number(ultimo.numero.slice(base.length)) + 1 : 1;
  return `${base}${String(n).padStart(4, "0")}`;
}

/** Crea un presupuesto en borrador (desde cero, desde una consulta o para un cliente) y abre el editor. */
export async function crearPresupuesto(origen: { consultaId?: string; clienteId?: string } = {}): Promise<void> {
  const usuario = await requerirUsuario([...VENTAS]);
  const ajustes = await getAjuste("presupuestos");
  let clienteId = origen.clienteId ?? null;
  let titulo = "";

  if (origen.consultaId) {
    const [c] = await db.select().from(schema.consultas).where(eq(schema.consultas.id, origen.consultaId));
    if (c) {
      titulo = c.servicio && !c.servicio.startsWith("Otro") ? c.servicio : "";
      clienteId = c.clienteId;
      if (!clienteId) {
        const [nuevo] = await db
          .insert(schema.clientes)
          .values({ nombre: c.nombre, telefono: c.telefono, email: c.email, localidad: c.detalles.zona ?? "" })
          .returning({ id: schema.clientes.id });
        clienteId = nuevo!.id;
        await db.update(schema.consultas).set({ clienteId }).where(eq(schema.consultas.id, c.id));
      }
      await db.update(schema.consultas).set({ estado: "presupuestada" }).where(eq(schema.consultas.id, c.id));
    }
  }

  const valido = new Date(Date.now() + ajustes.validezDias * 864e5).toISOString().slice(0, 10);
  const [p] = await db
    .insert(schema.presupuestos)
    .values({
      numero: await siguienteNumero(),
      clienteId,
      consultaId: origen.consultaId ?? null,
      titulo,
      validoHasta: valido,
      ivaPct: ajustes.ivaPct,
      senaPct: ajustes.senaPct,
      condiciones: ajustes.condiciones,
    })
    .returning({ id: schema.presupuestos.id, numero: schema.presupuestos.numero });
  await registrar(usuario, "creó", "presupuesto", p!.id, p!.numero);
  revalidatePath("/admin", "layout");
  redirect(`/admin/presupuestos/${p!.id}`);
}

const itemSchema = z.object({
  clave: z.string(),
  ambiente: z.string().max(80),
  descripcion: z.string().trim().min(1, "Cada ítem necesita una descripción").max(300),
  tipo: z.enum(["cortina", "m2", "empapelado", "piso", "manual"]),
  entradas: z.record(z.string(), z.number()),
  cantidad: z.number().min(0),
  precioUnitario: z.number().min(0),
});

const presupuestoSchema = z.object({
  titulo: z.string().max(160),
  clienteId: z.string().nullable(),
  validoHasta: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  descuentoPct: z.number().min(0).max(100),
  ivaPct: z.number().min(0).max(100),
  senaPct: z.number().min(0).max(100),
  notas: z.string().max(4000),
  condiciones: z.string().max(4000),
  items: z.array(itemSchema).max(200),
});

export async function guardarPresupuesto(id: string, datos: z.input<typeof presupuestoSchema>): Promise<Resultado<{ total: number }>> {
  try {
    const usuario = await requerirUsuario([...VENTAS]);
    const d = presupuestoSchema.parse(datos);
    const calculados = d.items.map((i) => calcularItem(i));
    const t = calcularTotales(calculados.map((i) => i.total), d.descuentoPct, d.ivaPct, d.senaPct);
    await db.transaction(async (tx) => {
      await tx
        .update(schema.presupuestos)
        .set({
          titulo: d.titulo,
          clienteId: d.clienteId,
          validoHasta: d.validoHasta,
          descuentoPct: d.descuentoPct,
          ivaPct: d.ivaPct,
          senaPct: d.senaPct,
          notas: d.notas,
          condiciones: d.condiciones,
          subtotal: t.subtotal,
          total: t.total,
        })
        .where(eq(schema.presupuestos.id, id));
      await tx.delete(schema.presupuestoItems).where(eq(schema.presupuestoItems.presupuestoId, id));
      if (calculados.length) {
        await tx.insert(schema.presupuestoItems).values(
          calculados.map((i, orden) => ({
            presupuestoId: id,
            ambiente: i.ambiente,
            descripcion: i.descripcion,
            tipo: i.tipo,
            entradas: i.entradas,
            desglose: i.desglose,
            cantidad: i.cantidad,
            precioUnitario: i.precioUnitario,
            total: i.total,
            orden,
          })),
        );
      }
    });
    await registrar(usuario, "guardó", "presupuesto", id, `Total ${Math.round(t.total)}`);
    revalidatePath("/admin/presupuestos", "layout");
    return ok({ total: t.total }, "Presupuesto guardado");
  } catch (e) {
    return fallo(e);
  }
}

export async function cambiarEstadoPresupuesto(id: string, estado: (typeof ESTADOS_PRESUPUESTO)[number]): Promise<Resultado> {
  try {
    const usuario = await requerirUsuario([...VENTAS]);
    z.enum(ESTADOS_PRESUPUESTO).parse(estado);
    const ahora = new Date().toISOString();
    const extra =
      estado === "enviado" ? { enviado: ahora } : estado === "aceptado" || estado === "rechazado" ? { respondido: ahora } : {};
    await db.update(schema.presupuestos).set({ estado, ...extra }).where(eq(schema.presupuestos.id, id));
    if (estado === "aceptado") {
      const [p] = await db.select({ consultaId: schema.presupuestos.consultaId }).from(schema.presupuestos).where(eq(schema.presupuestos.id, id));
      if (p?.consultaId) await db.update(schema.consultas).set({ estado: "ganada" }).where(eq(schema.consultas.id, p.consultaId));
    }
    await registrar(usuario, `marcó como ${estado}`, "presupuesto", id);
    revalidatePath("/admin", "layout");
    return ok();
  } catch (e) {
    return fallo(e);
  }
}

export async function duplicarPresupuesto(id: string): Promise<void> {
  const usuario = await requerirUsuario([...VENTAS]);
  const [p] = await db.select().from(schema.presupuestos).where(eq(schema.presupuestos.id, id));
  if (!p) redirect("/admin/presupuestos");
  const items = await db.select().from(schema.presupuestoItems).where(eq(schema.presupuestoItems.presupuestoId, id));
  const { prefijo: _, validezDias } = await getAjuste("presupuestos");
  const [nuevo] = await db
    .insert(schema.presupuestos)
    .values({
      numero: await siguienteNumero(),
      clienteId: p.clienteId,
      consultaId: p.consultaId,
      titulo: p.titulo ? `${p.titulo} (copia)` : "",
      validoHasta: new Date(Date.now() + validezDias * 864e5).toISOString().slice(0, 10),
      descuentoPct: p.descuentoPct,
      ivaPct: p.ivaPct,
      senaPct: p.senaPct,
      notas: p.notas,
      condiciones: p.condiciones,
      subtotal: p.subtotal,
      total: p.total,
    })
    .returning({ id: schema.presupuestos.id, numero: schema.presupuestos.numero });
  if (items.length) {
    await db.insert(schema.presupuestoItems).values(items.map(({ id: _id, presupuestoId: _p, ...i }) => ({ ...i, presupuestoId: nuevo!.id })));
  }
  await registrar(usuario, "duplicó", "presupuesto", nuevo!.id, `${p.numero} → ${nuevo!.numero}`);
  redirect(`/admin/presupuestos/${nuevo!.id}`);
}

export async function eliminarPresupuesto(id: string): Promise<void> {
  const usuario = await requerirUsuario([...VENTAS]);
  await db.delete(schema.presupuestos).where(eq(schema.presupuestos.id, id));
  await registrar(usuario, "eliminó", "presupuesto", id);
  revalidatePath("/admin", "layout");
  redirect("/admin/presupuestos");
}

/* ───────────── Vista pública del presupuesto (/p/[token]) ───────────── */

export async function responderPresupuesto(token: string, acepta: boolean): Promise<Resultado> {
  try {
    const [p] = await db.select().from(schema.presupuestos).where(eq(schema.presupuestos.token, token));
    if (!p) return { ok: false, error: "Presupuesto no encontrado" };
    if (p.estado === "aceptado" || p.estado === "rechazado") return { ok: false, error: "Este presupuesto ya fue respondido." };
    if (p.validoHasta < new Date().toISOString().slice(0, 10)) return { ok: false, error: "Este presupuesto está vencido. Escribinos y lo actualizamos." };
    const estado = acepta ? "aceptado" : "rechazado";
    await db
      .update(schema.presupuestos)
      .set({ estado, respondido: new Date().toISOString() })
      .where(and(eq(schema.presupuestos.id, p.id)));
    if (acepta && p.consultaId) await db.update(schema.consultas).set({ estado: "ganada" }).where(eq(schema.consultas.id, p.consultaId));
    await registrar(null, acepta ? "aceptó online" : "rechazó online", "presupuesto", p.id, p.numero);
    revalidatePath(`/p/${token}`);
    revalidatePath("/admin", "layout");
    return ok(undefined, acepta ? "¡Gracias! Te contactamos para coordinar." : "Gracias por avisarnos.");
  } catch (e) {
    return fallo(e);
  }
}
