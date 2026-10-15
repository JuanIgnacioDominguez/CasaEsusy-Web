import type { Metadata } from "next";
import { Aparecer } from "@/components/motion/Aparecer";
import { FormularioPresupuesto } from "@/components/sitio/FormularioPresupuesto";
import { Migas, SchemaMigas } from "@/components/sitio/Migas";
import { getAjuste } from "@/lib/ajustes";
import { getServicios } from "@/lib/datos/publico";
import { metadataFija } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataFija("/presupuesto");
}

export default async function Presupuesto({ searchParams }: { searchParams: Promise<{ servicio?: string }> }) {
  const [{ servicio }, servicios, negocio] = await Promise.all([searchParams, getServicios(), getAjuste("negocio")]);
  return (
    <section className="pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28">
      <div className="contenedor flex flex-col gap-10">
        <SchemaMigas items={[{ nombre: "Presupuesto", ruta: "/presupuesto" }]} />
        <Aparecer inmediato className="flex flex-col gap-5">
          <Migas items={[{ nombre: "Presupuesto", ruta: "/presupuesto" }]} />
          <h1 className="max-w-3xl text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]">
            Pedí tu presupuesto sin cargo
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">Son tres pasos y menos de un minuto. Al final se abre WhatsApp con tu consulta lista para enviar.</p>
        </Aparecer>
        <FormularioPresupuesto
          servicios={servicios.map(({ slug, nombre, imagen }) => ({ slug, nombre, imagen }))}
          zonas={negocio.zonas}
          cobertura={negocio.cobertura}
          inicial={servicio}
        />
      </div>
    </section>
  );
}
