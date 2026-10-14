import { Encabezado } from "@/components/secciones/Encabezado";
import { Resenas } from "@/components/secciones/Resenas";
import { CierreContacto } from "@/components/secciones/CierreContacto";
import { metadatos } from "@/lib/seo";

export const metadata = metadatos({
  titulo: "Reseñas de clientes",
  descripcion:
    "Opiniones de clientes de Casa Esusy en Google: atención, calidad de productos y colocación.",
  ruta: "/resenas",
});

export default function PaginaResenas() {
  return (
    <>
      <Encabezado
        nombre="Reseñas"
        ruta="/resenas"
        titulo="Reseñas de clientes"
        bajada="Opiniones publicadas en nuestra ficha de Google."
      />
      <Resenas />
      <CierreContacto />
    </>
  );
}
