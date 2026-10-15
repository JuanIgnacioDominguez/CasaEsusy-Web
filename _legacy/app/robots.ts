import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/negocio";

export const dynamic = "force-static";

/** Sección 15: se bloquean áreas privadas; se permiten los buscadores de IA para GEO. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/p/", "/carrito", "/checkout", "/mi-cuenta"],
      },
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-SearchBot",
        ],
        allow: "/",
        disallow: ["/admin", "/api", "/p/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
