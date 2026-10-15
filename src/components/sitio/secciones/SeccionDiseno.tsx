import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, AwardIcon, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { TarjetaSpotlight } from "@/components/motion/TarjetaSpotlight";
import { IconoWhatsApp } from "@/components/iconos";
import type { Negocio } from "@/lib/ajustes/esquemas";
import type { Servicio } from "@/lib/db/schema";
import { urlWhatsApp } from "@/lib/whatsapp";

/** Bloque que vende el servicio de diseño de interiores como algo que se puede contratar. */
export function SeccionDiseno({ servicio, negocio }: { servicio: Servicio | undefined; negocio: Negocio }) {
  const opciones = servicio?.tipos.length
    ? servicio.tipos
    : [
        { nombre: "Asesoría puntual", descripcion: "Una visita para resolver un ambiente, con muestras en mano." },
        { nombre: "Proyecto de ambiente", descripcion: "Paleta, telas, materiales y lista de compras." },
      ];
  const mensaje = servicio?.mensajeWhatsApp || "Hola Casa Esusy, quiero contratar el servicio de diseño de interiores.";

  return (
    <section className="relative isolate overflow-hidden bg-pizarra-profundo py-20 text-marfil lg:py-28">
      <div aria-hidden className="absolute -top-32 -left-32 -z-10 size-[36rem] rounded-full bg-[radial-gradient(closest-side,rgb(166_90_63/0.35),transparent)]" />
      <div className="contenedor grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-8">
          <Aparecer className="flex flex-col gap-5">
            <span className="rotulo text-[#e3a487]">
              <span className="h-px w-6 bg-current" aria-hidden />
              Servicio de diseño de interiores
            </span>
            <h2 className="text-[2rem] leading-[1.08] font-semibold text-marfil sm:text-[2.6rem] lg:text-[3rem]">
              ¿Querés que todo combine? Contratá el diseño de tu espacio
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-marfil/70">
              No hace falta saber de decoración. {negocio.duenaNombre} piensa el ambiente completo con vos: colores, telas, luz y muebles, para que cortinas,
              tapizados, alfombras y paredes conversen entre sí.
            </p>
          </Aparecer>

          <Escalonado className="grid gap-3 sm:grid-cols-2">
            {opciones.map((o) => (
              <AparecerItem key={o.nombre}>
                <TarjetaSpotlight className="h-full rounded-2xl border border-marfil/10 bg-marfil/[0.04] p-5 transition-colors hover:border-marfil/25">
                  <span className="relative flex gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-terracota text-white">
                      <CheckIcon className="size-3.5" strokeWidth={3} />
                    </span>
                    <span className="flex flex-col gap-1">
                      <span className="font-semibold text-marfil">{o.nombre}</span>
                      <span className="text-sm leading-relaxed text-marfil/65">{o.descripcion}</span>
                    </span>
                  </span>
                </TarjetaSpotlight>
              </AparecerItem>
            ))}
          </Escalonado>

          <Aparecer className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 rounded-lg bg-marfil px-7 text-base text-pizarra hover:bg-white">
              <a href={urlWhatsApp(negocio.whatsapp, mensaje)} target="_blank" rel="noopener">
                <IconoWhatsApp data-icon="inline-start" className="text-[#1FA855]" /> Quiero asesoramiento
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 rounded-lg border-marfil/25 bg-transparent px-7 text-base text-marfil hover:bg-marfil/10 hover:text-marfil"
            >
              <Link href="/diseno-de-interiores">
                Cómo trabajamos el diseño <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          </Aparecer>
        </div>

        <Aparecer retraso={0.1} className="relative mx-auto w-full max-w-[34rem]">
          <div className="grid grid-cols-5 gap-4">
            <div className="relative col-span-3 aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-marfil/5">
              <Image src="/img/ambientes/respaldo-capitone.jpg" alt="Dormitorio con respaldo capitoné y textiles en tonos neutros" fill sizes="(min-width:1024px) 300px, 60vw" className="object-cover" />
            </div>
            <div className="col-span-2 flex flex-col gap-4 pt-14">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-marfil/5">
                <Image src="/img/ambientes/paleta-diseno.jpg" alt="Paleta de colores y muestras para un proyecto de diseño" fill sizes="(min-width:1024px) 200px, 40vw" className="object-cover" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-marfil/5">
                <Image src="/img/ambientes/muestrario-telas.jpg" alt="Muestrario de telas" fill sizes="(min-width:1024px) 200px, 40vw" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-4 flex max-w-xs items-center gap-3 rounded-2xl border border-white/40 bg-background/95 p-4 text-foreground shadow-2xl backdrop-blur sm:-left-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-terracota-suave text-terracota">
              <AwardIcon className="size-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{negocio.duenaNombre}</span>
              <span className="text-xs text-muted-foreground">
                Certificada en {negocio.duenaCredencial} · {negocio.duenaAnio}
              </span>
            </span>
          </div>
        </Aparecer>
      </div>
    </section>
  );
}
