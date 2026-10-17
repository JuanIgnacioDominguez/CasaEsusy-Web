import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import type { Marca } from "@/lib/db/schema";

/**
 * Marcas con las que trabajamos, en formato editorial: a la izquierda el título y el texto (fijos
 * al bajar en escritorio), a la derecha una fila por marca con su logo, rubro y qué ofrece.
 * Cada fila lleva a los catálogos de la marca.
 */
export function BandaMarcas({ marcas, catalogos }: { marcas: Marca[]; catalogos: number }) {
  if (marcas.length === 0) return null;

  return (
    <section id="marcas" aria-label="Marcas con las que trabajamos" className="border-y bg-lino/50 py-16 sm:py-20 lg:py-28">
      <div className="contenedor grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <Aparecer className="flex flex-col gap-5">
          <h2 className="text-[2rem] leading-[1.06] font-semibold text-balance sm:text-[2.6rem] lg:text-[3rem]">Marcas con las que trabajamos</h2>
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-lg">
            Trabajamos con fabricantes argentinos de primera línea en cortinas, sistemas, alfombras, empapelados y revestimientos. Podés ver sus catálogos
            online o consultar los muestrarios en nuestro local.
          </p>
          <Button asChild size="lg" className="group mt-2 h-12 self-start rounded-md px-6 text-base has-data-[icon=inline-end]:pr-6">
            <Link href="/catalogos">
              {catalogos > 0 ? `Ver los ${catalogos} ${catalogos === 1 ? "catálogo" : "catálogos"}` : "Ver catálogos"}
              <ArrowRightIcon data-icon="inline-end" className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          {/* En escritorio ocupa el resto del alto, para emparejar con la lista de marcas */}
          <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-md bg-muted shadow-[0_30px_60px_-40px_rgb(20_24_28/0.5)] lg:aspect-auto lg:min-h-[15rem] lg:flex-1">
            <Image
              src="/img/ambientes/muestrario-colores.jpg"
              alt="Muestrario de colores y terminaciones para elegir en el local"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </Aparecer>

        <Escalonado className="flex flex-col border-t border-foreground/15">
          {marcas.map((m) => (
            <AparecerItem key={m.id}>
              <Link
                href={`/catalogos?marca=${encodeURIComponent(m.nombre)}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-foreground/15 py-5 transition-colors duration-300 hover:bg-background/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:gap-10 sm:px-4 sm:py-6"
              >
                <span className="flex h-10 items-center sm:h-11">
                  {m.logo ? (
                    <Image
                      src={m.logo}
                      alt={m.nombre}
                      width={320}
                      height={96}
                      className="h-auto max-h-10 w-auto max-w-[11rem] object-contain object-left opacity-75 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 sm:max-h-11 sm:max-w-full"
                    />
                  ) : (
                    <span className="text-lg font-bold tracking-[-0.03em]">{m.nombre}</span>
                  )}
                </span>
                <span className="hidden text-[0.95rem] text-muted-foreground sm:block">{m.rubro}</span>
                <ArrowUpRightIcon
                  aria-hidden
                  className="size-5 text-acento opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 max-sm:opacity-40"
                />
              </Link>
            </AparecerItem>
          ))}
        </Escalonado>
      </div>
    </section>
  );
}
