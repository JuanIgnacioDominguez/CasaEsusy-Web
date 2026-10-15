import { z } from "zod";

/**
 * Ajustes editables desde el panel (tabla `ajustes`, una fila por clave).
 * Los valores por defecto son los datos reales relevados del negocio.
 */

const horario = z.object({
  dias: z.string().min(1),
  desde: z.string().regex(/^\d{2}:\d{2}$/),
  hasta: z.string().regex(/^\d{2}:\d{2}$/),
  /** 0 = domingo … 6 = sábado */
  diasSemana: z.array(z.number().int().min(0).max(6)),
});
export type Horario = z.infer<typeof horario>;

export const negocioSchema = z.object({
  nombre: z.string().min(1),
  lema: z.string(),
  descripcion: z.string(),
  fundacion: z.number().int(),
  telefonoVisible: z.string(),
  whatsapp: z.string().regex(/^\d{8,15}$/, "Solo números, con código de país (ej. 5491155984126)"),
  email: z.string(),
  calle: z.string(),
  localidad: z.string(),
  partido: z.string(),
  provincia: z.string(),
  codigoPostal: z.string(),
  lat: z.number(),
  lng: z.number(),
  instagram: z.string(),
  facebook: z.string(),
  googleMaps: z.string(),
  googleResenas: z.string(),
  googlePuntaje: z.number().min(0).max(5),
  googleOpiniones: z.number().int().min(0),
  horarios: z.array(horario),
  zonas: z.array(z.string()),
  /** Frase de cobertura que se muestra en el sitio. */
  cobertura: z.string(),
  duenaNombre: z.string(),
  duenaCredencial: z.string(),
  duenaInstitucion: z.string(),
  duenaAnio: z.number().int(),
});
export type Negocio = z.infer<typeof negocioSchema>;

export const NEGOCIO_DEFECTO: Negocio = {
  nombre: "Casa Esusy",
  lema: "Decoración integral en Banfield desde 1967",
  descripcion:
    "Casa de decoración familiar con local en Banfield desde 1967. Cortinas a medida, sillones y tapizados, acolchados, alfombras, empapelados, pisos y diseño de interiores, con colocación propia y presupuesto sin cargo en Capital Federal, zona sur y donde nos necesiten.",
  fundacion: 1967,
  telefonoVisible: "11 5598-4126",
  whatsapp: "5491155984126",
  email: "",
  calle: "Manuel Acevedo 1290",
  localidad: "Banfield",
  partido: "Lomas de Zamora",
  provincia: "Buenos Aires",
  codigoPostal: "B1828",
  lat: -34.7453042,
  lng: -58.3980594,
  instagram: "https://www.instagram.com/casa_esusy/",
  facebook: "https://www.facebook.com/Casaesusy/",
  googleMaps:
    "https://www.google.com/maps/place/Casa+Esusy+decoraciones/@-34.7453042,-58.3980594,17z",
  googleResenas:
    "https://www.google.com/maps/place/Casa+Esusy+decoraciones/@-34.7453042,-58.3980594,17z",
  googlePuntaje: 4.5,
  googleOpiniones: 26,
  horarios: [
    { dias: "Lunes a viernes", desde: "09:00", hasta: "13:00", diasSemana: [1, 2, 3, 4, 5] },
    { dias: "Sábados", desde: "10:00", hasta: "14:00", diasSemana: [6] },
  ],
  zonas: [
    "Capital Federal",
    "Banfield",
    "Lomas de Zamora",
    "Temperley",
    "Adrogué",
    "Lanús",
    "Remedios de Escalada",
    "Turdera",
    "Avellaneda",
    "Quilmes",
  ],
  cobertura: "Trabajamos en Capital Federal, en toda la zona sur y donde nos necesites.",
  duenaNombre: "Andrea Esusy",
  duenaCredencial: "Diseño y Decoración de Interiores",
  duenaInstitucion: "DECOmobi, Lomas de Zamora",
  duenaAnio: 2025,
};

