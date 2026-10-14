/**
 * Datos oficiales del negocio (NAP). Fuente única: el sitio, el schema JSON-LD,
 * el botón de WhatsApp y el llms.txt leen de acá. En la Fase 1d esto pasa a
 * `site_settings` en la base y se edita desde el panel.
 */
export const negocio = {
  nombre: "Casa Esusy",
  nombreCompleto: "Casa Esusy · Decoración integral",
  fundacion: 1967,
  lema: "Decoración integral en Banfield desde 1967",
  descripcion:
    "Casa de decoración familiar en Banfield, desde 1967. Cortinas a medida, sillones y tapizados, acolchados, alfombras, empapelados, pisos y diseño de interiores, con colocación propia y presupuesto sin cargo.",
  duena: {
    nombre: "Andrea Esusy",
    credencial: "Certificado en Diseño y Decoración de Interiores",
    institucion: "DECOmobi, Lomas de Zamora",
    anio: 2025,
  },
  direccion: {
    calle: "Manuel Acevedo 1290",
    localidad: "Banfield",
    partido: "Lomas de Zamora",
    provincia: "Buenos Aires",
    cp: "B1828",
    pais: "AR",
  },
  geo: { lat: -34.7453042, lng: -58.3980594 },
  telefono: {
    visible: "+54 9 11 5598-4126",
    e164: "+5491155984126",
    whatsapp: "5491155984126",
  },
  email: "[COMPLETAR]@casaesusy.com.ar",
  instagram: "https://www.instagram.com/casa_esusy/",
  instagramUsuario: "@casa_esusy",
  facebook: "https://www.facebook.com/Casaesusy/",
  googleMaps:
    "https://www.google.com/maps/place/Casa+Esusy+decoraciones/@-34.7453042,-58.3980594,17z",
  google: { puntaje: 4.5, opiniones: 26 },
  zonas: [
    "Banfield",
    "Lomas de Zamora",
    "Temperley",
    "Adrogué",
    "Lanús",
    "Remedios de Escalada",
    "Turdera",
  ],
  /** 0 = domingo … 6 = sábado. Horario de Argentina (UTC-3). */
  horarios: [
    { dias: "Lunes a viernes", desde: "09:00", hasta: "13:00", diasSemana: [1, 2, 3, 4, 5] },
    { dias: "Sábados", desde: "10:00", hasta: "14:00", diasSemana: [6] },
  ],
} as const;

export const urlWhatsApp = (texto?: string) =>
  `https://wa.me/${negocio.telefono.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

export const direccionCompleta = `${negocio.direccion.calle}, ${negocio.direccion.localidad}, ${negocio.direccion.provincia}`;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.casaesusy.com.ar"
).replace(/\/$/, "");

/** "09:00" → "9", "13:30" → "13:30" */
export const hora = (hhmm: string) => hhmm.replace(/^0/, "").replace(":00", "");
