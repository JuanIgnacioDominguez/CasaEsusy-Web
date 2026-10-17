import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Casa Esusy · Decoraciones",
    short_name: "Casa Esusy",
    description: "Cortinas a medida, tapizados y decoración en Banfield desde 1967.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfb",
    theme_color: "#3f464e",
    lang: "es-AR",
    icons: [
      { src: "/marca/icono-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marca/icono-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
