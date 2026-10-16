import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Aparecer, AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { Estrellas, IconoGoogle } from "@/components/iconos";
import type { Negocio } from "@/lib/ajustes/esquemas";
import type { Resena } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Encabezado } from "./Encabezado";

/** Colores de avatar (fondo · texto), tomados de la paleta del sitio; van rotando para que no se repitan. */
const AVATARES = [
  "bg-acento-suave text-acento",
  "bg-pizarra text-marfil",
  "bg-[#e3e9df] text-[#4c5e46]",
  "bg-[#efe4d2] text-[#83653a]",
  "bg-[#e1e6ec] text-[#475565]",
];

/**
 * Opiniones de Google: arriba el resumen (puntaje, estrellas y cantidad, con link a Google)
 * y abajo cada reseña en una tarjeta con el formato de Google (avatar, nombre, fecha y estrellas).
 */
export function SeccionResenas({ resenas, negocio }: { resenas: Resena[]; negocio: Negocio }) {
  if (resenas.length === 0) return null;
  const puntaje = negocio.googlePuntaje.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return (
    <section id="opiniones" className="py-16 sm:py-20 lg:py-28">
      <div className="contenedor flex flex-col gap-10 lg:gap-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Encabezado rotulo="Opiniones" titulo="Lo que dicen quienes ya nos eligieron" bajada="Reseñas reales de clientes, publicadas en Google." />

          {/* Resumen de Google */}
          <Aparecer
            retraso={0.1}
            className="flex shrink-0 flex-col gap-5 rounded-xl border bg-card p-5 shadow-[0_24px_50px_-36px_rgb(20_24_28/0.45)] sm:flex-row sm:items-center sm:gap-6 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-xl border bg-background">
                <IconoGoogle className="size-7" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="flex items-baseline gap-2">
                  <span className="text-4xl leading-none font-semibold tracking-tight tabular-nums">{puntaje}</span>
                  <Estrellas puntaje={negocio.googlePuntaje} className="text-lg text-foreground" />
                </span>
                <span className="text-sm text-muted-foreground">
                  Basado en {negocio.googleOpiniones} opiniones en Google
                </span>
              </div>
            </div>
            <Button asChild variant="outline" size="lg" className="h-11 rounded-md bg-background px-5 has-data-[icon=inline-end]:pr-5">
              <a href={negocio.googleResenas} target="_blank" rel="noopener">
                Ver en Google <ArrowUpRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </Aparecer>
        </div>

        {/* Celular: carrusel deslizable. Tablet y escritorio: grilla. */}
        <Escalonado className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-5">
          {resenas.slice(0, 6).map((r, i) => (
            <AparecerItem key={r.id} className="h-full w-[85%] shrink-0 snap-start md:w-auto">
              <figure className="flex h-full flex-col gap-5 rounded-xl border bg-card p-6 transition-shadow duration-300 hover:shadow-[0_24px_50px_-34px_rgb(20_24_28/0.45)] sm:p-7">
                <figcaption className="flex items-center gap-3">
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-full text-base font-semibold", AVATARES[i % AVATARES.length])} aria-hidden>
                    {r.autor.charAt(0)}
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="font-semibold">{r.autor}</span>
                    {r.fecha && <span className="text-sm text-muted-foreground">{r.fecha}</span>}
                  </span>
                  {r.origen === "Google" && <IconoGoogle className="ml-auto size-5 shrink-0" />}
                </figcaption>
                <Estrellas puntaje={r.puntaje} className="text-lg text-foreground" />
                <blockquote className="text-[1.0625rem] leading-relaxed text-foreground">“{r.texto}”</blockquote>
                <a
                  href={negocio.googleResenas}
                  target="_blank"
                  rel="noopener"
                  className="mt-auto inline-flex items-center gap-1 self-start pt-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Leer en Google <ArrowUpRightIcon className="size-3.5" />
                </a>
              </figure>
            </AparecerItem>
          ))}
        </Escalonado>
      </div>
    </section>
  );
}
