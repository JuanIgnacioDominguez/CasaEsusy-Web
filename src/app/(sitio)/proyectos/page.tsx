import type { Metadata } from "next";
import { Aparecer } from "@/components/motion/Aparecer";
import { IconoInstagram } from "@/components/iconos";
import { GaleriaTrabajos } from "@/components/sitio/GaleriaTrabajos";
import { Migas } from "@/components/sitio/Migas";
import { LlamadoFinal } from "@/components/sitio/secciones/LlamadoFinal";
import { getAjuste } from "@/lib/ajustes";
import { getProyectos, getServicios } from "@/lib/datos/publico";
import { metadataFija } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataFija("/proyectos");
}

export default async function Proyectos() {
  const [negocio, whatsapp, proyectos, servicios] = await Promise.all([
    getAjuste("negocio"),
    getAjuste("whatsapp"),
    getProyectos(),
    getServicios(),
  ]);
  return (
    <>
      <section className="pt-28 pb-20 sm:pt-32 lg:pt-36">
        <div className="contenedor flex flex-col gap-10">
          <Aparecer inmediato className="flex flex-col gap-5">
            <Migas items={[{ nombre: "Trabajos", ruta: "/proyectos" }]} />
            <h1 className="max-w-3xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Trabajos reales, en casas de verdad
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Una selección de lo que venimos haciendo. Publicamos trabajos nuevos casi todas las semanas en{" "}
              <a href={negocio.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline">
                <IconoInstagram className="size-4" /> @casa_esusy
              </a>
              .
            </p>
          </Aparecer>
          <GaleriaTrabajos
            trabajos={proyectos.map(({ id, titulo, descripcion, ubicacion, imagen, servicio }) => ({ id, titulo, descripcion, ubicacion, imagen, servicio }))}
            servicios={servicios.map(({ slug, nombre }) => ({ slug, nombre }))}
          />
        </div>
      </section>
      <LlamadoFinal whatsapp={negocio.whatsapp} mensaje={whatsapp.mensaje} titulo="¿Te imaginás algo así en tu casa?" />
    </>
  );
}
