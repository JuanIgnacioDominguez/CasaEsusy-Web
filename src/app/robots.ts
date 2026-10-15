import type { MetadataRoute } from "next";
import { getAjuste } from "@/lib/ajustes";
import { SITE_URL } from "@/lib/whatsapp";

export const revalidate = 600;

/** Se permite a los buscadores y a los asistentes de IA (conviene que citen al negocio). */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getAjuste("seo");
  const bloqueadas = ["/admin", "/api", "/p/"];
  const extra = seo.robotsExtra
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.toLowerCase().startsWith("disallow:"))
    .map((l) => l.slice(9).trim())
    .filter(Boolean);

  if (!seo.indexar) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: [...bloqueadas, ...extra] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
