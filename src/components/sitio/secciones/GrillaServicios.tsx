import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import type { Servicio } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Encabezado } from "./Encabezado";

/** Posición de cada tarjeta en la grilla bento (4 columnas × 3 filas en desktop). */
const FORMAS = [
  "min-h-[24rem] sm:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "",
  "",
  "",
  "",
  "lg:col-span-2",
];

export function GrillaServicios({ servicios }: { servicios: Servicio[] }) {
  return (
    <section id="servicios" className="py-20 lg:py-28">
      <div className="contenedor flex flex-col gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Encabezado
            rotulo="Qué hacemos"
            titulo="Todo para vestir tu casa, en un solo lugar"
            bajada="Elegí por dónde empezar. Te asesoramos en el local o vamos a tu casa con muestras."
          />
        </div>
        <Escalonado className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[17rem] lg:grid-cols-4">
          {servicios.map((s, i) => (
            <AparecerItem key={s.id} className={cn("group relative min-h-[16rem] lg:min-h-0", FORMAS[i] ?? "")}>
              <Link
                href={`/${s.slug}`}
                className="relative flex h-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-muted p-6 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                <Image
                  src={s.imagen}
                  alt=""
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-suave)] group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0 transition-opacity duration-500 group-hover:from-black/75" />
                <span className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white/90 text-pizarra opacity-0 shadow-lg transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 max-lg:opacity-100 lg:translate-y-1 lg:group-hover:translate-y-0">
                  <ArrowUpRightIcon className="size-5" />
                </span>
                <span className="relative flex flex-col gap-1.5">
                  <span className={cn("font-semibold text-white", i === 0 ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl")}>
                    {s.nombre}
                  </span>
                  <span className={cn("max-w-md text-sm leading-snug text-white/80", i === 0 ? "lg:text-base" : "line-clamp-2")}>
                    {s.bajada}
                  </span>
                </span>
              </Link>
            </AparecerItem>
          ))}
        </Escalonado>
      </div>
    </section>
  );
}
