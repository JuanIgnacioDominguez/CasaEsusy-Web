import { z } from "zod";

/** Esquema compartido entre el formulario y (en la Fase 1d) la Server Action que guarda el lead. */
export const pedidoPresupuesto = z.object({
  servicio: z.string().min(1, "Elegí qué necesitás"),
  ambiente: z.string().max(80).optional(),
  medidas: z.string().max(200).optional(),
  detalle: z.string().max(1000).optional(),
  nombre: z.string().trim().min(2, "Escribí tu nombre"),
  telefono: z
    .string()
    .trim()
    .regex(/^[\d\s+()-]{8,20}$/, "Escribí un teléfono válido, por ejemplo 11 5555-5555"),
  zona: z.string().trim().max(80).optional(),
  /** honeypot: los bots lo completan, las personas no lo ven */
  web: z.string().max(0).optional(),
});

export type PedidoPresupuesto = z.infer<typeof pedidoPresupuesto>;
