import { sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/**
 * Esquema de la base. SQLite/libSQL: archivo local en desarrollo y en la VPS,
 * Turso si se despliega en Vercel. Todas las fechas son ISO 8601 en texto.
 */

const ahora = sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`;

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const creado = () => text("creado").notNull().default(ahora);
const actualizado = () =>
  text("actualizado")
    .notNull()
    .default(ahora)
    .$onUpdateFn(() => new Date().toISOString());

/* ───────────── Acceso ───────────── */

export const usuarios = sqliteTable("usuarios", {
  id: id(),
  email: text("email").notNull().unique(),
  nombre: text("nombre").notNull(),
  hash: text("hash").notNull(),
  rol: text("rol", { enum: ["admin", "ventas", "contenido"] })
    .notNull()
    .default("admin"),
  activo: integer("activo", { mode: "boolean" }).notNull().default(true),
  ultimoIngreso: text("ultimo_ingreso"),
  creado: creado(),
});

export const sesiones = sqliteTable(
  "sesiones",
  {
    id: text("id").primaryKey(), // sha256 del token de la cookie
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    expira: text("expira").notNull(),
    agente: text("agente"),
    creado: creado(),
  },
  (t) => [index("sesiones_usuario_idx").on(t.usuarioId)],
);

/* ───────────── Configuración y SEO ───────────── */

export const ajustes = sqliteTable("ajustes", {
  clave: text("clave").primaryKey(),
  valor: text("valor", { mode: "json" }).notNull(),
  actualizado: actualizado(),
});

export const seoPaginas = sqliteTable("seo_paginas", {
  ruta: text("ruta").primaryKey(),
  titulo: text("titulo"),
  descripcion: text("descripcion"),
  imagen: text("imagen"),
  noindex: integer("noindex", { mode: "boolean" }).notNull().default(false),
  actualizado: actualizado(),
});

export const redirecciones = sqliteTable("redirecciones", {
  id: id(),
  desde: text("desde").notNull().unique(),
  hacia: text("hacia").notNull(),
  codigo: integer("codigo").notNull().default(301),
  visitas: integer("visitas").notNull().default(0),
  creado: creado(),
});

/* ───────────── Contenido público ───────────── */

export interface TipoServicio {
  nombre: string;
  descripcion: string;
}
export interface PreguntaRespuesta {
  pregunta: string;
  respuesta: string;
}

export const servicios = sqliteTable("servicios", {
  id: id(),
  slug: text("slug").notNull().unique(),
  nombre: text("nombre").notNull(),
  titulo: text("titulo").notNull(),
  bajada: text("bajada").notNull(),
  descripcion: text("descripcion").notNull().default(""),
  imagen: text("imagen").notNull(),
  tipos: text("tipos", { mode: "json" }).$type<TipoServicio[]>().notNull().default([]),
  preguntas: text("preguntas", { mode: "json" })
    .$type<PreguntaRespuesta[]>()
    .notNull()
    .default([]),
  mensajeWhatsApp: text("mensaje_whatsapp").notNull().default(""),
  orden: integer("orden").notNull().default(0),
  publicado: integer("publicado", { mode: "boolean" }).notNull().default(true),
  actualizado: actualizado(),
});

export const proyectos = sqliteTable("proyectos", {
  id: id(),
  titulo: text("titulo").notNull(),
  servicio: text("servicio").notNull(),
  ubicacion: text("ubicacion").notNull().default(""),
  descripcion: text("descripcion").notNull().default(""),
  imagen: text("imagen").notNull(),
  galeria: text("galeria", { mode: "json" }).$type<string[]>().notNull().default([]),
  destacado: integer("destacado", { mode: "boolean" }).notNull().default(false),
  publicado: integer("publicado", { mode: "boolean" }).notNull().default(true),
  orden: integer("orden").notNull().default(0),
  creado: creado(),
});

export const resenas = sqliteTable("resenas", {
  id: id(),
  autor: text("autor").notNull(),
  puntaje: integer("puntaje").notNull().default(5),
  texto: text("texto").notNull(),
  fecha: text("fecha").notNull().default(""),
  origen: text("origen").notNull().default("Google"),
  destacada: integer("destacada", { mode: "boolean" }).notNull().default(false),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  creado: creado(),
});

export const preguntas = sqliteTable("preguntas", {
  id: id(),
  pregunta: text("pregunta").notNull(),
  respuesta: text("respuesta").notNull(),
  grupo: text("grupo").notNull().default("General"),
  orden: integer("orden").notNull().default(0),
  publicada: integer("publicada", { mode: "boolean" }).notNull().default(true),
});

export const medios = sqliteTable("medios", {
  id: id(),
  nombre: text("nombre").notNull(),
  url: text("url").notNull().unique(),
  alt: text("alt").notNull().default(""),
  ancho: integer("ancho"),
  alto: integer("alto"),
  peso: integer("peso"),
  tipo: text("tipo").notNull().default("image/webp"),
  creado: creado(),
});

/* ───────────── Marcas y catálogos ───────────── */

export const marcas = sqliteTable("marcas", {
  id: id(),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion").notNull().default(""),
  rubro: text("rubro").notNull().default(""),
  logo: text("logo").notNull().default(""),
  sitioWeb: text("sitio_web").notNull().default(""),
  orden: integer("orden").notNull().default(0),
  publicada: integer("publicada", { mode: "boolean" }).notNull().default(true),
  creado: creado(),
});

export const CATEGORIAS_CATALOGO = [
  "Telas",
  "Cortinas y sistemas",
  "Rieles y barrales",
  "Empapelados",
  "Alfombras",
  "Pisos",
  "Otros",
] as const;

export const catalogos = sqliteTable(
  "catalogos",
  {
    id: id(),
    titulo: text("titulo").notNull(),
    descripcion: text("descripcion").notNull().default(""),
    categoria: text("categoria").notNull().default("Telas"),
    marcaId: text("marca_id").references(() => marcas.id, { onDelete: "set null" }),
    /** pdf: archivo subido · imagenes: galería de fotos · enlace: catálogo online de la marca */
    tipo: text("tipo", { enum: ["pdf", "imagenes", "enlace"] }).notNull().default("pdf"),
    archivo: text("archivo").notNull().default(""),
    enlace: text("enlace").notNull().default(""),
    portada: text("portada").notNull().default(""),
    imagenes: text("imagenes", { mode: "json" }).$type<string[]>().notNull().default([]),
    destacado: integer("destacado", { mode: "boolean" }).notNull().default(false),
    publicado: integer("publicado", { mode: "boolean" }).notNull().default(true),
    orden: integer("orden").notNull().default(0),
    creado: creado(),
  },
  (t) => [index("catalogos_categoria_idx").on(t.categoria)],
);

/* ───────────── Operación ───────────── */

export const clientes = sqliteTable(
  "clientes",
  {
    id: id(),
    nombre: text("nombre").notNull(),
    telefono: text("telefono").notNull().default(""),
    email: text("email").notNull().default(""),
    direccion: text("direccion").notNull().default(""),
    localidad: text("localidad").notNull().default(""),
    documento: text("documento").notNull().default(""),
    condicionIva: text("condicion_iva").notNull().default("Consumidor final"),
    notas: text("notas").notNull().default(""),
    creado: creado(),
  },
  (t) => [index("clientes_nombre_idx").on(t.nombre)],
);

export const ESTADOS_CONSULTA = ["nueva", "contactada", "presupuestada", "ganada", "perdida"] as const;
export type EstadoConsulta = (typeof ESTADOS_CONSULTA)[number];

export interface DetallesConsulta {
  ambientes?: string;
  medidas?: string;
  zona?: string;
  cuando?: string;
  conVisita?: boolean;
}

export const consultas = sqliteTable(
  "consultas",
  {
    id: id(),
    nombre: text("nombre").notNull(),
    telefono: text("telefono").notNull().default(""),
    email: text("email").notNull().default(""),
    servicio: text("servicio").notNull().default(""),
    mensaje: text("mensaje").notNull().default(""),
    detalles: text("detalles", { mode: "json" }).$type<DetallesConsulta>().notNull().default({}),
    origen: text("origen", { enum: ["web", "whatsapp", "telefono", "local", "instagram"] })
      .notNull()
      .default("web"),
    estado: text("estado", { enum: ESTADOS_CONSULTA }).notNull().default("nueva"),
    clienteId: text("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
    notas: text("notas").notNull().default(""),
    creado: creado(),
    actualizado: actualizado(),
  },
  (t) => [index("consultas_estado_idx").on(t.estado), index("consultas_creado_idx").on(t.creado)],
);

export const ESTADOS_PRESUPUESTO = [
  "borrador",
  "enviado",
  "visto",
  "aceptado",
  "rechazado",
  "vencido",
] as const;
export type EstadoPresupuesto = (typeof ESTADOS_PRESUPUESTO)[number];

export const presupuestos = sqliteTable(
  "presupuestos",
  {
    id: id(),
    numero: text("numero").notNull().unique(),
    clienteId: text("cliente_id").references(() => clientes.id, { onDelete: "set null" }),
    consultaId: text("consulta_id").references(() => consultas.id, { onDelete: "set null" }),
    titulo: text("titulo").notNull().default(""),
    estado: text("estado", { enum: ESTADOS_PRESUPUESTO }).notNull().default("borrador"),
    validoHasta: text("valido_hasta").notNull(),
    descuentoPct: real("descuento_pct").notNull().default(0),
    ivaPct: real("iva_pct").notNull().default(0),
    senaPct: real("sena_pct").notNull().default(50),
    notas: text("notas").notNull().default(""),
    condiciones: text("condiciones").notNull().default(""),
    token: text("token")
      .notNull()
      .unique()
      .$defaultFn(() => crypto.randomUUID().replaceAll("-", "")),
    subtotal: real("subtotal").notNull().default(0),
    total: real("total").notNull().default(0),
    enviado: text("enviado"),
    visto: text("visto"),
    respondido: text("respondido"),
    creado: creado(),
    actualizado: actualizado(),
  },
  (t) => [index("presupuestos_estado_idx").on(t.estado)],
);

export type TipoItem = "cortina" | "m2" | "empapelado" | "piso" | "manual";

export interface LineaDesglose {
  concepto: string;
  cantidad: number;
  unidad: string;
  precio: number;
  subtotal: number;
}

export const presupuestoItems = sqliteTable(
  "presupuesto_items",
  {
    id: id(),
    presupuestoId: text("presupuesto_id")
      .notNull()
      .references(() => presupuestos.id, { onDelete: "cascade" }),
    ambiente: text("ambiente").notNull().default(""),
    descripcion: text("descripcion").notNull(),
    tipo: text("tipo").$type<TipoItem>().notNull().default("manual"),
    entradas: text("entradas", { mode: "json" }).$type<Record<string, unknown>>().notNull().default({}),
    desglose: text("desglose", { mode: "json" }).$type<LineaDesglose[]>().notNull().default([]),
    cantidad: real("cantidad").notNull().default(1),
    precioUnitario: real("precio_unitario").notNull().default(0),
    total: real("total").notNull().default(0),
    orden: integer("orden").notNull().default(0),
  },
  (t) => [index("items_presupuesto_idx").on(t.presupuestoId)],
);

export const CATEGORIAS_PRECIO = [
  "Telas",
  "Confección",
  "Rieles y barrales",
  "Roller y venecianas",
  "Empapelados",
  "Pisos",
  "Tapicería",
  "Colocación",
] as const;

export const precios = sqliteTable(
  "precios",
  {
    id: id(),
    categoria: text("categoria").notNull(),
    nombre: text("nombre").notNull(),
    unidad: text("unidad").notNull().default("u"),
    precio: real("precio").notNull().default(0),
    notas: text("notas").notNull().default(""),
    activo: integer("activo", { mode: "boolean" }).notNull().default(true),
    actualizado: actualizado(),
  },
  (t) => [uniqueIndex("precios_cat_nombre_idx").on(t.categoria, t.nombre)],
);

export const actividad = sqliteTable(
  "actividad",
  {
    id: id(),
    usuarioId: text("usuario_id"),
    usuario: text("usuario").notNull().default("Sistema"),
    accion: text("accion").notNull(),
    entidad: text("entidad").notNull(),
    entidadId: text("entidad_id"),
    detalle: text("detalle").notNull().default(""),
    creado: creado(),
  },
  (t) => [index("actividad_creado_idx").on(t.creado)],
);

export type Usuario = typeof usuarios.$inferSelect;
export type Servicio = typeof servicios.$inferSelect;
export type Proyecto = typeof proyectos.$inferSelect;
export type Resena = typeof resenas.$inferSelect;
export type Pregunta = typeof preguntas.$inferSelect;
export type Medio = typeof medios.$inferSelect;
export type Cliente = typeof clientes.$inferSelect;
export type Consulta = typeof consultas.$inferSelect;
export type Presupuesto = typeof presupuestos.$inferSelect;
export type PresupuestoItem = typeof presupuestoItems.$inferSelect;
export type Precio = typeof precios.$inferSelect;
export type Redireccion = typeof redirecciones.$inferSelect;
export type SeoPagina = typeof seoPaginas.$inferSelect;
export type Actividad = typeof actividad.$inferSelect;
export type Marca = typeof marcas.$inferSelect;
export type Catalogo = typeof catalogos.$inferSelect;
