import type { EstadoConsulta, EstadoPresupuesto } from "@/lib/db/schema";

interface MetaEstado {
  etiqueta: string;
  /** Clases para Badge: fondo suave + texto. */
  clase: string;
  punto: string;
}

export const ESTADO_CONSULTA: Record<EstadoConsulta, MetaEstado> = {
  nueva: { etiqueta: "Nueva", clase: "bg-terracota-suave text-terracota", punto: "bg-terracota" },
  contactada: { etiqueta: "Contactada", clase: "bg-aviso-suave text-aviso", punto: "bg-aviso" },
  presupuestada: { etiqueta: "Presupuestada", clase: "bg-secondary text-secondary-foreground", punto: "bg-chart-5" },
  ganada: { etiqueta: "Ganada", clase: "bg-exito-suave text-exito", punto: "bg-exito" },
  perdida: { etiqueta: "Perdida", clase: "bg-muted text-muted-foreground", punto: "bg-muted-foreground/50" },
};

export const ESTADO_PRESUPUESTO: Record<EstadoPresupuesto, MetaEstado> = {
  borrador: { etiqueta: "Borrador", clase: "bg-muted text-muted-foreground", punto: "bg-muted-foreground/50" },
  enviado: { etiqueta: "Enviado", clase: "bg-aviso-suave text-aviso", punto: "bg-aviso" },
  visto: { etiqueta: "Visto", clase: "bg-secondary text-secondary-foreground", punto: "bg-chart-5" },
  aceptado: { etiqueta: "Aceptado", clase: "bg-exito-suave text-exito", punto: "bg-exito" },
  rechazado: { etiqueta: "Rechazado", clase: "bg-destructive/10 text-destructive", punto: "bg-destructive" },
  vencido: { etiqueta: "Vencido", clase: "bg-muted text-muted-foreground", punto: "bg-muted-foreground/50" },
};

export const ORIGENES: Record<string, string> = {
  web: "Sitio web",
  whatsapp: "WhatsApp",
  telefono: "Teléfono",
  local: "En el local",
  instagram: "Instagram",
};