export const whatsappSchema = z.object({
  activo: z.boolean(),
  mensaje: z.string().min(1),
  etiqueta: z.string(),
});
export type AjustesWhatsApp = z.infer<typeof whatsappSchema>;

export const WHATSAPP_DEFECTO: AjustesWhatsApp = {
  activo: true,
  mensaje: "Hola Casa Esusy, quiero hacer una consulta.",
  etiqueta: "¿Necesitás ayuda?",
};

export const inicioSchema = z.object({
  rotulo: z.string(),
  titulo: z.string().min(1),
  bajada: z.string(),
  imagen: z.string().min(1),
  imagenSecundaria: z.string(),
  textoNosotros: z.string(),
});
export type AjustesInicio = z.infer<typeof inicioSchema>;

export const INICIO_DEFECTO: AjustesInicio = {
  rotulo: "Casa Esusy · Banfield · Desde 1967",
  titulo: "a medida, para tu casa.",
  bajada:
    "Cada pieza hecha para tu casa, y diseño de interiores para que todo combine. Medimos sin cargo en Capital, zona sur o donde nos necesites.",
  imagen: "/img/ambientes/living-sillon-gasas.jpg",
  imagenSecundaria: "/img/instagram/gasas-ventanal.jpg",
  textoNosotros:
    "Somos una casa de decoración familiar. Empezamos en 1967 eligiendo telas para las casas del barrio y hoy, tres generaciones después, seguimos igual: escuchamos, medimos con cuidado y entregamos trabajos prolijos, desde una cortina hasta un ambiente completo.",
};

export const seoSchema = z.object({
  tituloSitio: z.string().min(1),
  plantilla: z.string().includes("%s", { message: "La plantilla tiene que incluir %s" }),
  descripcion: z.string(),
  imagen: z.string(),
  indexar: z.boolean(),
  googleVerificacion: z.string(),
  bingVerificacion: z.string(),
  robotsExtra: z.string(),
  llms: z.string(),
});
export type AjustesSeo = z.infer<typeof seoSchema>;

export const SEO_DEFECTO: AjustesSeo = {
  tituloSitio: "Casa Esusy · Cortinas a medida y decoración en Banfield",
  plantilla: "%s | Casa Esusy",
  descripcion:
    "Cortinas a medida, sillones y tapizados, acolchados, alfombras, empapelados y pisos en Banfield desde 1967. Medición y presupuesto sin cargo, colocación propia.",
  imagen: "",
  indexar: true,
  googleVerificacion: "",
  bingVerificacion: "",
  robotsExtra: "",
  llms: "",
};

export const presupuestosSchema = z.object({
  validezDias: z.number().int().min(1).max(120),
  ivaPct: z.number().min(0).max(100),
  senaPct: z.number().min(0).max(100),
  condiciones: z.string(),
  prefijo: z.string().min(1).max(4),
});
export type AjustesPresupuestos = z.infer<typeof presupuestosSchema>;

export const PRESUPUESTOS_DEFECTO: AjustesPresupuestos = {
  validezDias: 15,
  ivaPct: 0,
  senaPct: 50,
  prefijo: "P",
  condiciones:
    "Precios finales en pesos. Seña para iniciar la confección y saldo contra entrega e instalación. Las medidas se confirman en la visita técnica. Los trabajos a medida no admiten cambios una vez iniciada la confección.",
};

export const AJUSTES = {
  negocio: { schema: negocioSchema, defecto: NEGOCIO_DEFECTO },
  whatsapp: { schema: whatsappSchema, defecto: WHATSAPP_DEFECTO },
  inicio: { schema: inicioSchema, defecto: INICIO_DEFECTO },
  seo: { schema: seoSchema, defecto: SEO_DEFECTO },
  presupuestos: { schema: presupuestosSchema, defecto: PRESUPUESTOS_DEFECTO },
} as const;

export type ClaveAjuste = keyof typeof AJUSTES;
export type ValorAjuste<K extends ClaveAjuste> = z.infer<(typeof AJUSTES)[K]["schema"]>;
