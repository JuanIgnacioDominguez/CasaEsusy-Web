import type { MetadataRoute } from "next";
import { getServicios, getSeoPaginaTodas } from "@/lib/datos/sitemap";
import { SITE_URL } from "@/lib/whatsapp";

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [servicios, seo] = await Promise.all([getServicios(), getSeoPaginaTodas()]);
  const noindex = new Set(seo.filter((s) => s.noindex).map((s) => s.ruta));
  const ahora = new Date();
  const fijas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: ahora, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/presupuesto`, lastModified: ahora, changeFrequency: "yearly", priority: 0.9 },
    { url: `${SITE_URL}/proyectos`, lastModified: ahora, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/nosotros`, lastModified: ahora, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/contacto`, lastModified: ahora, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/preguntas-frecuentes`, lastModified: ahora, changeFrequency: "monthly", priority: 0.6 },
  ];
  const deServicios: MetadataRoute.Sitemap = servicios.map((s) => ({
    url: `${SITE_URL}/${s.slug}`,
    lastModified: new Date(s.actualizado),
    changeFrequency: "monthly",
    priority: 0.9,
    images: [`${SITE_URL}${s.imagen}`],
  }));
  return [...fijas, ...deServicios].filter((e) => !noindex.has(e.url.replace(SITE_URL, "") || "/"));
}
