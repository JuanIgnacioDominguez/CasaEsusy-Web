import type { Metadata } from "next";
import { BandaMarcas } from "@/components/sitio/secciones/BandaMarcas";
import { CarruselTrabajos } from "@/components/sitio/secciones/CarruselTrabajos";
import { GrillaServicios } from "@/components/sitio/secciones/GrillaServicios";
import { Hero } from "@/components/sitio/secciones/Hero";
import { LlamadoFinal } from "@/components/sitio/secciones/LlamadoFinal";
import { Proceso } from "@/components/sitio/secciones/Proceso";
import { SeccionDiseno } from "@/components/sitio/secciones/SeccionDiseno";
import { SeccionResenas } from "@/components/sitio/secciones/SeccionResenas";
import { Visitanos } from "@/components/sitio/secciones/Visitanos";
import { getAjuste } from "@/lib/ajustes";
import { getCatalogos, getMarcas, getProyectos, getResenas, getServicios } from "@/lib/datos/publico";
import { metadataPara } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAjuste("seo");
  return metadataPara("/", { titulo: seo.tituloSitio, descripcion: seo.descripcion });
}

/**
 * Portada: pocas secciones, una idea por bloque.
 * Qué hacemos → diseño de interiores → trabajos reales → cómo trabajamos → marcas → opiniones → dónde estamos.
 */
export default async function Inicio() {
  const [negocio, inicio, whatsapp, servicios, proyectos, resenas, marcas, catalogos] = await Promise.all([
    getAjuste("negocio"),
    getAjuste("inicio"),
    getAjuste("whatsapp"),
    getServicios(),
    getProyectos(),
    getResenas(),
    getMarcas(),
    getCatalogos(),
  ]);
  const nombresServicio = Object.fromEntries(servicios.map((s) => [s.slug, s.nombre]));

  return (
    <>
      <Hero inicio={inicio} negocio={negocio} mensaje={whatsapp.mensaje} />
      <GrillaServicios servicios={servicios.filter((s) => s.slug !== "diseno-de-interiores")} />
      <SeccionDiseno servicio={servicios.find((s) => s.slug === "diseno-de-interiores")} negocio={negocio} />
      <section className="overflow-hidden bg-card py-20 lg:py-28">
        <CarruselTrabajos
          trabajos={proyectos.map(({ id, titulo, imagen, servicio }) => ({ id, titulo, imagen, servicio }))}
          instagram={negocio.instagram}
          nombresServicio={nombresServicio}
        />
      </section>
      <Proceso />
      <BandaMarcas marcas={marcas} catalogos={catalogos.length} />
      <SeccionResenas resenas={resenas} negocio={negocio} />
      <Visitanos negocio={negocio} />
      <LlamadoFinal whatsapp={negocio.whatsapp} mensaje={whatsapp.mensaje} />
    </>
  );
}
