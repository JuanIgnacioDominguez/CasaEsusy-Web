"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { AparecerItem, Escalonado } from "@/components/motion/Aparecer";
import { IconoInstagram } from "@/components/iconos";
import { cn } from "@/lib/utils";
import { Encabezado } from "./Encabezado";

export interface TrabajoCarrusel {
  id: string;
  titulo: string;
  imagen: string;
  servicio: string;
  descripcion: string;
  ubicacion: string;
}

/** Cuántos trabajos entran en la grilla de escritorio: uno destacado grande y cuatro chicos. */
const EN_GRILLA = 5;

function Tarjeta({
  t,
  servicio,
  destacada = false,
  onAbrir,
  className,
}: {
  t: TrabajoCarrusel;
  servicio: string;
  destacada?: boolean;
  onAbrir: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label={`Ver ${t.titulo}`}
      className={cn(
        "group relative block size-full overflow-hidden rounded-[1.5rem] bg-muted text-left focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none",
        className,
      )}
    >
      <Image
        src={t.imagen}
        alt={t.titulo}
        fill
        sizes={destacada ? "(min-width: 1024px) 50vw, 80vw" : "(min-width: 1024px) 25vw, 80vw"}
        className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-suave)] group-hover:scale-[1.06]"
      />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
      <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur sm:top-4 sm:left-4">
        {servicio}
      </span>
      <span className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:top-4 sm:right-4">
        <ArrowUpRightIcon className="size-4" />
      </span>
      <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 sm:p-5">
        <span className={cn("leading-tight font-semibold text-balance text-white", destacada ? "text-2xl lg:text-3xl" : "text-lg")}>{t.titulo}</span>
        {t.descripcion && (
          <span
            className={cn(
              "line-clamp-2 text-sm leading-snug text-white/80 transition-all duration-500",
              destacada ? "max-w-md lg:text-base" : "max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 group-focus-visible:max-h-12 group-focus-visible:opacity-100",
            )}
          >
            {t.descripcion}
          </span>
        )}
      </span>
    </button>
  );
}

/**
 * Trabajos reales (fotos del Instagram del negocio). Escritorio: grilla con un trabajo destacado
 * y cuatro más. Celular: carrusel deslizable con todos. Cada foto se abre en un visor con la
 * descripción, anterior/siguiente (también con las flechas del teclado) y "Quiero algo así".
 */
