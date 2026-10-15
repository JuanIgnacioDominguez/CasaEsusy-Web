import type { Metadata } from "next";
import { BandaCifras } from "@/components/sitio/secciones/BandaCifras";
import { CarruselTrabajos } from "@/components/sitio/secciones/CarruselTrabajos";
import { GrillaServicios } from "@/components/sitio/secciones/GrillaServicios";
import { Hero } from "@/components/sitio/secciones/Hero";
import { LlamadoFinal } from "@/components/sitio/secciones/LlamadoFinal";
import { NosotrosTeaser } from "@/components/sitio/secciones/NosotrosTeaser";
import { Proceso } from "@/components/sitio/secciones/Proceso";
import { SeccionResenas } from "@/components/sitio/secciones/SeccionResenas";
import { Visitanos } from "@/components/sitio/secciones/Visitanos";
import { getAjuste } from "@/lib/ajustes";
import { getProyectos, getResenas, getServicios } from "@/lib/datos/publico";
import { metadataPara } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getAjuste("seo");
  return metadataPara("/", { titulo: seo.tituloSitio, descripcion: seo.descripcion });
}

export default async function Inicio() {
  const [negocio, inicio, whatsapp, servicios, proyectos, resenas] = await Promise.all([
    getAjuste("negocio"),
    getAjuste("inicio"),
    getAjuste("whatsapp"),
    getServicios(),
    getProyectos(),
    getResenas(),
  ]);
  const nombresServicio = Object.fromEntries(servicios.map((s) => [s.slug, s.nombre]));

  return (
    <>
      <Hero inicio={inicio} negocio={negocio} mensaje={whatsapp.mensaje} />
      <BandaCifras negocio={negocio} />
      <GrillaServicios servicios={servicios} />
      <section className="overflow-hidden bg-card py-20 lg:py-28">
        <CarruselTrabajos
          trabajos={proyectos.map(({ id, titulo, imagen, servicio }) => ({ id, titulo, imagen, servicio }))}
          instagram={negocio.instagram}
          nombresServicio={nombresServicio}
        />
      </section>
      <Proceso />
      <NosotrosTeaser negocio={negocio} texto={inicio.textoNosotros} />
      <SeccionResenas resenas={resenas} negocio={negocio} />
      <Visitanos negocio={negocio} />
      <LlamadoFinal whatsapp={negocio.whatsapp} mensaje={whatsapp.mensaje} />
    </>
  );
}
