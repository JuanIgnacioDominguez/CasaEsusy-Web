import type { Metadata } from "next";
import Image from "next/image";
import { AwardIcon, HandHeartIcon, RulerIcon, ScissorsIcon } from "lucide-react";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { Migas, SchemaMigas } from "@/components/sitio/Migas";
import { Encabezado } from "@/components/sitio/secciones/Encabezado";
import { LlamadoFinal } from "@/components/sitio/secciones/LlamadoFinal";
import { getAjuste } from "@/lib/ajustes";
import { metadataFija } from "@/lib/seo";

export function generateMetadata(): Promise<Metadata> {
  return metadataFija("/nosotros");
}

const VALORES = [
  { Icono: HandHeartIcon, titulo: "Atención de cerca", texto: "Te atiende la familia. Escuchamos antes de recomendar." },
  { Icono: RulerIcon, titulo: "Medidas exactas", texto: "Medimos en tu casa: un trabajo a medida empieza por ahí." },
  { Icono: ScissorsIcon, titulo: "Oficio de verdad", texto: "Confección cuidada y un colocador propio que termina prolijo." },
];

export default async function Nosotros() {
  const [negocio, inicio, whatsapp] = await Promise.all([getAjuste("negocio"), getAjuste("inicio"), getAjuste("whatsapp")]);
  const hitos = [
    { anio: String(negocio.fundacion), titulo: "Empieza la historia", texto: `Abrimos en ${negocio.localidad} eligiendo telas para las casas del barrio.` },
    { anio: "Tres generaciones", titulo: "El oficio se hereda", texto: "La dedicación y el ojo para las telas pasan de una generación a la siguiente." },
    { anio: "Hoy", titulo: "Decoración integral", texto: `Cortinas, tapizados, alfombras, empapelados, pisos y diseño de interiores, con colocación propia. ${negocio.cobertura}` },
    { anio: String(negocio.duenaAnio), titulo: "Diseño de interiores", texto: `${negocio.duenaNombre} se certifica en ${negocio.duenaCredencial} (${negocio.duenaInstitucion}).` },
  ];

  return (
    <>
      <section className="pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
        <div className="contenedor grid items-end gap-12 lg:grid-cols-2 lg:gap-16">
          <SchemaMigas items={[{ nombre: "Nosotros", ruta: "/nosotros" }]} />
          <Aparecer inmediato className="flex flex-col gap-6">
            <Migas items={[{ nombre: "Nosotros", ruta: "/nosotros" }]} />
            <span className="rotulo text-acento">
              <span className="h-px w-6 bg-current" aria-hidden />
              Desde {negocio.fundacion}
            </span>
            <h1 className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-[3.8rem]">
              Una casa de familia que viste casas desde hace {new Date().getFullYear() - negocio.fundacion} años
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{inicio.textoNosotros}</p>
          </Aparecer>
          <Aparecer inmediato retraso={0.1} className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-muted">
              <Image src="/img/instagram/pieza-desde-1967.jpg" alt={`${negocio.nombre}, Banfield, desde ${negocio.fundacion}`} fill priority sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-muted">
              <Image src="/img/instagram/frente-local.jpg" alt={`Frente del local en ${negocio.calle}`} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </div>
          </Aparecer>
        </div>
      </section>

      <section className="bg-card py-20 lg:py-24">
        <div className="contenedor flex flex-col gap-12">
          <Encabezado rotulo="Nuestra historia" titulo="Algunos momentos" />
          <Escalonado className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {hitos.map((h) => (
              <AparecerItem key={h.titulo} className="flex flex-col gap-3 border-t-2 border-acento/70 pt-6">
                <span className="text-2xl font-semibold tracking-tight text-acento">{h.anio}</span>
                <h3 className="text-lg font-semibold">{h.titulo}</h3>
                <p className="leading-relaxed text-muted-foreground">{h.texto}</p>
              </AparecerItem>
            ))}
          </Escalonado>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="contenedor grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <Aparecer className="flex flex-col gap-6 rounded-[2rem] bg-pizarra p-8 text-marfil sm:p-10">
            <span className="grid size-14 place-items-center rounded-2xl bg-marfil/10">
              <AwardIcon className="size-7" />
            </span>
            <h2 className="text-3xl leading-tight font-semibold">{negocio.duenaNombre}</h2>
            <p className="text-lg leading-relaxed text-marfil/75">
              A cargo de la casa. Certificada en {negocio.duenaCredencial} por {negocio.duenaInstitucion} ({negocio.duenaAnio}). Acompaña cada
              proyecto desde la primera idea hasta la colocación.
            </p>
          </Aparecer>
          <Escalonado className="flex flex-col gap-4">
            {VALORES.map(({ Icono, titulo, texto }) => (
              <AparecerItem key={titulo} className="flex gap-5 rounded-[1.5rem] border bg-card p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-acento-suave text-acento">
                  <Icono className="size-6" strokeWidth={1.7} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">{titulo}</span>
                  <span className="leading-relaxed text-muted-foreground">{texto}</span>
                </span>
              </AparecerItem>
            ))}
          </Escalonado>
        </div>
      </section>

      <LlamadoFinal whatsapp={negocio.whatsapp} mensaje={whatsapp.mensaje} titulo="Pasá por el local o te visitamos" />
    </>
  );
}
