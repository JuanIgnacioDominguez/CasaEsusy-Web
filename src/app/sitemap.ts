import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/negocio";
import { servicios } from "@/content/servicios";

export const dynamic = "force-static";

/** Fase 1d: sumar productos, proyectos y artículos desde la base, con su fecha real de modificación. */
export default function sitemap(): MetadataRoute.Sitemap {
  const fijas = [
    "",
    "/diseno-de-interiores",
    "/nosotros",
    "/proyectos",
    "/resenas",
    "/novedades",
    "/presupuesto",
    "/contacto",
    "/preguntas-frecuentes",
    "/cuidado-de-telas",
    "/marcas",
  ];
  const deServicios = servicios.flatMap((s) => [
    `/${s.slug}`,
    ...s.tipos.map((t) => `/${s.slug}/${t.slug}`),
  ]);
  return [...fijas, ...deServicios].map((ruta) => ({
    url: `${SITE_URL}${ruta}`,
    changeFrequency: "weekly",
    priority: ruta === "" ? 1 : ruta.split("/").length > 2 ? 0.6 : 0.8,
  }));
}
