import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import type { Servicio } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Encabezado } from "./Encabezado";

/**
 * Posición de cada tarjeta en la grilla bento (6 servicios).
 * Celular y tablet: 2 columnas, la primera y la última a todo el ancho. Escritorio: 4 columnas × 3 filas.
 */
const FORMAS = [
  "col-span-2 min-h-[15rem] sm:min-h-[22rem] lg:row-span-2 lg:min-h-0",
  "lg:col-span-2",
  "",
  "",
  "lg:col-span-2",
  "col-span-2",
];

/** "Gasas y voile · Black out textil · Roller y 3 más": corto y concreto, entra sin cortarse. */
function resumenTipos(s: Servicio): string {
  const nombres = s.tipos.map((t) => t.nombre);
  if (nombres.length === 0) return s.bajada;
  const visibles = nombres.slice(0, 3).join(" · ");
  return nombres.length > 3 ? `${visibles} y ${nombres.length - 3} más` : visibles;
}

export function GrillaServicios({ servicios }: { servicios: Servicio[] }) {
  return (
    <section id="servicios" className="py-16 sm:py-20 lg:py-28">
      <div className="contenedor flex flex-col gap-10 lg:gap-12">
        <Encabezado
          rotulo="Qué hacemos"
          titulo="Todo para tu casa, hecho a medida"
          bajada="Elegí por dónde empezar. Te asesoramos en el local o vamos a tu casa con muestras, sin cargo."
        />
        <Escalonado className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:auto-rows-[17rem] lg:grid-cols-4">
          {servicios.map((s, i) => {
            const ancha = i === 0 || i === servicios.length - 1;
            return (
              <AparecerItem key={s.id} className={cn("group relative min-h-[11.5rem] sm:min-h-[16rem] lg:min-h-0", FORMAS[i] ?? "")}>
                <Link
                  href={`/${s.slug}`}
                  className="relative flex h-full flex-col justify-end overflow-hidden rounded-2xl bg-muted p-4 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none sm:rounded-[1.75rem] sm:p-6"
                >
                  <Image
                    src={s.imagen}
                    alt=""
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-suave)] group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/0 transition-opacity duration-500 group-hover:from-black/80" />
                  <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/90 text-foreground shadow-lg transition-all duration-500 sm:top-5 sm:right-5 sm:size-11 lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                    <ArrowUpRightIcon className="size-4 sm:size-5" />
                  </span>
                  <span className="relative flex flex-col gap-1 sm:gap-1.5">
                    <span className={cn("leading-tight font-semibold text-balance text-white", i === 0 ? "text-2xl sm:text-3xl lg:text-4xl" : "text-base sm:text-xl lg:text-2xl")}>
                      {s.nombre}
                    </span>
                    <span className={cn("max-w-md text-sm leading-snug text-white/85", !ancha && "hidden sm:block", i === 0 && "lg:text-base")}>
                      {resumenTipos(s)}
                    </span>
                  </span>
                </Link>
              </AparecerItem>
            );
          })}
        </Escalonado>
      </div>
    </section>
  );
}
