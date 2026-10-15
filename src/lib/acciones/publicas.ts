"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { registrar } from "@/lib/actividad";
import { getAjuste } from "@/lib/ajustes";
import { db, schema } from "@/lib/db";
import { urlWhatsApp } from "@/lib/whatsapp";

const consultaSchema = z.object({
  servicio: z.string().max(80),
  ambientes: z.array(z.string().max(40)).max(10),
  medidas: z.string().max(400),
  mensaje: z.string().max(2000),
  conVisita: z.boolean(),
  nombre: z.string().trim().min(2, "Ingresá tu nombre").max(80),
  telefono: z
    .string()
    .trim()
    .refine((t) => t.replace(/\D/g, "").length >= 8, "Ingresá un teléfono válido"),
  email: z.union([z.literal(""), z.email("Revisá el email")]),
  zona: z.string().max(80),
  /** Campo trampa para bots: tiene que llegar vacío. */
  web: z.string().max(0),
});

export type DatosConsulta = z.infer<typeof consultaSchema>;

export type ResultadoConsulta =
  | { ok: true; whatsapp: string }
  | { ok: false; error: string; campos?: Partial<Record<keyof DatosConsulta, string>> };

/* Límite simple por IP: 5 envíos cada 10 minutos. */
const envios = new Map<string, number[]>();
function permitido(ip: string): boolean {
  const ahora = Date.now();
  const lista = (envios.get(ip) ?? []).filter((t) => ahora - t < 10 * 60_000);
  if (lista.length >= 5) return false;
  envios.set(ip, [...lista, ahora]);
  return true;
}

export async function enviarConsulta(datos: DatosConsulta): Promise<ResultadoConsulta> {
  const parsed = consultaSchema.safeParse(datos);
  if (!parsed.success) {
    const campos: Partial<Record<keyof DatosConsulta, string>> = {};
    for (const issue of parsed.error.issues) {
      const clave = issue.path[0] as keyof DatosConsulta;
      campos[clave] ??= issue.message;
    }
    return { ok: false, error: "Revisá los datos marcados.", campos };
  }
  const d = parsed.data;
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "local";
  if (!permitido(ip)) return { ok: false, error: "Recibimos varios envíos seguidos. Probá de nuevo en unos minutos o escribinos por WhatsApp." };

  const [consulta] = await db
    .insert(schema.consultas)
    .values({
      nombre: d.nombre,
      telefono: d.telefono,
      email: d.email,
      servicio: d.servicio,
      mensaje: d.mensaje,
      origen: "web",
      detalles: { ambientes: d.ambientes.join(", "), medidas: d.medidas, zona: d.zona, conVisita: d.conVisita },
    })
    .returning({ id: schema.consultas.id });
  await registrar(null, "creó", "consulta", consulta?.id ?? null, `${d.nombre} · ${d.servicio || "Consulta general"}`);

  const negocio = await getAjuste("negocio");
  const lineas = [
    `Hola Casa Esusy, soy ${d.nombre}.`,
    d.servicio ? `Quiero presupuesto de: ${d.servicio}.` : "Quiero hacer una consulta.",
    d.ambientes.length ? `Ambientes: ${d.ambientes.join(", ")}.` : "",
    d.medidas ? `Medidas aproximadas: ${d.medidas}.` : "",
    d.mensaje,
    d.zona ? `Zona: ${d.zona}.` : "",
    d.conVisita ? "Me gustaría coordinar una visita para medir." : "",
  ].filter(Boolean);

  return { ok: true, whatsapp: urlWhatsApp(negocio.whatsapp, lineas.join("\n")) };
}
