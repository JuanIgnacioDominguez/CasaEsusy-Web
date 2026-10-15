import { getAjuste } from "@/lib/ajustes";
import { getServicios } from "@/lib/datos/publico";
import { rangoHorario } from "@/lib/horario";
import { SITE_URL } from "@/lib/whatsapp";

export const revalidate = 600;

/** Resumen del negocio para asistentes de IA (llmstxt.org). Editable desde el panel de SEO. */
export async function GET() {
  const [seo, n, servicios] = await Promise.all([getAjuste("seo"), getAjuste("negocio"), getServicios()]);
  const texto =
    seo.llms.trim() ||
    [
      `# ${n.nombre}`,
      "",
      `> ${n.descripcion}`,
      "",
      "## Datos",
      `- Dirección: ${n.calle}, ${n.localidad}, ${n.partido}, ${n.provincia} (${n.codigoPostal})`,
      `- WhatsApp / teléfono: +${n.whatsapp}`,
      `- Horarios: ${n.horarios.map((h) => `${h.dias} ${rangoHorario(h)}`).join(" · ")}`,
      `- Cobertura: ${n.cobertura} (${n.zonas.join(", ")})`,
      `- Desde: ${n.fundacion}`,
      `- Diseñadora: ${n.duenaNombre}, certificada en ${n.duenaCredencial} (${n.duenaInstitucion}, ${n.duenaAnio})`,
      `- Presupuesto y medición sin cargo · colocación propia · servicio de diseño de interiores`,
      `- Catálogos de las marcas: ${SITE_URL}/catalogos`,
      "",
      "## Servicios",
      ...servicios.map((s) => `- [${s.nombre}](${SITE_URL}/${s.slug}): ${s.bajada}`),
      "",
      "## Páginas",
      `- [Pedir presupuesto](${SITE_URL}/presupuesto)`,
      `- [Trabajos realizados](${SITE_URL}/proyectos)`,
      `- [Nuestra historia](${SITE_URL}/nosotros)`,
      `- [Preguntas frecuentes](${SITE_URL}/preguntas-frecuentes)`,
      `- [Contacto](${SITE_URL}/contacto)`,
    ].join("\n");
  return new Response(texto, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