export function CarruselTrabajos({
  trabajos,
  instagram,
  nombresServicio,
}: {
  trabajos: TrabajoCarrusel[];
  instagram: string;
  nombresServicio: Record<string, string>;
}) {
  const [abierto, setAbierto] = useState<number | null>(null);
  if (trabajos.length === 0) return null;
  const actual = abierto !== null ? trabajos[abierto] : undefined;
  const nombre = (slug: string) => nombresServicio[slug] ?? slug;
  const mover = (d: number) => setAbierto((i) => (i === null ? null : (i + d + trabajos.length) % trabajos.length));
  const usuario = `@${instagram.replace(/\/+$/, "").split("/").pop() ?? "casa_esusy"}`;
  const [destacado, ...resto] = trabajos.slice(0, EN_GRILLA);

  return (
    <section id="trabajos" className="overflow-hidden bg-card py-16 sm:py-20 lg:py-28">
      <div className="contenedor flex flex-col gap-10 lg:gap-12">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Encabezado
            rotulo="Trabajos reales"
            titulo="Lo que hacemos, en casas de verdad"
            bajada="Fotos de trabajos recientes, tal como los compartimos en nuestro Instagram."
          />
          <a
            href={instagram}
            target="_blank"
            rel="noopener"
            className="group flex shrink-0 items-center gap-4 self-start rounded-2xl border bg-background p-3 pr-4 transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(20_24_28/0.45)] lg:self-end"
          >
            <span className="rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-[2px]">
              <span className="block rounded-full bg-background p-[2px]">
                <Image
                  src="/marca/instagram-perfil.jpg"
                  alt="Foto de perfil de Casa Esusy en Instagram"
                  width={150}
                  height={150}
                  sizes="48px"
                  className="size-12 rounded-full object-cover"
                />
              </span>
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-semibold">{usuario}</span>
              <span className="text-sm text-muted-foreground">Más de 2.400 publicaciones</span>
            </span>
            <span className="ml-1 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-sm font-semibold text-background transition-colors group-hover:bg-foreground/85">
              <IconoInstagram className="size-4" /> Seguir
            </span>
          </a>
        </div>

        {/* Escritorio: destacado grande + cuatro */}
        {destacado && (
          <Escalonado className="hidden grid-cols-4 grid-rows-2 gap-4 lg:grid">
            <AparecerItem className="col-span-2 row-span-2">
              <Tarjeta t={destacado} servicio={nombre(destacado.servicio)} destacada onAbrir={() => setAbierto(0)} />
            </AparecerItem>
            {resto.map((t, k) => (
              <AparecerItem key={t.id} className="aspect-[3/4]">
                <Tarjeta t={t} servicio={nombre(t.servicio)} onAbrir={() => setAbierto(k + 1)} />
              </AparecerItem>
            ))}
          </Escalonado>
        )}

        {/* Celular y tablet: carrusel deslizable con todos */}
        <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:hidden">
          {trabajos.map((t, i) => (
            <li key={t.id} className="aspect-[3/4] w-[78%] shrink-0 snap-start sm:w-[42%]">
              <Tarjeta t={t} servicio={nombre(t.servicio)} onAbrir={() => setAbierto(i)} />
            </li>
          ))}
        </ul>

        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg" className="h-11 rounded-lg bg-background px-5 has-data-[icon=inline-end]:pr-5">
            <Link href="/proyectos">
              Ver todos los trabajos <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Visor */}
      <Dialog open={actual !== undefined} onOpenChange={(o) => !o && setAbierto(null)}>
        <DialogContent
          className="max-h-[92dvh] gap-0 overflow-hidden rounded-[1.75rem] p-0 sm:max-w-4xl [&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:z-10 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-background/90 [&_[data-slot=dialog-close]]:shadow-md [&_[data-slot=dialog-close]]:backdrop-blur"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") mover(1);
            if (e.key === "ArrowLeft") mover(-1);
          }}
        >
          {actual && (
            <div className="grid max-h-[92dvh] overflow-y-auto md:h-[min(86dvh,46rem)] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:overflow-hidden">
              <div className="relative h-[52dvh] overflow-hidden bg-pizarra-profundo md:h-full">
                <AnimatePresence initial={false}>
                  <m.div
                    key={actual.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {/* Fondo: la misma foto desenfocada, para que las fotos verticales no dejen bandas vacías */}
                    <Image src={actual.imagen} alt="" aria-hidden fill sizes="48px" className="scale-125 object-cover opacity-70 blur-2xl" />
                    <Image
                      src={actual.imagen}
                      alt={actual.titulo}
                      fill
                      sizes="(min-width:768px) 50vw, 100vw"
                      className="object-contain drop-shadow-[0_24px_40px_rgb(0_0_0/0.35)]"
                    />
                  </m.div>
                </AnimatePresence>
                <span className="absolute top-4 left-4 z-10 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold tabular-nums backdrop-blur">
                  {(abierto ?? 0) + 1} / {trabajos.length}
                </span>
              </div>
              <div className="flex flex-col gap-4 p-6 sm:p-8 md:overflow-y-auto">
                <Link href={`/${actual.servicio}`} className="self-start text-sm font-semibold text-acento hover:underline">
                  {nombre(actual.servicio)}
                </Link>
                <DialogTitle className="text-2xl leading-tight font-semibold sm:text-3xl">{actual.titulo}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed">{actual.descripcion}</DialogDescription>
                {actual.ubicacion && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinIcon className="size-4" /> {actual.ubicacion}
                  </p>
                )}
                <div className="mt-auto flex flex-col gap-3 pt-4">
                  <Button asChild size="lg" className="h-12 rounded-lg px-6 has-data-[icon=inline-end]:pr-6">
                    <Link href={`/presupuesto?servicio=${actual.servicio}`}>
                      Quiero algo así <ArrowRightIcon data-icon="inline-end" />
                    </Link>
                  </Button>
                  <div className="flex justify-between">
                    <Button variant="ghost" size="lg" className="rounded-lg" onClick={() => mover(-1)}>
                      <ChevronLeftIcon data-icon="inline-start" /> Anterior
                    </Button>
                    <Button variant="ghost" size="lg" className="rounded-lg" onClick={() => mover(1)}>
                      Siguiente <ChevronRightIcon data-icon="inline-end" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
