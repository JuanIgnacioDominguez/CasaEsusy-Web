import type { MetadataRoute } from "next";
import { negocio } from "@/content/negocio";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: negocio.nombreCompleto,
    short_name: negocio.nombre,
    description: negocio.descripcion,
    start_url: "/",
    display: "browser",
    background_color: "#f6f2ec",
    theme_color: "#f6f2ec",
    lang: "es-AR",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
