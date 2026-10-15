"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { IconoInstagram } from "@/components/iconos";

export interface TrabajoCarrusel {
  id: string;
  titulo: string;
  imagen: string;
  servicio: string;
}

/** Fotos reales de trabajos (del Instagram del negocio), en un carrusel arrastrable. */
export function CarruselTrabajos({ trabajos, instagram, nombresServicio }: { trabajos: TrabajoCarrusel[]; instagram: string; nombresServicio: Record<string, string> }) {
  return (
    <Carousel opts={{ align: "start", dragFree: true }} className="flex flex-col gap-8">
      <div className="contenedor flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="rotulo text-terracota">
            <span className="h-px w-6 bg-current" aria-hidden />
            Trabajos reales
          </span>
          <h2 className="text-[2rem] leading-[1.08] font-semibold sm:text-[2.6rem] lg:text-[3rem]">Lo que hacemos, en casas de verdad</h2>
          <p className="text-lg text-muted-foreground">Fotos de trabajos recientes, tal como los compartimos en nuestro Instagram.</p>
        </div>
        <div className="flex items-center gap-2">
          <CarouselPrevious className="static size-11 translate-y-0 rounded-full" />
          <CarouselNext className="static size-11 translate-y-0 rounded-full" />
        </div>
      </div>
      <CarouselContent className="-ml-4 px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]">
        {trabajos.map((t) => (
          <CarouselItem key={t.id} className="basis-[72%] pl-4 sm:basis-[42%] lg:basis-[26%]">
            <figure className="group flex flex-col gap-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-muted">
                <Image
                  src={t.imagen}
                  alt={t.titulo}
                  fill
                  sizes="(min-width: 1024px) 26vw, (min-width: 640px) 42vw, 72vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="flex flex-col gap-0.5 px-1">
                <span className="text-xs font-medium text-terracota">{nombresServicio[t.servicio] ?? t.servicio}</span>
                <span className="text-[0.95rem] leading-snug font-semibold">{t.titulo}</span>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
        <CarouselItem className="basis-[72%] pl-4 sm:basis-[42%] lg:basis-[26%]">
          <a
            href={instagram}
            target="_blank"
            rel="noopener"
            className="flex aspect-[3/4] flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-dashed bg-card p-8 text-center transition-colors hover:bg-muted"
          >
            <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
              <IconoInstagram className="size-7" />
            </span>
            <span className="text-lg font-semibold">Más de 2.400 publicaciones</span>
            <span className="text-sm text-muted-foreground">Seguinos en @casa_esusy</span>
          </a>
        </CarouselItem>
      </CarouselContent>
      <div className="contenedor">
        <Button asChild variant="link" className="h-auto px-0 text-base text-foreground">
          <Link href="/proyectos">
            Ver todos los trabajos <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </Carousel>
  );
}
