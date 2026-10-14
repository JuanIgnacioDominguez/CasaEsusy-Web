import { SITE_URL, direccionCompleta, negocio } from "@/content/negocio";
import { servicios } from "@/content/servicios";

export const dynamic = "force-static";

/** Resumen para asistentes de IA (sección 14, GEO). Fase 1d: editable desde el panel. */
export function GET() {
  const lineas = [
    `# ${negocio.nombre}`,
    "",
    `> ${negocio.descripcion}`,
    "",
    `- Fundada en ${negocio.fundacion}. Negocio familiar, tres generaciones.`,
    `- Dueña: ${negocio.duena.nombre}, ${negocio.duena.credencial} (${negocio.duena.institucion}, ${negocio.duena.anio}).`,
    `- Dirección: ${direccionCompleta}.`,
    `- Horarios: ${negocio.horarios.map((h) => `${h.dias} de ${h.desde} a ${h.hasta} h`).join("; ")}.`,
    `- Teléfono y WhatsApp: ${negocio.telefono.visible}. Presupuesto sin cargo, medición a domicilio y colocación propia.`,
    `- Zona de atención: ${negocio.zonas.join(", ")}.`,
    "",
    "## Servicios",
    ...servicios.map((s) => `- [${s.titulo}](${SITE_URL}/${s.slug}): ${s.bajada}`),
    `- [Diseño de interiores](${SITE_URL}/diseno-de-interiores): proyectos de ambientes completos para casas y comercios.`,
    "",
    "## Más información",
    `- [Preguntas frecuentes](${SITE_URL}/preguntas-frecuentes)`,
    `- [Cuidado de telas](${SITE_URL}/cuidado-de-telas)`,
    `- [Contacto y horarios](${SITE_URL}/contacto)`,
    `- [Instagram](${negocio.instagram})`,
  ];
  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
